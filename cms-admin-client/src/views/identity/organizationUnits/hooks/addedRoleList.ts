import { OrganizationUnitService, IdentityRoleDto } from "@/openapi";

export const useAddedRoleList = () => {
  const roleList = ref<IdentityRoleDto[]>();
  const id = ref("");
  const pageable = reactive<Pageable>({
    pageNum: 1,
    pageSize: 10,
    total: 0,
  });

  watch(
    () => [pageable.pageNum, pageable.pageSize],
    async () => {
      await getAddedRoles(id.value);
    }
  );

  const getAddedRoles = async (val: string) => {
    id.value = val;
    const roleRes = await OrganizationUnitService.organizationUnitGetRoles({
      id: val,
      skipCount: (pageable.pageNum - 1) * pageable.pageSize,
      maxResultCount: pageable.pageSize,
    });
    roleList.value = (roleRes.items || []).concat(roleList.value || []);
    pageable.total = roleRes.totalCount!;
    return roleRes.items?.length || 0;
  };

  return { roleList, pageable, getAddedRoles };
};
