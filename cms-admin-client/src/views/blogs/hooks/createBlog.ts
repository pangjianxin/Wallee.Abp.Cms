import { BlogAdminService, CreateBlogDto } from "@/openapi";
export const useCreateBlogForm = () => {
  const form = reactive<CreateBlogDto>({
    name: "",
    slug: "",
  });

  const formRules = {
    name: [(v: string) => !!v || "博客名称是必须的"],
    slug: [(v: string) => !!v || "slug是必须的"],
  };

  const submit = async () => {
    const res = await BlogAdminService.blogAdminCreate({ requestBody: form });
    return res;
  };

  return { form, formRules, submit };
};
