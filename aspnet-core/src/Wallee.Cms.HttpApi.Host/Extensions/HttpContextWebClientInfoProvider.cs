using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;
using System;
using System.Linq;
using Volo.Abp.AspNetCore.WebClientInfo;
using Volo.Abp.DependencyInjection;

namespace Wallee.Cms.Extensions
{
    public class HttpContextWebClientInfoProvider : IWebClientInfoProvider, ITransientDependency
    {
        protected ILogger<Volo.Abp.AspNetCore.WebClientInfo.HttpContextWebClientInfoProvider> Logger { get; }
        protected IHttpContextAccessor HttpContextAccessor { get; }

        public HttpContextWebClientInfoProvider(
            ILogger<Volo.Abp.AspNetCore.WebClientInfo.HttpContextWebClientInfoProvider> logger,
            IHttpContextAccessor httpContextAccessor)
        {
            Logger = logger;
            HttpContextAccessor = httpContextAccessor;
        }

        public string? BrowserInfo => GetBrowserInfo();

        public string? ClientIpAddress => GetClientIpAddress();

        protected virtual string? GetBrowserInfo()
        {
            return HttpContextAccessor.HttpContext?.Request?.Headers?["User-Agent"];
        }

        protected virtual string GetClientIpAddress()
        {
            try
            {
                StringValues clientIp = StringValues.Empty;
                //X-Real-IP
                var hasValue = HttpContextAccessor.HttpContext?.Request.Headers.TryGetValue("X-Forwarded-For", out clientIp);

                if (hasValue == true)
                {
                    return clientIp.ToString().Split(new char[] { ',' }).DefaultIfEmpty().FirstOrDefault()!;
                }

                return HttpContextAccessor.HttpContext?.Connection?.RemoteIpAddress?.ToString()!;
            }
            catch (Exception ex)
            {
                Logger.LogException(ex, LogLevel.Warning);
                return null!;
            }
        }
    }
}
