import { IdentityUserDto, OrganizationUnitService } from "@/openapi";

export const useAddedUserList = () => {
  const userList = ref<IdentityUserDto[]>();
  const userFilter = ref("");
  const pageable = reactive<Pageable>({
    pageNum: 1,
    pageSize: 10,
    total: 0,
  });

  const getUsers = async (orgId: string): Promise<number> => {
    const usersRes = await OrganizationUnitService.organizationUnitGetUsers({
      id: orgId,
      filter: userFilter.value,
      skipCount: (pageable.pageNum - 1) * pageable.pageSize,
      maxResultCount: pageable.pageSize,
    });
    userList.value = (usersRes.items || []).concat(userList.value || []);
    pageable.total = usersRes.totalCount!;
    return usersRes.items?.length || 0;
  };

  return { userList, userFilter, pageable, getUsers };
};
