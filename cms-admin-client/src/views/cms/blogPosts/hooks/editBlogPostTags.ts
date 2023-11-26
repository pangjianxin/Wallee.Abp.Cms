import { EntityTagAdminService, EntityTagSetDto } from "@/openapi";
export const useEditBlogPostTagsForm = () => {
  const form = reactive<EntityTagSetDto>({
    entityId: "",
    entityType: "BlogPost",
    tags: [],
  });

  const formRules = {
    entityId: [
      (v: string) => {
        if (v === "" || !!v) {
          return `实体ID不能为空`;
        }
        return true;
      },
    ],
    entityType: [
      (v: string) => {
        if (v === "" || !!v) {
          return `实体类型不能为空`;
        }
        return true;
      },
    ],
    tags: [
      (v: string[]) => {
        if (v.length === 0 || !!v) {
          return ``;
        }
        return true;
      },
    ],
  };

  const submit = async () => {
    await EntityTagAdminService.entityTagAdminSetEntityTags({
      requestBody: form,
    });
  };

  return { form, formRules, submit };
};
