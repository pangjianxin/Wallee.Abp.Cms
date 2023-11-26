import {
  BlogPostAdminService,
  BlogPostDto,
  UpdateBlogPostDto,
} from "@/openapi";

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

  const init = (blogPost: BlogPostDto) => {
    form.title = blogPost.title!;
    form.slug = blogPost.slug!;
    form.shortDescription = blogPost.shortDescription!;
    form.content = blogPost.content!;
    form.coverImageMediaId = blogPost.coverImageMediaId!;
    form.concurrencyStamp = blogPost.concurrencyStamp!;
  };

  const submit = async (blogPostId: string) => {
    const res = await BlogPostAdminService.blogPostAdminUpdate({
      id: blogPostId,
      requestBody: form,
    });

    return res;
  };

  return { form, formRules, init, submit };
};
