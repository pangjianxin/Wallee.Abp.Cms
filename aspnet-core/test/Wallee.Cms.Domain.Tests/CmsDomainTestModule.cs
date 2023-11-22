using Volo.Abp.Modularity;

namespace Wallee.Cms;

[DependsOn(
    typeof(CmsDomainModule),
    typeof(CmsTestBaseModule)
)]
public class CmsDomainTestModule : AbpModule
{

}
