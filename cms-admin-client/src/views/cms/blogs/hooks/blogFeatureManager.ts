import { BlogFeatureAdminService, BlogFeatureInputDto } from "@/openapi";

export const useBlogFeatureManager = () => {
  const form = ref<BlogFeatureInputDto[]>([]);

  const fetchFeatures = async (blogId: string) => {
    const res = await BlogFeatureAdminService.blogFeatureAdminGetList({
      blogId: blogId,
    });
    form.value = res.map((it) => {
      return { featureName: it.featureName!, isEnabled: it.isEnabled };
    });
  };

  const submit = async (blogId: string) => {
    if (form.value.length === 0) return;
    form.value.forEach(async (it) => {
      await BlogFeatureAdminService.blogFeatureAdminSet({
        blogId: blogId,
        requestBody: it,
      });
    });
  };

  return { form, fetchFeatures, submit };
};
