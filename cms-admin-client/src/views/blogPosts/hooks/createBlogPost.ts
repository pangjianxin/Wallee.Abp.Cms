import {
  BlogPostAdminService,
  CreateBlogPostDto,
} from "@/openapi";

export const useCreateBlogPostForm = () => {
  const form = reactive<CreateBlogPostDto>({
    blogId: "",
    title: "",
    slug: "",
    shortDescription: undefined,
    content: undefined,
    coverImageMediaId: undefined,
  });

  const formRules = {
    blogId: [
      (v: string) => {
        if (v === "" || !v) {
          return "请选择博客";
        }
        return true;
      },
    ],
    title: [
      (v: string) => {
        if (v === "" || !v) {
          return "请填写标题";
        }
        return true;
      },
    ],
    slug: [
      (v: string) => {
        if (v === "" || !v) {
          return "请填写SLUG";
        }
        return true;
      },
    ],
    shortDescription: [],
    content: [],
    coverImageMediaId: [],
  };

  const submit = async () => {
    await BlogPostAdminService.blogPostAdminCreate({ requestBody: form });
  };

  return { form, formRules, submit };
};
