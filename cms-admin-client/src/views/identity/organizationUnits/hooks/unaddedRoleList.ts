import { IdentityRoleDto, OrganizationUnitService } from "@/openapi";

export const useUnaddedRoleList = () => {
  const unaddedRoleList = ref<IdentityRoleDto[]>();
  const id = ref("");
  const pageable = reactive<Pageable>({
    pageNum: 1,
    pageSize: 5,
    total: 0,
  });

  const pageCount = computed(() =>
    Math.ceil(pageable.total / pageable.pageSize)
  );

  watch(
    () => [pageable.pageNum, pageable.pageSize],
    async () => {
      await getUnaddedRoles(id.value);
    }
  );
  const getUnaddedRoles = async (val: string) => {
    id.value = val;
    const roleRes =
      await OrganizationUnitService.organizationUnitGetUnaddedRoles({
        id: id.value,
        skipCount: (pageable.pageNum - 1) * pageable.pageSize,
        maxResultCount: pageable.pageSize,
      });
    unaddedRoleList.value = roleRes.items!;
    pageable.total = roleRes.totalCount!;
  };

  return { unaddedRoleList, pageCount, pageable, getUnaddedRoles };
};
