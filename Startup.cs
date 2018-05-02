using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using app3.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc.Formatters;
using System.Globalization;

namespace app3
{
    public class Startup
    {
        public IConfigurationRoot Configuration { get; }
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();

            if (env.IsDevelopment())
            {
                // For more details on using the user secret store see https://go.microsoft.com/fwlink/?LinkID=532709
                //builder.AddUserSecrets();
            }
            Configuration = builder.Build();
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc();            
            string connStr = Configuration.GetConnectionString("LOCAL"); //AWS-DEV or LOCAL
            services.AddDbContext<EmployeeContext>(options => options.UseSqlServer(connStr));
			services.AddCors(options =>
			{
				options.AddPolicy("CorsPolicy",
					builder => builder.AllowAnyOrigin()//TODO: add production urls here
					.AllowAnyMethod()
					.AllowAnyHeader()
					.AllowCredentials());
			});
			services.AddMvc(options =>
			{
				/*************************************************************
                 Add support for XML since JSON is default format.
				 On GET - set request header Accept: application/xml
				 On POST - set request header Content_type: application/xml
                *************************************************************/
				options.OutputFormatters.Add(new XmlSerializerOutputFormatter());
				options.InputFormatters.Add(new XmlSerializerInputFormatter());

			});

			 
		}

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

			var cultureInfo = new CultureInfo("en-AU");
			CultureInfo.DefaultThreadCurrentCulture = cultureInfo;
			CultureInfo.DefaultThreadCurrentUICulture = cultureInfo;

			app.UseCors("CorsPolicy");
			app.UseMvc();
		}
    }
}
