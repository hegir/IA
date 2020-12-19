using System;

namespace IA.Notifications.Listener
{
    public interface INotificationManager
    {
        void Dispose();
        void RegisterListeninigCallback(string listeningSubject, object caller, NotificationReceived notificationReceivedCallback);
        void UnregisterListeningCallback(string listeningSubject, object caller);
        void RegisterListeninigDataCallback(string listeningSubject, object caller, NotificationDataReceived notificationDataReceivedCallback);
        void RegisterListeninigDataServerCallback(string listeningSubject, object caller, NotificationDataServerReceived notificationDataReceivedCallback);
    }
}