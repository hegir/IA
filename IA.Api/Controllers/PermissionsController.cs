using IA.Repository.Base;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using IA.Api.Attributes;
using IA.Model;
using IA.Repository;
using System.Threading.Tasks;

namespace IA.Api.Controllers
{
    [Route("api/permissions")]
    [ApiController]
    [Authorize]
    public class PermissionsController : RepositoryController<string, Permission>
    {
        private readonly IRepositoryPermission _repositoryPermission;
        public PermissionsController(IRepositoryPermission repositoryPermission, ILogger<PermissionsController> logger, ISessionManager sessionManager) : base(repositoryPermission, logger, sessionManager)
        {
            _repositoryPermission = repositoryPermission;
        }

        [HttpGet]
        [Route("")]
        [Permission("P_PERMISSIONS")]
        public override async Task<IActionResult> GetAll()
        {
            return Ok(_repositoryPermission.FindAll());
        }


        [HttpGet]
        [Route("{id}")]
        [Permission("P_PERMISSIONS")]
        public override async Task<IActionResult> Get(string id)
        {
            return await base.Get(id);
        }



        [HttpGet]
        [Route("count")]
        [Permission("P_PERMISSIONS")]
        public override async Task<IActionResult> Count()
        {
            return await base.Count();
        }


        [HttpPost]
        [Route("")]
        [Permission("P_PERMISSIONS_EDIT")]
        public IActionResult Post([FromBody] Permission entity)
        {
            _repositoryPermission.Insert(entity);
            return Ok();
        }


        [HttpDelete]
        [Route("{id}")]
        [Permission("P_PERMISSIONS_EDIT")]
        public IActionResult Delete(string id)
        {
            _repositoryPermission.Delete(id);
            return Ok();
        }

    }
}
