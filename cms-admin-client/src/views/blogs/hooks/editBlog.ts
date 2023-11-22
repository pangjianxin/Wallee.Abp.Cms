import { BlogAdminService, UpdateBlogDto } from "@/openapi";

export const useEditBlogForm = () => {
  const blogId = ref("");
  const form = reactive<UpdateBlogDto>({
    name: "",
    slug: "",
    concurrencyStamp: null,
  });

  const formRules = {
    name: [
      (v: string) => {
        if (v === "" || !v) {
          return `博客名称必填`;
        }
        return true;
      },
    ],
    slug: [
      (v: string) => {
        if (v === "" || !v) {
          return `博客SLUG必填`;
        }
        return true;
      },
    ],
    concurrencyStamp: [],
  };

  const submit = async () => {
    const res = await BlogAdminService.blogAdminUpdate({
      id: blogId.value,
      requestBody: form,
    });
    return res;
  };

  return { form, formRules, blogId, submit };
};
