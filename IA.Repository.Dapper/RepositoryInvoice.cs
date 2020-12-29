using IA.Repository.Base;
using IA.Model;
using IA.Repository.Base.Dapper;
using System.Collections.Generic;
using Dapper;
using System.Threading;

namespace IA.Repository.Dapper
{
    public class RepositoryInvoice : RepositoryBase<int, Invoice>, IRepositoryInvoice
    {

        public RepositoryInvoice(IConnectionFactory connectionFactory, ISessionScopeFactory sessionScopeFactory) : base(connectionFactory, sessionScopeFactory)
        {

        }

        public int CountAll(int userId)
        {
            string query = @"select count(1) from invoices i where i.added_by = @userId";

            ISessionScope sc = _sessionScopeFactory.Find(Thread.CurrentThread);
            if (sc != null)
            {
                using (DataAccessBase db = new DataAccessBase(sc.Connection))
                {
                    return db.DbConnection.QuerySingleOrDefault<int>(query, new { userId });
                }
            }
            else
            {
                using (DataAccessBase db = new DataAccessBase(_connectionFactory.GetConnection, _connectionFactory.Transaction))
                {
                    return db.DbConnection.QuerySingleOrDefault<int>(query, new { userId });

                }
            }
        }

        public IEnumerable<Invoice> FindAll(int userId)
        {
            string query = @"select i.*,
(SELECT SUM(quantity * price) FROM invoice_items WHERE invoice_id = i.id) AS price_without_vat,
(SELECT SUM((quantity * price) * (coalesce(rabat,0)/100)) FROM invoice_items WHERE invoice_id = i.id) AS rabat_value
from invoices i where i.added_by = @userId ORDER BY i.id desc";

            ISessionScope sc = _sessionScopeFactory.Find(Thread.CurrentThread);
            if (sc != null)
            {
                using (DataAccessBase db = new DataAccessBase(sc.Connection))
                {
                    return db.DbConnection.Query<Invoice>(query, new { userId });
                }
            }
            else
            {
                using (DataAccessBase db = new DataAccessBase(_connectionFactory.GetConnection, _connectionFactory.Transaction))
                {
                    return db.DbConnection.Query<Invoice>(query, new { userId });
                }
            }
        }


        public override Invoice TryFind(int id)
        {
            ISessionScope sc = _sessionScopeFactory.Find(Thread.CurrentThread);
            string query = @"SELECT i.*,
(SELECT SUM(quantity * price) FROM invoice_items WHERE invoice_id = i.id) AS price_without_vat,
(SELECT SUM((quantity * price) * (coalesce(rabat,0)/100)) FROM invoice_items WHERE invoice_id = i.id) AS rabat_value
FROM invoices i
WHERE i.id = @id
";
            if (sc != null)
            {
                using (DataAccessBase db = new DataAccessBase(sc.Connection))
                {
                    return db.DbConnection.QuerySingleOrDefault<Invoice>(query, new { id });
                }
            }
            else
            {
                using (DataAccessBase db = new DataAccessBase(_connectionFactory.GetConnection, _connectionFactory.Transaction))
                {
                    return db.DbConnection.QuerySingleOrDefault<Invoice>(query, new { id });

                }
            }
        }
    }
}
