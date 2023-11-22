import { defineStore } from "pinia";
import {
  ApplicationConfigurationDto,
  ApplicationLocalizationConfigurationDto,
  ApplicationAuthConfigurationDto,
  ApplicationSettingConfigurationDto,
  CurrentUserDto,
  CurrentTenantDto,
  AbpApplicationConfigurationService,
  ApplicationFeatureConfigurationDto,
} from "@/openapi/index";

export const useServerConfigStore = defineStore(
  "server-config",
  () => {
    const state = reactive<ApplicationConfigurationDto>({
      localization: undefined,
      auth: undefined,
      features: undefined,
      setting: undefined,
      currentUser: undefined,
      multiTenancy: undefined,
      currentTenant: undefined,
      timing: undefined,
      clock: undefined,
    });

    const isPermitted = (permissionName: string) => {
      return state.auth?.grantedPolicies![permissionName] !== undefined;
    };

    const localization = computed<
      ApplicationLocalizationConfigurationDto | undefined
    >(() => state.localization);

    const features = computed<ApplicationFeatureConfigurationDto>(
      () => state.features!
    );

    const auth = computed<ApplicationAuthConfigurationDto | undefined>(
      () => state.auth
    );

    const setting = computed<ApplicationSettingConfigurationDto | undefined>(
      () => state.setting
    );

    const currentUser = computed<CurrentUserDto | undefined>(
      () => state.currentUser
    );

    const isAuthenticated = computed<boolean | undefined>(
      () => state.currentUser?.isAuthenticated
    );

    const currentTenant = computed<CurrentTenantDto | undefined>(
      () => state.currentTenant
    );

    const initConfig = async () => {
      const config =
        await AbpApplicationConfigurationService.abpApplicationConfigurationGet(
          { includeLocalizationResources: false }
        );
      if (config) {
        state.localization = config.localization;
        state.auth = config.auth;
        state.setting = config.setting;
        state.currentUser = config.currentUser;
        state.currentTenant = config.currentTenant;
        state.features = config.features;
      }
    };

    return {
      state,
      features,
      localization,
      auth,
      setting,
      currentTenant,
      currentUser,
      isAuthenticated,
      isPermitted,
      initConfig,
    };
  },
  {
    persist: {
      storage: localStorage,
      paths: [
        "state.localization",
        "state.features",
        "state.auth",
        "state.setting",
        "state.currentUser",
        "state.currentTenant",
      ],
      key: "server-config",
    },
  }
);
