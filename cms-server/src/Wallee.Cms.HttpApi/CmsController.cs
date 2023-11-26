using Volo.Abp.AspNetCore.Mvc;
using Wallee.Cms.Localization;

namespace Wallee.Cms;

/* Inherit your controllers from this class.
 */
public abstract class CmsController : AbpControllerBase
{
    protected CmsController()
    {
        LocalizationResource = typeof(CmsResource);
    }
}
