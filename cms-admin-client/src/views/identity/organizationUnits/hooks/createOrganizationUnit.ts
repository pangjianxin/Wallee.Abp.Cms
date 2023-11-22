import { OrganizationUnitService, OrganizationUnitCreateDto } from "@/openapi";
import { useGlobalStore } from "@/store/globalStore";
import { SubmitEventPromise } from "vuetify";

export const useCreateOrganizationUnitForm = () => {
  const createFormValid = ref(false);
  const createForm = reactive<OrganizationUnitCreateDto>({
    extraProperties: { OrgNo: "" },
    displayName: "",
    parentId: null,
  });
  const createFormRules = {
    extraProperties: { OrgNo: [(val: string) => !!val || "机构号必填"] },
    displayName: [(val: string) => !!val || "机构名称必填"],
    parentId: [],
  };

  const initCreateForm = (parentId: string | null | undefined) => {
    createForm.parentId = parentId;
  };

  const submitCreateOrganizationUnit = async (e: SubmitEventPromise) => {
    e.preventDefault();
    createFormValid.value = (await e).valid;
    if (createFormValid.value === true) {
      const { setLoading, setSnackbarText } = useGlobalStore();
      try {
        setLoading(true);
        await OrganizationUnitService.organizationUnitCreate({
          requestBody: createForm,
        });
        setSnackbarText("创建成功");
      } finally {
        setLoading(false);
      }
    }
    return createFormValid.value;
  };

  return {
    createForm,
    createFormRules,
    createFormValid,
    initCreateForm,
    submitCreateOrganizationUnit,
  };
};
