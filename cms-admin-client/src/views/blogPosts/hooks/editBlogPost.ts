import { BlogPostAdminService, UpdateBlogPostDto } from "@/openapi";

export const useEditBlogPostForm = () => {
  const form = reactive<UpdateBlogPostDto>({
    title: "",
    slug: "",
    shortDescription: undefined,
    content: undefined,
    coverImageMediaId: undefined,
    concurrencyStamp: undefined,
  });

  const formRules = {
    title: [(v: string) => !!v || "Title is required"],
    slug: [(v: string) => !!v || "Title is required"],
    shortDescription: [],
    content: [],
    coverImageMediaId: [],
    concurrencyStamp: [],
  };

  const submit = async (blogPostId: string) => {
    const res = await BlogPostAdminService.blogPostAdminUpdate({
      id: blogPostId,
      requestBody: form,
    });

    return res;
  };

  return { form, formRules, submit };
};
