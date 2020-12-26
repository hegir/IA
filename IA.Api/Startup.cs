using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IA.Notifications.Listener;
using IA.Repository.Autofac;
using IA.Repository.Base;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using IA.Api.Attributes;
using IA.Cache;
using IA.Providers;
using IA.Repository;
using IApplicationLifetime = Microsoft.AspNetCore.Hosting.IApplicationLifetime;
using IA.Repository.Base.Dapper;
using Autofac;
using IA.Repository.Dapper;

namespace IA.Api
{
    public class Startup
    {
        private readonly IConfiguration _configuration;
        private ILogger _logger;
        private IServiceProvider _serviceProvider;

        public Startup(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public IConfiguration Configuration { get; }


        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSwaggerGen();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "IA Api", Version = "v1", });
                c.ResolveConflictingActions(apiDescription => apiDescription.First());

            });
            services.AddControllers()
         .AddJsonOptions(opts => opts.JsonSerializerOptions.PropertyNamingPolicy = null);
            services.AddCors(options =>
            {
                options.AddPolicy("foo",
                builder =>
                {
                    builder
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .SetIsOriginAllowed((host) => true)
                    .AllowCredentials();
                });
            });
            services.AddControllers();

            services.AddRazorPages();


            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetValue<string>("Token:ServerKey")))
                    };
                    options.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            var accessToken = context.Request.Query["access_token"];

                            var path = context.HttpContext.Request.Path;
                            if (!string.IsNullOrEmpty(accessToken) &&
                                (path.StartsWithSegments("/api/signalr")))
                            {
                                context.Token = accessToken;
                            }
                            return Task.CompletedTask;
                        }
                    };
                });
            services.AddAuthorization(options =>
            {
                var defaultAuthorizationpolicyBuilder = new AuthorizationPolicyBuilder(
                    JwtBearerDefaults.AuthenticationScheme);
                defaultAuthorizationpolicyBuilder = defaultAuthorizationpolicyBuilder.RequireAuthenticatedUser();
                options.DefaultPolicy = defaultAuthorizationpolicyBuilder.Build();
            });

            services.AddAuthorization(options =>
            {
                options.AddPolicy("Permission", policyBuilder =>
                 {
                     policyBuilder.Requirements.Add(new PermissionAuthorizationRequirement());
                 });
            });
            services.AddHttpContextAccessor();
        }
        public void ConfigureContainer(ContainerBuilder containerBuilder)
        {
            IContainer container = null;
            containerBuilder.Register(c => container).AsSelf();
            containerBuilder.RegisterBuildCallback(c => container = (IContainer)c);
            containerBuilder.RegisterType<RepositoryUser>().As<IRepositoryUser>();
            containerBuilder.RegisterType<RepositoryRole>().As<IRepositoryRole>();
            containerBuilder.RegisterType<RepositoryPermission>().As<IRepositoryPermission>();
            containerBuilder.RegisterType<RepositoryRolePermission>().As<IRepositoryRolePermission>();
            containerBuilder.RegisterType<SessionScope>().As<ISessionScope>();
            containerBuilder.RegisterType<SessionScopeFactory>().As<ISessionScopeFactory>().SingleInstance();
            containerBuilder.Register(c => new ConnectionFactory(Program.Configuration, "IAConnection", true)).As<IConnectionFactory>();
            containerBuilder.Register(s => new SessionManager(s.Resolve<IContainer>())).As<ISessionManager>().SingleInstance();
            containerBuilder.RegisterType<RepositoryRefreshToken>().As<IRepositoryRefreshToken>();
            containerBuilder.RegisterType<SecurityProvider>().As<ISecurityProvider>();
            containerBuilder.RegisterType<TokenProvider>().As<ITokenProvider>();
            containerBuilder.RegisterType<CacheProvider>().As<ICacheProvider>().SingleInstance();
            containerBuilder.Register(c => new NotificationManager(Program.Configuration.GetConnectionString("IAConnection"))).As<INotificationManager>().SingleInstance();
            containerBuilder.RegisterType<PermissionAuthorizationHandler>().As<IAuthorizationHandler>().SingleInstance();
            containerBuilder.RegisterType<RepositoryInvoice>().As<IRepositoryInvoice>();
            containerBuilder.RegisterType<RepositoryInvoiceItem>().As<IRepositoryInvoiceItem>();

            
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILoggerFactory loggerFactory, IApplicationLifetime applicationLifetime, ILogger<Startup> logger)
        {
            _logger = logger;

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseSwagger();

            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "IA Api");
            });

            app.UseDeveloperExceptionPage();

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseCors("foo");

            app.UseAuthentication();
            app.UseAuthorization();


            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            _serviceProvider = app.ApplicationServices;

            applicationLifetime.ApplicationStarted.Register(OnApplicationStart);
            applicationLifetime.ApplicationStopped.Register(OnApplicationStop);

        }

        private void OnApplicationStart()
        {
            _logger.LogInformation("IA Api started");
            _serviceProvider.GetService<ICacheProvider>().Start();
        }

        private void OnApplicationStop()
        {
            _logger.LogInformation("IA Api stopped");
            _serviceProvider.GetService<ICacheProvider>().Stop();
        }
    }
}
