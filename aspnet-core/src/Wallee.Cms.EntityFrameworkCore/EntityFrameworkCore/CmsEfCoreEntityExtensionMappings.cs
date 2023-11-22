using Microsoft.EntityFrameworkCore;
using Volo.Abp.Identity;
using Volo.Abp.ObjectExtending;
using Volo.Abp.Threading;

namespace Wallee.Cms.EntityFrameworkCore;

public static class CmsEfCoreEntityExtensionMappings
{
    private static readonly OneTimeRunner OneTimeRunner = new OneTimeRunner();

    public static void Configure()
    {
        CmsGlobalFeatureConfigurator.Configure();
        CmsModuleExtensionConfigurator.Configure();

        OneTimeRunner.Run(() =>
        {
            ObjectExtensionManager.Instance
                     .MapEfCoreProperty<OrganizationUnit, string>(
                         "OrgNo",
                         (entityBuilder, propertyBuilder) =>
                         {
                             propertyBuilder.IsRequired();
                             propertyBuilder.HasMaxLength(32);
                             entityBuilder.HasIndex("OrgNo").IsUnique();
                         }
                     );
        });
    }
}
