import { IdentityRoleDto, IdentityRoleUpdateDto, RoleService } from "@/openapi";
import { useGlobalStore } from "@/store/globalStore";

export const useUpdateIdentityRoleForm = () => {
  const updateFormValid = ref(false);
  const identityRoleId = ref("");
  const updateForm = reactive<IdentityRoleUpdateDto>({
    name: "",
    isDefault: false,
    isPublic: false,
    concurrencyStamp: null,
  });
  const updateFormRules = {
    name: [(val: string) => !!val || "请输入角色名称"],
    isDefault: [],
    isPublic: [],
    concurrencyStamp: [],
  };

  const initForm = (input: IdentityRoleDto) => {
    identityRoleId.value = input.id!;
    updateForm.name = input.name!;
    updateForm.isDefault = input.isDefault;
    updateForm.isPublic = input.isPublic;
    updateForm.concurrencyStamp = input.concurrencyStamp;
  };

  const submitUpdateIdentityRole = async () => {
    const { setLoading, setSnackbarText } = useGlobalStore();
    try {
      setLoading(true);
      const res = await RoleService.roleUpdate({
        id: identityRoleId.value,
        requestBody: updateForm,
      });
      setSnackbarText("更新成功");
      return res;
    } finally {
      setLoading(false);
    }
  };
  return {
    updateForm,
    updateFormValid,
    updateFormRules,
    initForm,
    submitUpdateIdentityRole,
  };
};
