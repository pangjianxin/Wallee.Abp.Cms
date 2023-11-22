import { BlogAdminService, BlogDto } from "@/openapi";
export const useBlogList = () => {
  const loading = ref(false);
  const blogsCache = ref<BlogDto[]>([]);
  const filter = ref("");
  const pageable = reactive<Pageable>({
    pageNum: 0,
    pageSize: 10,
    total: 0,
  });

  const onDataChanged = (
    val: BlogDto,
    action: "create" | "remove" | "edit"
  ) => {
    if (action === "create") {
      blogsCache.value.unshift(val);
    } else if (action === "edit") {
      const index = blogsCache.value.findIndex((x) => x.id === val.id);
      if (index >= 0) {
        blogsCache.value.splice(index, 1, val);
      }
    } else if (action === "remove") {
      const index = blogsCache.value.findIndex((x) => x.id === val.id);
      if (index >= 0) {
        blogsCache.value.splice(index, 1);
      }
    }
  };

  const getBlogs = async () => {
    try {
      loading.value = true;
      const res = await BlogAdminService.blogAdminGetList({
        filter: filter.value,
        skipCount: (pageable.pageNum - 1) * pageable.pageSize,
        maxResultCount: pageable.pageSize,
      });

      blogsCache.value = (res.items || []).concat(blogsCache.value || []);
      pageable.total = res.totalCount!;
      return res.items?.length || 0;
    } finally {
      loading.value = false;
    }
  };

  const scrollBlogs = async (pageNum: number) => {
    pageable.pageNum += pageNum;
    return await getBlogs();
  };

  return { loading, blogsCache, filter, pageable, onDataChanged, scrollBlogs };
};
