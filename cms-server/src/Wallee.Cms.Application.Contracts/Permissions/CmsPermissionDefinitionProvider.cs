using Wallee.Cms.Localization;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Localization;
using Volo.Abp.Identity;

namespace Wallee.Cms.Permissions;

public class CmsPermissionDefinitionProvider : PermissionDefinitionProvider
{
    public override void Define(IPermissionDefinitionContext context)
    {
        var myGroup = context.AddGroup(CmsPermissions.GroupName);
        //用户查询权限
        var identityGroup = context.GetGroup(IdentityPermissions.GroupName);
        identityGroup.GetPermissionOrNull(IdentityPermissions.UserLookup.Default)!.Providers.Add(RolePermissionValueProvider.ProviderName);

        //组织机构权限
        var organizationUnits = identityGroup.AddPermission(CmsPermissions.OrganizationUnits.Default, L("Permission:Organization"));
        organizationUnits.AddChild(CmsPermissions.OrganizationUnits.Create, L("Permission:Create"));
        organizationUnits.AddChild(CmsPermissions.OrganizationUnits.Update, L("Permission:Update"));
        organizationUnits.AddChild(CmsPermissions.OrganizationUnits.Delete, L("Permission:Delete"));
        organizationUnits.AddChild(CmsPermissions.OrganizationUnits.ManageRoles, L("Permission:OrganizationUnits:ManageRoles"));
        organizationUnits.AddChild(CmsPermissions.OrganizationUnits.ManageUsers, L("Permission:OrganizationUnits:ManageUsers"));
    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<CmsResource>(name);
    }
}
