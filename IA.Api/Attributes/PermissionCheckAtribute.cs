using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Routing;
using IA.Cache;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace IA.Api.Attributes
{
    public abstract class AttributeAuthorizationHandler<TRequirement, TAttribute> : AuthorizationHandler<TRequirement> where TRequirement : IAuthorizationRequirement where TAttribute : Attribute
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, TRequirement requirement)
        {
            var attributes = new List<TAttribute>();

            if (context.Resource is RouteEndpoint routeEndpoint && routeEndpoint.Metadata != null)
            {
                foreach (var item in routeEndpoint.Metadata)
                {
                    if (!(item is ControllerActionDescriptor action)) continue;
                    attributes.AddRange(GetAttributes(action.ControllerTypeInfo.UnderlyingSystemType));
                    attributes.AddRange(GetAttributes(action.MethodInfo));
                }
            }
            else
            {
                if (!((context.Resource as AuthorizationFilterContext)?.ActionDescriptor is ControllerActionDescriptor action))
                    return HandleRequirementAsync(context, requirement, attributes);
                attributes.AddRange(GetAttributes(action.ControllerTypeInfo.UnderlyingSystemType));
                attributes.AddRange(GetAttributes(action.MethodInfo));
            }

            return HandleRequirementAsync(context, requirement, attributes);
        }

        protected abstract Task HandleRequirementAsync(AuthorizationHandlerContext context, TRequirement requirement, IEnumerable<TAttribute> attributes);

        private static IEnumerable<TAttribute> GetAttributes(MemberInfo memberInfo)
        {
            return memberInfo.GetCustomAttributes(typeof(TAttribute), false).Cast<TAttribute>();
        }
    }

    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true)]
    public class PermissionAttribute : AuthorizeAttribute
    {
        public string Name { get; }

        public PermissionAttribute(string name) : base("Permission")
        {
            Name = name;
        }
    }

    public class PermissionAuthorizationRequirement : IAuthorizationRequirement
    {

    }

    public class PermissionAuthorizationHandler : AttributeAuthorizationHandler<PermissionAuthorizationRequirement, PermissionAttribute>
    {
        public ICacheProvider CacheProvider { get; set; }
        public PermissionAuthorizationHandler(ICacheProvider cacheProvider)
        {
            CacheProvider = cacheProvider;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, PermissionAuthorizationRequirement requirement, IEnumerable<PermissionAttribute> attributes)
        {
            bool authorized = false;
            foreach (var permissionAttribute in attributes)
            {
                {
                    authorized = true;
                    break;
                }
            }

            if (!authorized)
            {
                context.Fail();
            }
            else
            {
                context.Succeed(requirement);
            }

            return Task.CompletedTask;
        }
    }
}
