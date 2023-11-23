using System;
using System.Collections.Generic;
using System.Text;
using Wallee.Cms.Localization;
using Volo.Abp.Application.Services;

namespace Wallee.Cms;

/* Inherit your application services from this class.
 */
public abstract class CmsAppService : ApplicationService
{
    protected CmsAppService()
    {
        LocalizationResource = typeof(CmsResource);
    }
}
