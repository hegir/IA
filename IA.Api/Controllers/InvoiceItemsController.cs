using IA.Repository.Base;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using IA.DTOs;
using IA.Model;
using IA.Repository;
using System;
using IA.Api.Attributes;

namespace IA.Api.Controllers
{
    [Route("/api/invoices/{invoiceId:int}/items")]
    [ApiController]
    [Authorize]
    public class InvoiceItemsController : ControllerBase
    {
        private readonly IRepositoryInvoice _repositoryInvoice;
        private readonly IRepositoryInvoiceItem _repositoryInvoiceItem;
        private readonly ILogger<InvoiceItemsController> _logger;
        private readonly ISessionManager _sessionManager;

        public InvoiceItemsController(
            IRepositoryInvoice repositoryInvoice,
            IRepositoryInvoiceItem repositoryInvoiceItem,
            ILogger<InvoiceItemsController> logger,
            ISessionManager sessionManager
           )
        {
            _logger = logger;
            _sessionManager = sessionManager;
            _repositoryInvoice = repositoryInvoice;
            _repositoryInvoiceItem = repositoryInvoiceItem;
        }


        /// <summary>
        /// Gets the specified identifier.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        [HttpGet]
        [Route("")]
        [Permission("P_INVOICES")]
        public IActionResult Get(int invoiceId)
        {
            return Ok(_repositoryInvoiceItem.Find(x => x.InvoiceId == invoiceId));
        }


        /// <summary>
        /// Posts the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("")]
        [Permission("P_INVOICES")]
        public IActionResult Post([FromBody] InvoiceItem entity, [FromRoute] int invoiceId)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    using (var sc = _sessionManager.Create())
                    {
                        entity.InvoiceId = invoiceId;
                        Invoice invoice = _repositoryInvoice.TryFind(invoiceId);

                        IActionResult validateResult = ValidateInvoice(invoice);

                        if (validateResult != null)
                        {
                            sc.Rollback();
                            return validateResult;
                        }

                        _repositoryInvoiceItem.Insert(entity);

                        sc.Commit();
                    }
                    SaveInvoiceItemDto returnModel = new SaveInvoiceItemDto
                    {
                        Invoice = _repositoryInvoice.TryFind(invoiceId),
                        InvoiceItem = entity
                    };

                    return Ok(returnModel);
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
        public IActionResult Update([FromBody] InvoiceItem entity, [FromRoute] int id, int invoiceId)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    using (var sc = _sessionManager.Create())
                    {
                        try
                        {
                            entity.InvoiceId = invoiceId;
                            Invoice invoice = _repositoryInvoice.TryFind(invoiceId);

                            IActionResult validateResult = ValidateInvoice(invoice);
                            if (validateResult != null)
                            {
                                sc.Rollback();
                                return validateResult;
                            }

                            InvoiceItem existingEntity = _repositoryInvoiceItem.TryFind(id);
                            if (existingEntity == null)
                            {
                                sc.Rollback();
                                return NotFound();
                            }

                            entity.Id = id;
                            _repositoryInvoiceItem.Update(entity);

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
        public IActionResult Delete([FromRoute] int id, int invoiceId)
        {
            try
            {
                Invoice invoice;
                    using (var sc = _sessionManager.Create())
                    {
                        try
                        {
                            invoice = _repositoryInvoice.TryFind(invoiceId);

                            IActionResult validateResult = ValidateInvoice(invoice);
                            if (validateResult != null)
                            {
                                sc.Rollback();
                                return validateResult;
                            }

                            InvoiceItem existingEntity = _repositoryInvoiceItem.TryFind(id);
                            if (existingEntity == null)
                            {
                                sc.Rollback();
                                return NotFound();
                            }

                            _repositoryInvoiceItem.Delete(id);

                            invoice = _repositoryInvoice.TryFind(invoiceId);

                            sc.Commit();
                        }
                        catch (Exception inEx)
                        {
                            sc.Rollback();
                            _logger.LogError(inEx, "Delete {{Type}} ERROR");
                            return StatusCode(StatusCodes.Status500InternalServerError);
                        }
                    }
                    return Ok(invoice);
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
