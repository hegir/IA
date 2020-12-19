using System.Data;

namespace IA.Repository.Base
{
    public interface IConnectionFactory
    {
        IDbConnection GetConnection { get; }
        bool Transaction { get; set; }
    }
}