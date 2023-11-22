import { IdentityRoleCreateDto, RoleService } from "@/openapi";
import { useGlobalStore } from "@/store/globalStore";
export const useCreateIdentityRoleForm = () => {
  const createFormValid = ref(false);
  const createForm = reactive<IdentityRoleCreateDto>({
    name: "",
    isDefault: false,
    isPublic: false,
  });

  const createFormRules = {
    name: [(val: string) => !!val || "角色名必填"],
    isDefault: [],
    isPublic: [],
  };

  const submitCreateIdentityRole = async () => {
    const { setLoading, setSnackbarText } = useGlobalStore();
    try {
      setLoading(true);
      const res = await RoleService.roleCreate({ requestBody: createForm });
      setSnackbarText("创建成功");
      return res;
    } finally {
      setLoading(false);
    }
  };

  return {
    createFormValid,
    createForm,
    createFormRules,
    submitCreateIdentityRole,
  };
};
