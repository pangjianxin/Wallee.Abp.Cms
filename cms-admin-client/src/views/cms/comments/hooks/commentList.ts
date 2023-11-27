import { CommentAdminService, CommentWithAuthorDto } from "@/openapi";
export const useCommentList = () => {
  const entityType = ref("BlogPost");
  const repliedCommentId = ref("");
  const loading = ref(false);
  const list = ref<CommentWithAuthorDto[]>([]);
  const headers = [
    {
      title: "实体类型",
      sortable: false,
      key: "entityType",
    },
    {
      title: "评论内容",
      sortable: true,
      key: "text",
    },
    {
      title: "创建日期",
      sortable: true,
      key: "creationTime",
    },
    {
      title: "作者",
      sortable: true,
      key: "author",
    },
    {
      title: "链接",
      sortable: true,
      key: "url",
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
      const res = await CommentAdminService.commentAdminGetList({
        entityType: entityType.value,
        text: pageable.filter,
        repliedCommentId: repliedCommentId.value,
        //author:
        //creationStartDate
        //creationEndDate
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
