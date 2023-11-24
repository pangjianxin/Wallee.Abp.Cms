import { BlogAdminService, BlogDto } from "@/openapi";
export const useBlogList = () => {
  const loading = ref(false);
  const list = ref<BlogDto[]>([]);
  const filter = ref("");
  const pageable = reactive<Pageable>({
    pageNum: 0,
    pageSize: 10,
    total: 0,
  });

  const headers = [
    {
      title: "博客名称",
      sortable: true,
      key: "name",
    },
    {
      title: "博客SLUG",
      sortable: true,
      key: "slug",
    },
    {
      title: "操作",
      sortable: false,
      key: "actions",
    },
  ];

  const onDataChanged = (
    val: BlogDto,
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

  const getList = async () => {
    try {
      loading.value = true;
      const res = await BlogAdminService.blogAdminGetList({
        filter: filter.value,
        skipCount: (pageable.pageNum - 1) * pageable.pageSize,
        maxResultCount: pageable.pageSize,
      });

      list.value = res.items!;
      pageable.total = res.totalCount!;
      return res.items?.length || 0;
    } finally {
      loading.value = false;
    }
  };

  return { loading, headers, list, filter, pageable, onDataChanged, getList };
};
