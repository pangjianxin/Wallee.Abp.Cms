import { BlogPostAdminService, BlogPostListDto } from "@/openapi";

export const useBlogPostList = () => {
  const loading = ref(false);
  const list = ref<BlogPostListDto[]>([]);

  const pageable = reactive<Pageable>({
    filter: undefined,
    pageNum: 1,
    pageSize: 10,
    total: 0,
    sorting: undefined,
  });

  const headers = [
    {
      title: "菜单",
      key: "menu",
    },
    {
      title: "文章标题",
      sortable: true,
      key: "title",
    },
    {
      title: "文章SLUG",
      sortable: true,
      key: "slug",
    },
    {
      title: "当前状态",
      sortable: true,
      key: "status",
    },
    {
      title: "所属博客",
      sortable: true,
      key: "blogName",
    },
    {
      title: "发布日期",
      sortable: true,
      key: "creationTime",
    },
    {
      title: "短介绍",
      sortable: false,
      key: "shortDescription",
      width: 200,
    },
    {
      title: "操作",
      sortable: false,
      key: "actions",
    },
  ];
  const getList = async () => {
    try {
      loading.value = true;
      const res = await BlogPostAdminService.blogPostAdminGetList({
        filter: pageable.filter,
        sorting: pageable.sorting,
        skipCount: (pageable.pageNum - 1) * pageable.pageSize,
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
    async (newVal, oldVal) => {
      if (newVal != oldVal) {
        await getList();
      }
    },
    { debounce: 300, maxWait: 1000 }
  );
  return { loading, list, pageable, getList, headers };
};
