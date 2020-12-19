using IA.Model.Base;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace IA.Api.Controllers
{
    public interface IRepositoryController<in Tk, in TEntity> where TEntity : IEntity<Tk>, new()
    {
        Task<IActionResult> Count();
        Task<IActionResult> GetAll();
        Task<IActionResult> Get(Tk id);
        Task<IActionResult> Post(TEntity item);
        Task<IActionResult> Put(TEntity item);
        Task<IActionResult> Delete(Tk id);
    }
}