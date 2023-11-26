import { TagAdminService, TagDto, TagUpdateDto } from "@/openapi";
export const useEditTagForm = () => {
  const tagId = ref<string | undefined>(undefined);
  const formValid = ref(false);
  const formRef = ref();
  const form = reactive<TagUpdateDto>({
    name: "",
    concurrencyStamp: null,
  });

  const formRules = {
    name: [(v: string) => !!v || "标签名称不能为空"],
    concurrencyStamp: [(v: string) => !!v || "并发标记不能为空"],
  };
  const submit = async () => {
    return await TagAdminService.tagAdminUpdate({
      id: tagId.value!,
      requestBody: form,
    });
  };

  const init = (tag: TagDto) => {
    tagId.value = tag.id!;
    form.name = tag.name!;
    form.concurrencyStamp = tag.concurrencyStamp!;
  };

  return { form, formValid, formRef, formRules, init, submit, tagId };
};
