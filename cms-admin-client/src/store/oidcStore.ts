import { defineStore } from "pinia";
import { reactive, computed } from "vue";
import { jwtDecode } from "jwt-decode";
export type MaybeNull<T> = T | null | undefined;

export interface OidcState {
  access_token: MaybeNull<string>;
  refresh_token: MaybeNull<string>;
  id_token: MaybeNull<string>;
  expires_at: MaybeNull<number>;
}

export type UserDto = {
  sub: string | null | undefined;
  tenantid?: string;
  preferred_username?: string;
  family_name?: string;
  given_name?: string;
  role?: string[];
  phone_number?: string;
  phone_number_verified?: boolean;
  email?: string;
  email_verified?: boolean;

  organization_unit_code: string | null;
  organization_unit_id: string | null;
};

export const useOidcStore = defineStore(
  "oidc",
  () => {
    const tokenInfo = reactive<OidcState>({
      access_token: null,
      expires_at: null,
      refresh_token: null,
      id_token: null,
    });

    const userInfo = reactive<UserDto>({
      sub: undefined,
      tenantid: undefined,
      preferred_username: undefined,
      family_name: undefined,
      given_name: undefined,
      role: undefined,
      phone_number: undefined,
      phone_number_verified: undefined,
      email: undefined,
      email_verified: undefined,
      organization_unit_code: null,
      organization_unit_id: null,
    });

    const isTokenValid = computed<boolean>(() => {
      const expiredTimeStamp = tokenInfo.expires_at;
      const currentTimeStamp = Date.now();
      return Number(expiredTimeStamp) - currentTimeStamp > 0;
    });

    const storeTokenInfo = (token: any) => {
      tokenInfo.access_token = token.access_token;
      const expires_at = Date.now() + Number(token.expires_in) * 1000;
      tokenInfo.expires_at = expires_at;
      tokenInfo.refresh_token = token.refresh_token;
      tokenInfo.id_token = token.id_token;

      storeUserInfo(token.access_token);
    };

    const storeUserInfo = (access_token: string) => {
      const decode = jwtDecode<UserDto>(access_token);
      userInfo.sub = decode.sub;
      userInfo.tenantid = decode.tenantid;
      userInfo.preferred_username = decode.preferred_username;
      userInfo.family_name = decode.family_name;
      userInfo.given_name = decode.given_name;
      userInfo.role = decode.role;
      userInfo.phone_number = decode.phone_number;
      userInfo.phone_number_verified = decode.phone_number_verified;
      userInfo.email = decode.email;
      userInfo.email_verified = decode.email_verified;

      userInfo.organization_unit_code = decode.organization_unit_code;
      userInfo.organization_unit_id = decode.organization_unit_id;
    };

    const clearState = () => {
      tokenInfo.access_token = undefined;
      tokenInfo.expires_at = undefined;
      tokenInfo.refresh_token = undefined;
      tokenInfo.id_token = undefined;

      userInfo.sub = undefined;
      userInfo.tenantid = undefined;
      userInfo.preferred_username = undefined;
      userInfo.family_name = undefined;
      userInfo.given_name = undefined;
      userInfo.role = undefined;
      userInfo.phone_number = undefined;
      userInfo.phone_number_verified = undefined;
      userInfo.email = undefined;
      userInfo.email_verified = undefined;
    };

    return {
      tokenInfo,
      userInfo,
      isTokenValid,
      storeTokenInfo,
      clearState,
    };
  },
  {
    persist: {
      storage: localStorage,
      paths: ["tokenInfo", "userInfo"],
      key: "oidc-store",
    },
  }
);
