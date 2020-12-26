using IA.Repository.Base;
using IA.Model;
using System.Collections.Generic;

namespace IA.Repository
{
    public interface IRepositoryInvoice : IRepositoryBase<int, Invoice>
    {
        int CountAll(int userId);
        IEnumerable<Invoice> FindAll(int userId);
    }
}
