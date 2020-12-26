using IA.Repository.Base;
using IA.Model;
using IA.Repository.Base.Dapper;

namespace IA.Repository.Dapper
{
    public class RepositoryInvoiceItem : RepositoryBase<int, InvoiceItem>, IRepositoryInvoiceItem
    {

        public RepositoryInvoiceItem(IConnectionFactory connectionFactory, ISessionScopeFactory sessionScopeFactory) : base(connectionFactory, sessionScopeFactory)
        {

        }
    }
}
