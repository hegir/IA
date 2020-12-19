using System;
using System.Data;

namespace IA.Repository.Base.Dapper
{
    public class DataAccessBase : IDataAccess
    {
        public bool UseTransaction { get; private set; }
        public bool ExternalConnection { get; private set; }
        public IDbConnection DbConnection { get; private set; }
        public IDbTransaction DbTransaction { get; private set; }

        public DataAccessBase(IDataAccess connection)
        {
            DbConnection = connection.DbConnection;
            DbTransaction = connection.DbTransaction;
            ExternalConnection = true;
            UseTransaction = connection.UseTransaction;
        }

        public DataAccessBase(IDbConnection connection)
        {
            DbConnection = connection;
            DbConnection.Open();
        }

        public DataAccessBase(IDbConnection connection, bool useTransaction)
        {
            DbConnection = connection;

            UseTransaction = useTransaction;
            DbConnection.Open();
            if (useTransaction)
            {
                BeginTransaction();
            }
        }

        public void BeginTransaction()
        {
            DbTransaction = DbConnection.BeginTransaction();
            UseTransaction = true;
        }

        public void Commit()
        {
            DbTransaction.Commit();
            DbTransaction.Dispose();
            DbTransaction = null;
            UseTransaction = false;
        }

        public void Rollback()
        {
            if (!ExternalConnection && UseTransaction)
            {
                if (DbTransaction.Connection != null)
                    DbTransaction.Rollback();
                DbTransaction.Dispose();
                DbTransaction = null;
                UseTransaction = false;
            }
        }

        public void Dispose()
        {
            if (!ExternalConnection)
            {
                try
                {
                    if (UseTransaction)
                        Commit();
                }
                catch (Exception)
                {
                    if (UseTransaction)
                        Rollback();

                    throw;
                }
                finally
                {
                    if (DbConnection != null)
                    {
                        DbConnection.Close();
                        DbConnection.Dispose();
                        DbConnection = null;
                    }
                }
            }
        }
    }
}