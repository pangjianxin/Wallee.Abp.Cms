import { BlogFeatureAdminService, BlogFeatureInputDto } from "@/openapi";

export const useEditBlogFeature = () => {
  const blogId = ref<string>("");

  const form = ref<BlogFeatureInputDto[]>([]);

  const fetchFeatures = async () => {
    const res = await BlogFeatureAdminService.blogFeatureAdminGetList({
      blogId: blogId.value,
    });
    form.value = res.map((it) => {
      return { featureName: it.featureName!, isEnabled: it.isEnabled };
    });
  };

  const submit = async () => {
    await BlogFeatureAdminService.blogFeatureAdminSet({
      blogId: blogId.value,
    });
  };

  return { blogId, form, fetchFeatures, submit };
};
