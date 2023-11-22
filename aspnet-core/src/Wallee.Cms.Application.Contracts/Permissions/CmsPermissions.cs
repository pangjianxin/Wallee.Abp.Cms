using Volo.Abp.Identity;

namespace Wallee.Cms.Permissions;

public static class CmsPermissions
{
    public const string GroupName = "Cms";

    public class OrganizationUnits
    {
        public const string Default = IdentityPermissions.GroupName + ".OrganizationUnit";
        public const string Update = Default + ".Update";
        public const string Create = Default + ".Create";
        public const string Delete = Default + ".Delete";
        public const string ManageRoles = Default + ".ManageRoles";
        public const string ManageUsers = Default + ".ManageUsers";
    }
}
