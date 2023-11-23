using Wallee.Cms.Localization;
using Volo.Abp.AspNetCore.Mvc;

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
