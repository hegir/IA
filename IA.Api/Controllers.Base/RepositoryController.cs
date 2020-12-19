using IA.Model.Base;
using IA.Repository.Base;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IA.Api.Controllers
{
    public abstract class RepositoryController<TK, TEntity> : ControllerBase, IRepositoryController<TK, TEntity> where TEntity : IEntity<TK>, new()
    {
        protected readonly IRepositoryBase<TK, TEntity> _repository;
        protected readonly ILogger _logger;
        protected readonly ISessionManager _sessionManager;

        public RepositoryController(IRepositoryBase<TK, TEntity> repository, ILogger logger, ISessionManager sessionManager)
        {
            _repository = repository;
            _logger = logger;
            _sessionManager = sessionManager;
        }

        [HttpGet]
        public virtual async Task<IActionResult> Count()
        {
            try
            {
                int count;
                using (var sc = _sessionManager.Create())
                {
                    count = _repository.Count();
                    sc.Commit();
                }
                return Ok(count);
            }
            catch (Exception ex)
            {

                _logger.LogError(ex, "Count() ERROR");
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpGet]
        public virtual async Task<IActionResult> GetAll()
        {
            try
            {
                IEnumerable<TEntity> entities;
                using (var sc = _sessionManager.Create())
                {
                    entities = _repository.FindAll();
                    sc.Commit();
                }
                return Ok(entities);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetAll() ERROR");
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpGet]
        public virtual async Task<IActionResult> Get(TK id)
        {
            try
            {
                TEntity obj;
                using (var sc = _sessionManager.Create())
                {
                    obj = _repository.TryFind(id);
                    sc.Commit();
                }
                if (obj != null)
                    return Ok(obj);
                return NotFound("Item not found");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Get({ID}) ERROR", id);
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }
        [HttpPost]
        public virtual async Task<IActionResult> Post([FromBody] TEntity entity)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    using (var sc = _sessionManager.Create())
                    {
                        var item = _repository.TryFind(entity.Id);

                        if (item != null)
                            _repository.Update(entity);
                        else
                            _repository.Insert(entity);

                        sc.Commit();
                    }
                    return Ok(entity);
                }
                return BadRequest(ModelState);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Post({Type}) ERROR", entity.GetType());
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }
        [HttpPut]
        public virtual async Task<IActionResult> Put([FromBody] TEntity entity)
        {
            return await Post(entity);
        }
        [HttpDelete]
        public virtual async Task<IActionResult> Delete(TK id)
        {
            try
            {
                using (var sc = _sessionManager.Create())
                {
                    try
                    {
                        TEntity entity = _repository.TryFind(id);
                        if (entity == null)
                            return NoContent();

                        _repository.Delete(id);
                    }
                    finally
                    {
                        sc.Commit();
                    }
                }
                return Ok();

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Delete({ID}) ERROR", id);
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }
    }
}
