import { IdentityUserDto, UserService } from "@/openapi";

export const useIdentityUserList = () => {
  const list = ref<IdentityUserDto[]>([]);
  const filter = ref("");
  const loading = ref(false);
  const sortKey = ref<string | undefined>("");
  const sortOrder = ref<string | "asc" | "desc" | undefined>("");

  const sortBy = computed(() => {
    if (sortKey.value && sortOrder.value) {
      return `${sortKey.value} ${sortOrder.value}`;
    }
    return undefined;
  });

  const pageable = reactive<Pageable>({
    pageNum: 0,
    pageSize: 15,
    total: 0,
  });
  const pageSizeArray = [5, 10, 20, 50, 100];

  const pageCount = computed(() =>
    Math.ceil(pageable.total / pageable.pageSize)
  );

  const headers = [
    {
      title: "操作",
      key: "actions",
      sortable: false,
      width: 100,
      align: "start",
    },
    {
      title: "用户",
      sortable: true,
      key: "userName",
      align: "start",
    },
    { title: "姓名", sortable: false, key: "name", align: "start" },
    {
      title: "邮箱",
      sortable: false,
      key: "email",
      align: "start",
    },
  ];

  const onPaginationOptionsChanged = async ({
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
    const sort = sortBy?.[0];
    sortKey.value = sort?.key;
    sortOrder.value = sort?.order;
    await getList();
  };

  const getList = async () => {
    try {
      loading.value = true;
      const res = await UserService.userGetList({
        filter: filter.value,
        sorting: sortBy.value,
        skipCount: (pageable.pageNum - 1) * pageable.pageSize,
        maxResultCount: pageable.pageSize,
      });

      list.value = (res.items || []).concat(list.value || []);
      pageable.total = res.totalCount!;
      return res.items?.length || 0;
    } finally {
      loading.value = false;
    }
  };

  const scrollList = async (pageNum: number) => {
    pageable.pageNum += pageNum;
    return await getList();
  };

  const onDataChanged = (
    val: IdentityUserDto,
    action: "create" | "remove" | "edit"
  ) => {
    if (action === "create") {
      list.value.unshift(val);
    } else if (action === "edit") {
      const index = list.value.findIndex((x) => x.id === val.id);
      if (index >= 0) {
        list.value.splice(index, 1, val);
      }
    } else if (action === "remove") {
      const index = list.value.findIndex((x) => x.id === val.id);
      if (index >= 0) {
        list.value.splice(index, 1);
      }
    }
  };

  watchDebounced(
    () => filter.value,
    async () => {
      list.value = [];
      pageable.pageNum = 0;
      await scrollList(1);
    },
    {
      debounce: 500,
      maxWait: 1000,
    }
  );

  return {
    list,
    filter,
    pageable,
    headers,
    pageCount,
    pageSizeArray,
    scrollList,
    onDataChanged,
    onPaginationOptionsChanged,
    getList,
  };
};
