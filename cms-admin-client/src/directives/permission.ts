import { App } from "vue";
import { useServerConfigStore } from "@/store/serverConfigStore";

export const usePermissionsDirective = (app: App) => {
  const serverConfigStore = useServerConfigStore();
  app.directive("permission", {
    mounted: (el, binding) => {
      if (!serverConfigStore.isPermitted(binding.value)) {
        if (binding.modifiers["disabled"]) {
          el.disabled = true;
        } else {
          el.parentNode?.removeChild(el);
        }
      }
    },
  });
};
