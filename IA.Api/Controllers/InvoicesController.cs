using IA.Repository.Base;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using IA.Model;
using IA.Repository;
using System;
using IA.Api.Attributes;

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
        [Permission("P_INVOICES")]
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
        [Permission("P_INVOICES")]
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
        [Permission("P_INVOICES")]
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
        [Permission("P_INVOICES")]
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
        [Permission("P_INVOICES")]
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

                            IActionResult validateResult = ValidateInvoice(existingEntity);
                            if (validateResult != null)
                            {
                                sc.Rollback();
                                return validateResult;
                            }

                            entity.Id = id;

                            entity.SetStatus();

                            switch(entity.Action)
                            {
                                case Enums.InvoiceAction.Approve:
                                    entity.InvoiceNumber = entity.Id.ToString("000000") + "/" + DateTime.UtcNow.Year;
                                    break;
                            }

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


        /// <summary>
        /// Deletes the specified identifier.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="invoiceId">The invoice identifier.</param>
        /// <returns></returns>
        [HttpDelete]
        [Route("{id:int}")]
        [Permission("P_INVOICES")]
        public IActionResult Delete([FromRoute] int id)
        {
            try
            {
                using (var sc = _sessionManager.Create())
                {
                    try
                    {
                        Invoice invoice = _repositoryInvoice.TryFind(id);

                        IActionResult validateResult = ValidateInvoice(invoice);
                        if (validateResult != null)
                        {
                            sc.Rollback();
                            return validateResult;
                        }

                        _repositoryInvoice.Delete(id);

                        sc.Commit();
                    }
                    catch (Exception inEx)
                    {
                        sc.Rollback();
                        _logger.LogError(inEx, "Delete {{Type}} ERROR");
                        return StatusCode(StatusCodes.Status500InternalServerError);
                    }
                }
                return Ok(true);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Delete {{Type}} ERROR");
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }


        /// <summary>
        /// Validates the invoice.
        /// </summary>
        /// <param name="invoice">The invoice.</param>
        /// <returns></returns>
        private IActionResult ValidateInvoice(Invoice invoice)
        {
            if (invoice == null)
            {
                return NotFound();
            }

            if (invoice.AddedBy != User.GetUserId())
            {
                return Forbid();
            }

            if (invoice.Status == Enums.InvoiceStatus.Approved)
            {
                return BadRequest("CANNOT_MODIFY_APPROVED_INVOICE");
            }

            return null;
        }

    }
}
