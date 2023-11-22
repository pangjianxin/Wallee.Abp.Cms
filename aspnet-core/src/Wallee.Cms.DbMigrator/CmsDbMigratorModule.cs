using Wallee.Cms.EntityFrameworkCore;
using Volo.Abp.Autofac;
using Volo.Abp.Modularity;

namespace Wallee.Cms.DbMigrator;

[DependsOn(
    typeof(AbpAutofacModule),
    typeof(CmsEntityFrameworkCoreModule),
    typeof(CmsApplicationContractsModule)
    )]
public class CmsDbMigratorModule : AbpModule
{
}
