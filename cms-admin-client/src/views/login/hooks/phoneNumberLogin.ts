import { reactive } from "vue";
import { CancelablePromise } from "@/openapi/core/CancelablePromise";
import { request as __request } from "@/openapi/core/request";
import { OpenAPI } from "@/openapi/core/OpenAPI";
import { useGlobalStore } from "@/store/globalStore";

export interface PhoneNumberLogin {
  phone_number: string;
  phone_verify_code: string;
  grant_type: string;
  client_id: string;
  scope: string;
}

export const useLogin = () => {
  const form = reactive({
    phone_number: "",
    phone_verify_code: "",
    grant_type: import.meta.env["VITE_OIDC_GRANT_TYPE_PHONE_VERIFY"],
    client_id: import.meta.env["VITE_OIDC_CLIENT_ID"],
    scope: import.meta.env["VITE_OIDC_SCOPE"],
  });

  const formRules = {
    phone_number: [(val: string) => !!val || "请输入手机号"],

    phone_verify_code: [(val: string) => !!val || "请输入验证码"],
  };

  const phoneNumberLogin = async () => {
    const { setLoading } = useGlobalStore();
    try {
      setLoading(true);
      await __request<
        CancelablePromise<{
          access_token: string;
          token_type: string;
          expires_in: number;
          id_token: string;
        }>
      >(OpenAPI, {
        method: "POST",
        url: "/connect/token",
        body: form,
        mediaType: "application/x-www-form-urlencoded",
        errors: {
          400: `Bad Request`,
          401: `Unauthorized`,
          403: `Forbidden`,
          404: `Not Found`,
          500: `Server Error`,
          501: `Server Error`,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  function getUserInfo() {
    return __request(OpenAPI, {
      method: "GET",
      url: "/connect/userinfo",
      errors: {
        400: `Bad Request`,
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
        500: `Server Error`,
        501: `Server Error`,
      },
    });
  }

  return {
    form,
    formRules,
    phoneNumberLogin,
    getUserInfo,
  };
};
