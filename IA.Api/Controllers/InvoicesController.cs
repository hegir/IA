using IA.Repository.Base;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using IA.Api.Attributes;
using IA.Cache;
using IA.DTOs;
using IA.Model;
using IA.Providers;
using IA.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace IA.Api.Controllers
{
    [Route("/api/invoices")]
    [ApiController]
    [Authorize]
    public class InvoicesController : ControllerBase
    {
        private readonly IRepositoryInvoice _repositoryInvoice;
        private readonly ILogger<InvoicesController> _logger;
        private readonly ISessionManager _sessionManager;

        public InvoicesController(
            IRepositoryInvoice repositoryInvoice,
            ILogger<InvoicesController> logger,
            ISessionManager sessionManager
           )
        {
            _logger = logger;
            _sessionManager = sessionManager;
            _repositoryInvoice = repositoryInvoice;
        }


        /// <summary>
        /// Gets the specified identifier.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        [HttpGet]
        [Route("{id:int}")]
        //[Permission("P_USERS")]
        public IActionResult Get(int id)
        {
            return Ok(_repositoryInvoice.TryFind(id));
        }

        /// <summary>
        /// Gets all.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("count")]
        //[Permission("P_USERS")]
        public IActionResult Count()
        {
            return Ok(_repositoryInvoice.CountAll(User.GetUserId()));
        }

        /// <summary>
        /// Gets all.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("")]
        //[Permission("P_USERS")]
        public IActionResult GetAll()
        {
            return Ok(_repositoryInvoice.FindAll(User.GetUserId()));
        }


        /// <summary>
        /// Posts the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("")]
        public IActionResult Post([FromBody] Invoice entity)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    using (var sc = _sessionManager.Create())
                    {
                        entity.Added = DateTime.UtcNow;
                        entity.AddedBy = User.GetUserId();
                        entity.SetStatus();
                        _repositoryInvoice.Insert(entity);

                        sc.Commit();
                    }
                    return Ok(entity);
                }
                return BadRequest(ModelState);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Post {{Type}} ERROR", entity.GetType());
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }



        /// <summary>
        /// Updates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        [HttpPut]
        [Route("{id:int}")]
        public IActionResult Update([FromBody] Invoice entity, [FromRoute] int id)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    using (var sc = _sessionManager.Create())
                    {
                        try
                        {
                            Invoice existingEntity = _repositoryInvoice.TryFind(id);

                            if (existingEntity == null)
                            {
                                sc.Rollback();
                                return NotFound();
                            }

                            if (existingEntity.AddedBy != User.GetUserId())
                            {
                                sc.Rollback();
                                return Forbid();
                            }

                            if(existingEntity.Status == Enums.InvoiceStatus.Approved)
                            {
                                sc.Rollback();
                                return BadRequest("CANNOT_UPDATE_APPROVED_INVOICE");
                            }

                            entity.Id = id;

                            entity.SetStatus();
                            _repositoryInvoice.Update(entity);

                            sc.Commit();
                        }
                        catch (Exception inEx)
                        {
                            sc.Rollback();
                            _logger.LogError(inEx, "Update {{Type}} ERROR", entity.GetType());
                            return StatusCode(StatusCodes.Status500InternalServerError);
                        }
                    }
                    return Ok(entity);
                }
                return BadRequest(ModelState);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Update {{Type}} ERROR", entity.GetType());
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

    }
}
