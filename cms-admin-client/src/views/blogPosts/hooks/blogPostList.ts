import { BlogPostDto, BlogPostAdminService } from "@/openapi";

export const useBlogPostList = () => {
  const list = ref<BlogPostDto[]>([]);
  const filter = ref<string | undefined>(undefined);
  const pageable = reactive<Pageable>({
    pageNum: 1,
    pageSize: 10,
    total: 0,
  });
  const getList = async () => {
    const res = await BlogPostAdminService.blogPostAdminGetList({
      filter: filter.value,
      skipCount: (pageable.pageNum - 1) * pageable.pageSize,
      maxResultCount: pageable.pageSize,
    });

    list.value = res.items!;
    pageable.total = res.totalCount!;
  };

  return { filter, list, pageable, getList };
};
