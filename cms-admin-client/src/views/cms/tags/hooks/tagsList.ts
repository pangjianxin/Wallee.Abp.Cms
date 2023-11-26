import { TagAdminService, TagDto } from "@/openapi";
export const useTagsList = () => {
  const loading = ref(false);
  const list = ref<TagDto[]>([]);

  const headers = [
    {
      title: "菜单",
      sortable: false,
      key: "menu",
    },
    {
      title: "实体类型",
      sortable: true,
      key: "entityType",
    },
    {
      title: "标签名称",
      sortable: true,
      key: "name",
    },
    {
      title: "创建日期",
      sortable: true,
      key: "creationTime",
    },
  ];
  const pageable = reactive<Pageable>({
    pageNum: 1,
    pageSize: 10,
    total: 0,
    sorting: undefined,
    filter: undefined,
  });
  const onPageOptionUpdated = async ({
    page,
    itemsPerPage,
    sortBy,
  }: {
    page: number;
    itemsPerPage: number;
    sortBy: { key: string; order: string }[] | undefined;
  }) => {
    pageable.pageNum = page;
    pageable.pageSize = itemsPerPage;
    if (sortBy && sortBy.length > 0) {
      pageable.sorting = sortBy[0].key + " " + sortBy[0].order;
    }
    await getList();
  };
  const getList = async () => {
    try {
      loading.value = true;
      const res = await TagAdminService.tagAdminGetList({
        filter: pageable.filter,
        sorting: pageable.sorting,
        skipCount: pageable.pageSize * (pageable.pageNum - 1),
        maxResultCount: pageable.pageSize,
      });
      list.value = res.items!;
      pageable.total = res.totalCount!;
    } finally {
      loading.value = false;
    }
  };

  watchDebounced(
    () => pageable.filter,
    async () => {
      await getList();
    },
    {
      debounce: 300,
      maxWait: 1000,
    }
  );

  return { list, loading, headers, pageable, onPageOptionUpdated, getList };
};
