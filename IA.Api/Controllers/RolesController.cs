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
    [Route("api/roles")]
    [ApiController]
    [Authorize]
    public class RolesController : RepositoryController<string, Role>
    {
        private readonly IRepositoryRole _repositoryRole;
        public RolesController(IRepositoryRole repositoryRole, ILogger<RolesController> logger, ISessionManager sessionManager) : base(repositoryRole, logger, sessionManager)
        {
            _repositoryRole = repositoryRole;
        }

        [HttpGet]
        [Route("")]
        [Permission("P_ROLES")]
        public override async Task<IActionResult> GetAll()
        {
            return Ok(_repositoryRole.FindAll());
        }

        [HttpGet]
        [Route("{id}")]
        [Permission("P_ROLES")]
        public override async Task<IActionResult> Get(string id)
        {
            return await base.Get(id);
        }

        [HttpGet]
        [Route("count")]
        [Permission("P_ROLES")]
        public override async Task<IActionResult> Count()
        {
            return await base.Count();
        }

        [HttpPost]
        [Route("")]
        [Permission("P_ROLES_EDIT")]
        public override async Task<IActionResult> Post([FromBody] Role entity)
        {
            return await base.Post(entity);
        }


        [HttpDelete]
        [Route("{id}")]
        [Permission("P_ROLES_EDIT")]
        public override async Task<IActionResult> Delete(string id)
        {
            _repositoryRole.Delete(id);
            return Ok();
        }

    }
}
