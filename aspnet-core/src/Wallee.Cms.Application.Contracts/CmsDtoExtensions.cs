using Volo.Abp.Identity;
using Volo.Abp.ObjectExtending;
using Volo.Abp.ObjectExtending.Modularity;
using Volo.Abp.Threading;
using Wallee.Cms.Identity.OrganizationUnits.Dtos;

namespace Wallee.Cms;

public static class CmsDtoExtensions
{
    private static readonly OneTimeRunner OneTimeRunner = new OneTimeRunner();

    public static void Configure()
    {
        OneTimeRunner.Run(() =>
        {
            ModuleExtensionConfigurationHelper.ApplyEntityConfigurationToApi(
                IdentityModuleExtensionConsts.ModuleName,
                IdentityModuleExtensionConsts.EntityNames.OrganizationUnit,
                getApiTypes: new[] { typeof(OrganizationUnitDto) },
                createApiTypes: new[] { typeof(OrganizationUnitCreateDto) },
                updateApiTypes: new[] { typeof(OrganizationUnitUpdateDto) }
            );
        });
    }
}
