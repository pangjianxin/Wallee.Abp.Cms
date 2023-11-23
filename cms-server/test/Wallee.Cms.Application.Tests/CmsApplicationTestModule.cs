using Volo.Abp.Modularity;

namespace Wallee.Cms;

[DependsOn(
    typeof(CmsApplicationModule),
    typeof(CmsDomainTestModule)
    )]
public class CmsApplicationTestModule : AbpModule
{

}
