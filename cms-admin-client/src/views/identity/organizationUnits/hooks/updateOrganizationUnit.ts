import {
  OrganizationUnitDto,
  OrganizationUnitService,
  OrganizationUnitUpdateDto,
} from "@/openapi";
import { useGlobalStore } from "@/store/globalStore";
import { SubmitEventPromise } from "vuetify/lib/framework.mjs";
export const useUpdateOrganizationUnitForm = () => {
  const updateFormValid = ref(false);
  const organizationUnitId = ref("");
  const updateForm = reactive<OrganizationUnitUpdateDto>({
    extraProperties: { OrgNo: "" },
    displayName: null,
  });
  const updateFormRules = {
    extraProperties: { OrgNo: [(val: string) => !!val || "机构号必填"] },
    displayName: [(val: string) => !!val || "机构名称必填"],
  };
  const initUpdateForm = (org: OrganizationUnitDto) => {
    organizationUnitId.value = org.id!;
    if (org.extraProperties) {
      for (const key in org.extraProperties) {
        updateForm.extraProperties![key] = org.extraProperties[key];
      }
    }
    updateForm.displayName = org.displayName;
  };
  const submitUpdateOrganizationUnit = async (e: SubmitEventPromise) => {
    updateFormValid.value = (await e).valid;
    if (updateFormValid.value === true) {
      const { setLoading, setSnackbarText } = useGlobalStore();
      try {
        setLoading(true);
        await OrganizationUnitService.organizationUnitUpdate({
          id: organizationUnitId.value,
          requestBody: updateForm,
        });
        setSnackbarText("更新成功");
      } finally {
        setLoading(false);
      }
    }
    return updateFormValid.value;
  };

  return {
    updateForm,
    updateFormValid,
    updateFormRules,
    initUpdateForm,
    submitUpdateOrganizationUnit,
  };
};
