using Volo.Abp.Identity;
using Volo.Abp.ObjectExtending;
using Volo.Abp.ObjectExtending.Modularity;
using Volo.Abp.Threading;
using Wallee.Cms.Identity.OrganizationUnits.Dtos;

namespace Wallee.Cms;

public static class CmsDtoExtensions
{
    private static readonly OneTimeRunner _oneTimeRunner = new();

    public static void Configure()
    {
        _oneTimeRunner.Run(() =>
        {
            ModuleExtensionConfigurationHelper.ApplyEntityConfigurationToApi(
                IdentityModuleExtensionConsts.ModuleName,
                IdentityModuleExtensionConsts.EntityNames.OrganizationUnit,
                getApiTypes: [typeof(OrganizationUnitDto)],
                createApiTypes: [typeof(OrganizationUnitCreateDto)],
                updateApiTypes: [typeof(OrganizationUnitUpdateDto)]
            );
        });
    }
}
