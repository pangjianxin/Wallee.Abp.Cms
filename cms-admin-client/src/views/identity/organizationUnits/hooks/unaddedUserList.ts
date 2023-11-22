import { IdentityUserDto, OrganizationUnitService } from "@/openapi";
export const useUnaddedUserList = () => {
  const id = ref("");
  const unaddedUserList = ref<IdentityUserDto[]>();
  const unAddedUserFilter = ref("");
  const pageable = reactive<Pageable>({
    pageNum: 1,
    pageSize: 10,
    total: 0,
  });

  const pageCount = computed(() =>
    Math.ceil(pageable.total / pageable.pageSize)
  );

  watch(
    () => [pageable.pageNum, pageable.pageSize],
    async () => {
      await getUnaddedUsers(id.value);
    }
  );

  watchDebounced(
    () => unAddedUserFilter.value,
    async (newVal, oldVal) => {
      if (newVal !== oldVal) {
        await getUnaddedUsers(id.value);
      }
    },
    {
      debounce: 300,
      maxWait: 1000,
    }
  );

  const getUnaddedUsers = async (val: string) => {
    id.value = val;
    const usersRes =
      await OrganizationUnitService.organizationUnitGetUnaddedUsers({
        id: id.value,
        filter: unAddedUserFilter.value,
        skipCount: (pageable.pageNum - 1) * pageable.pageSize,
        maxResultCount: pageable.pageSize,
      });
    unaddedUserList.value = usersRes.items!;
    pageable.total = usersRes.totalCount!;
  };

  return {
    unaddedUserList,
    unAddedUserFilter,
    pageable,
    pageCount,
    getUnaddedUsers,
  };
};
