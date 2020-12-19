using Npgsql;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace IA.Notifications.Listener
{
    public delegate void NotificationReceived(string listeningSubject);
    public delegate void NotificationDataReceived(string listeningSubject, string additionalData);
    public delegate void NotificationDataServerReceived(string listeningSubject, string additionalData, string serverName);

    public class NotificationManager : INotificationManager
    {
        private readonly string _connectionString;
        private int _poolingInterval = 1000;
        private bool _pooling;
        private string _serverName;
        private Thread _notificationPoolingThread;
        private List<Action<NpgsqlConnection>> _registerUnregisterActions = new List<Action<NpgsqlConnection>>();
        private Dictionary<string, Dictionary<object, NotificationReceived>> _registeredNotificationCallback;
        private Dictionary<string, Dictionary<object, NotificationDataReceived>> _registeredNotificationDataCallback;
        private Dictionary<string, Dictionary<object, NotificationDataServerReceived>> _registeredNotificationServerDataCallback;
        private ReaderWriterLockSlim _rwl = new ReaderWriterLockSlim(LockRecursionPolicy.SupportsRecursion);

        public NotificationManager(string connectionString, string serverName = "")
        {
            if (string.IsNullOrEmpty(connectionString))
                throw new Exception("Connection string constructor parameter cannot be empty.");

            _connectionString = connectionString;
            _serverName = serverName;

            _registeredNotificationCallback = new Dictionary<string, Dictionary<object, NotificationReceived>>();
            _registeredNotificationDataCallback = new Dictionary<string, Dictionary<object, NotificationDataReceived>>();
            _registeredNotificationServerDataCallback = new Dictionary<string, Dictionary<object, NotificationDataServerReceived>>();

            _notificationPoolingThread = new Thread(NotificationPooler);
            _notificationPoolingThread.Name = "NotificationManagerPoolingThread";

            _pooling = true;
            _notificationPoolingThread.Start();
        }

        private void EnqueueAction(Action<NpgsqlConnection> action)
        {
            lock (_registerUnregisterActions)
            {
                _registerUnregisterActions.Add(action);
            }
        }

        private void NotificationPooler()
        {
            while (_pooling)
            {
                try
                {
                    using (NpgsqlConnection cn = new NpgsqlConnection(_connectionString))
                    {
                        cn.Notification += ConnectionNotification;
                        cn.Open();

                        RegisterAllListeners(cn);

                        while (_pooling)
                        {
                            try
                            {
                                ProcessRegisterUnregisterList(cn);

                                using (NpgsqlCommand cmd = new NpgsqlCommand(";", cn)) //empty command to receive notifications if any
                                    cmd.ExecuteNonQuery();
                            }
                            catch (Exception)
                            {
                                break;
                            }

                            Thread.Sleep(_poolingInterval);
                        }

                        try
                        {
                            cn.Notification -= ConnectionNotification;
                            cn.Close();
                        }
                        catch (Exception)
                        {
                        }
                    }
                }
                catch (Exception)
                {
                    Thread.Sleep(_poolingInterval);
                }
            }
        }

        private void ProcessRegisterUnregisterList(NpgsqlConnection cn)
        {
            List<Action<NpgsqlConnection>> tmpList = new List<Action<NpgsqlConnection>>();

            lock (_registerUnregisterActions)
            {
                tmpList.AddRange(_registerUnregisterActions);
                _registerUnregisterActions.Clear();
            }

            tmpList.ForEach(a => a(cn));
        }

        private void RegisterAllListeners(NpgsqlConnection cn)
        {
            int cnt = 0;
            try
            {
                _rwl.EnterReadLock();

                cnt = _registeredNotificationCallback.Count + _registeredNotificationDataCallback.Count;

                foreach (KeyValuePair<string, Dictionary<object, NotificationReceived>> keyValuePair in _registeredNotificationCallback)
                {
                    RegisterListener(cn, keyValuePair.Key);
                }
                foreach (KeyValuePair<string, Dictionary<object, NotificationDataReceived>> keyValuePair in _registeredNotificationDataCallback)
                {
                    RegisterListener(cn, keyValuePair.Key);
                }
                foreach (KeyValuePair<string, Dictionary<object, NotificationDataServerReceived>> keyValuePair in _registeredNotificationServerDataCallback)
                {
                    RegisterListener(cn, keyValuePair.Key);
                }
            }
            finally
            {
                _rwl.ExitReadLock();
            }
        }

        public void RegisterListeninigCallback(string listeningSubject, object caller, NotificationReceived notificationReceivedCallback)
        {
            try
            {
                _rwl.EnterWriteLock();
                if (!_registeredNotificationCallback.ContainsKey(listeningSubject)) //if we don't have that listeningSubject, we need to create underlaying dictionary for it
                {
                    _registeredNotificationCallback[listeningSubject] = new Dictionary<object, NotificationReceived>();

                    Action<NpgsqlConnection> action = new Action<NpgsqlConnection>((cn) =>
                    {
                        RegisterListener(cn, listeningSubject);
                    });

                    EnqueueAction(action);
                }
                _registeredNotificationCallback[listeningSubject].Add(caller, notificationReceivedCallback);

            }
            finally
            {
                _rwl.ExitWriteLock();
            }
        }

        public void UnregisterListeningCallback(string listeningSubject, object caller)
        {
            try
            {
                _rwl.EnterWriteLock();

                if (_registeredNotificationCallback.ContainsKey(listeningSubject))
                    if (_registeredNotificationCallback[listeningSubject].ContainsKey(caller))
                        _registeredNotificationCallback[listeningSubject].Remove(caller);

                if (_registeredNotificationCallback[listeningSubject].Count == 0)
                {
                    _registeredNotificationCallback.Remove(listeningSubject);

                    Action<NpgsqlConnection> action = new Action<NpgsqlConnection>((cn) =>
                    {
                        UnregisterListener(cn, listeningSubject);
                    });

                    EnqueueAction(action);
                }
            }

            finally
            {
                _rwl.ExitWriteLock();
            }
        }

        private void UnregisterAllListeners(NpgsqlConnection cn)
        {
            int cnt = 0;
            try
            {
                _rwl.EnterReadLock();

                cnt = _registeredNotificationCallback.Count + _registeredNotificationDataCallback.Count;

                foreach (KeyValuePair<string, Dictionary<object, NotificationReceived>> keyValuePair in _registeredNotificationCallback)
                {
                    UnregisterListener(cn, keyValuePair.Key);
                }
                foreach (KeyValuePair<string, Dictionary<object, NotificationDataReceived>> keyValuePair in _registeredNotificationDataCallback)
                {
                    UnregisterListener(cn, keyValuePair.Key);
                }
                foreach (KeyValuePair<string, Dictionary<object, NotificationDataServerReceived>> keyValuePair in _registeredNotificationServerDataCallback)
                {
                    UnregisterListener(cn, keyValuePair.Key);
                }
            }
            finally
            {
                _rwl.ExitReadLock();
            }
        }

        private void UnregisterListener(NpgsqlConnection cn, string listeningSubject)
        {
            if (cn.State == System.Data.ConnectionState.Open)
            {
                using (NpgsqlCommand cmd = new NpgsqlCommand("UNLISTEN " + listeningSubject + ";", cn))
                    cmd.ExecuteNonQuery();
            }
        }

        private void RegisterListener(NpgsqlConnection cn, string listeningSubject)
        {
            if (cn.State == System.Data.ConnectionState.Open)
            {
                using (NpgsqlCommand cmd = new NpgsqlCommand("LISTEN " + listeningSubject + ";", cn))
                    cmd.ExecuteNonQuery();
            }
        }

        void ConnectionNotification(object sender, NpgsqlNotificationEventArgs e)
        {
            try
            {
                _rwl.EnterReadLock();

                Parallel.ForEach(_registeredNotificationCallback, (keyValuePair) =>
                {
                    if (keyValuePair.Key.ToUpper() == e.Condition.ToUpper())
                    {
                        foreach (KeyValuePair<object, NotificationReceived> notificationReceived in keyValuePair.Value)
                        {
                            NotificationReceived(notificationReceived.Value, keyValuePair.Key);
                        }
                    }
                });

                Parallel.ForEach(_registeredNotificationDataCallback, (keyValuePair) =>
                {
                    if (keyValuePair.Key.ToUpper() == e.Condition.ToUpper())
                    {
                        foreach (KeyValuePair<object, NotificationDataReceived> notificationDataReceived in keyValuePair.Value)
                        {
                            AsyncNotificationDataReceived(notificationDataReceived.Value, keyValuePair.Key, e.AdditionalInformation);
                        }
                    }
                });

                Parallel.ForEach(_registeredNotificationServerDataCallback, (keyValuePair) =>
                {
                    if (keyValuePair.Key.ToUpper() == e.Condition.ToUpper())
                    {
                        foreach (KeyValuePair<object, NotificationDataServerReceived> notificationDataReceived in keyValuePair.Value)
                        {
                            AsyncNotificationDataServerReceived(notificationDataReceived.Value, keyValuePair.Key, e.AdditionalInformation, _serverName);
                        }
                    }
                });
            }
            finally
            {
                _rwl.ExitReadLock();
            }
        }

        private void NotificationReceived(NotificationReceived notificationReceivedCallback, string listeningSubject)
        {
            if (notificationReceivedCallback != null)
                notificationReceivedCallback(listeningSubject);
        }

        #region Callback with data

        public void RegisterListeninigDataCallback(string listeningSubject, object caller, NotificationDataReceived notificationDataReceivedCallback)
        {
            try
            {
                _rwl.EnterWriteLock();

                if (!_registeredNotificationDataCallback.ContainsKey(listeningSubject)) //if we don't have that listeningSubject, we need to create underlaying dictionary for it
                {
                    _registeredNotificationDataCallback[listeningSubject] = new Dictionary<object, NotificationDataReceived>();

                    Action<NpgsqlConnection> action = new Action<NpgsqlConnection>((cn) =>
                    {
                        RegisterListener(cn, listeningSubject);
                    });

                    EnqueueAction(action);
                }
                if (!_registeredNotificationDataCallback[listeningSubject].ContainsKey(caller))
                    _registeredNotificationDataCallback[listeningSubject].Add(caller, notificationDataReceivedCallback);

            }
            finally
            {
                _rwl.ExitWriteLock();
            }
        }

        public void RegisterListeninigDataServerCallback(string listeningSubject, object caller, NotificationDataServerReceived notificationDataReceivedCallback)
        {
            try
            {
                _rwl.EnterWriteLock();

                if (!_registeredNotificationServerDataCallback.ContainsKey(listeningSubject)) //if we don't have that listeningSubject, we need to create underlaying dictionary for it
                {
                    _registeredNotificationServerDataCallback[listeningSubject] = new Dictionary<object, NotificationDataServerReceived>();

                    Action<NpgsqlConnection> action = new Action<NpgsqlConnection>((cn) =>
                    {
                        RegisterListener(cn, listeningSubject);
                    });

                    EnqueueAction(action);
                }
                if (!_registeredNotificationServerDataCallback[listeningSubject].ContainsKey(caller))
                    _registeredNotificationServerDataCallback[listeningSubject].Add(caller, notificationDataReceivedCallback);

            }
            finally
            {
                _rwl.ExitWriteLock();
            }
        }

        private void AsyncNotificationDataReceived(NotificationDataReceived notificationdataReceivedCallback, string listeningSubject, string aditionalData)
        {
            if (notificationdataReceivedCallback != null)
                notificationdataReceivedCallback(listeningSubject, aditionalData);
        }

        private void AsyncNotificationDataServerReceived(NotificationDataServerReceived notificationdataReceivedCallback, string listeningSubject, string aditionalData, string serverName)
        {
            if (notificationdataReceivedCallback != null)
                notificationdataReceivedCallback(listeningSubject, aditionalData, serverName);
        }

        #endregion

        #region IDisposable Members

        public void Dispose()
        {
            _pooling = false;

            try
            {
                using (NpgsqlConnection cn = new NpgsqlConnection(_connectionString))
                {
                    try
                    {
                        cn.Open();

                        UnregisterAllListeners(cn);

                        cn.Notification -= ConnectionNotification;
                        cn.Close();
                    }
                    catch (Exception)
                    {
                    }
                }

                _notificationPoolingThread.Abort();
            }
            catch (Exception)
            {
            }
        }

        #endregion
    }
}