using Wallee.Cms.EntityFrameworkCore;
using Volo.Abp.Modularity;

namespace Wallee.Cms;

[DependsOn(
    typeof(CmsEntityFrameworkCoreTestModule)
    )]
public class CmsDomainTestModule : AbpModule
{

}
