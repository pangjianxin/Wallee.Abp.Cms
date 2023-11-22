<template>
    <v-container fluid class="h-100">
        <v-row no-gutters justify="center" align="center" class="h-100">
            <v-col lg="6" md="12">
                <v-card rounded="10">
                    <div class="d-flex flex-row justify-start align-center ma-5">
                        <v-img width="50px" inline :src="logo">
                        </v-img>
                        <div class="d-inline-block bg-black mx-2 my-1 pa-1 h-5"></div>
                        <div class="text-h4 font-weight-bold">会员登录</div>
                    </div>
                    <v-row align="center">
                        <v-col cols="6" v-if="!themeStore.mobile">
                            <v-img :src="loginLeft" cover>
                                <div class="d-flex flex-column fill-height justify-center align-center text-white">
                                    <h1 class="text-h4 font-weight-thin mb-4">
                                        {{ appName }}
                                    </h1>
                                    <h4 class="subheading">
                                        {{ appEngName }}
                                    </h4>
                                </div>
                            </v-img>
                        </v-col>
                        <v-col>
                            <v-tabs v-model="selectedTab" grow>
                                <v-tab value="密码登录">密码登录</v-tab>
                                <v-tab value="短信登录">短信登录</v-tab>
                            </v-tabs>
                            <v-window v-model="selectedTab">
                                <v-window-item value="密码登录">
                                    <passwordLogin @done="onPasswordLoginDone"></passwordLogin>
                                </v-window-item>
                                <v-window-item value="短信登录">
                                    <phoneNumberLogin></phoneNumberLogin>
                                </v-window-item>
                            </v-window>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
<script lang="ts" setup>
import passwordLogin from './components/passwordLogin.vue';
import phoneNumberLogin from './components/phoneNumberLogin.vue';
import loginLeft from '@/assets/login-left.png';
import logo from '@/assets/logo.png';
import { ApiError } from '@/openapi/core/ApiError';
import { useThemeStore } from '@/store/themeStore';
import { useOidcStore } from '@/store/oidcStore';
import { useServerConfigStore } from '@/store/serverConfigStore';

import router from '@/router';
const appName = import.meta.env["VITE_APP_NAME"];
const appEngName = import.meta.env["VITE_APP_ENG_NAME"];
const oidcStore = useOidcStore();
const serverConfigStore = useServerConfigStore();

const themeStore = useThemeStore();
const selectedTab = ref("密码登录");



const onPasswordLoginDone = async (tokenRes: any) => {
    oidcStore.storeTokenInfo(tokenRes);
    await serverConfigStore.initConfig();
    await router.push({ name: "index" })
}



onErrorCaptured((err: Error) => {
    if (err instanceof ApiError) {
        console.log(err);
    }
    return false;
});
</script>
<style lang="scss" scoped></style>
<route lang="yaml">
name: login
meta: 
  title: 登录
  desc: 系统功能
  icon: mdi-login
  visible: false
  auth: true
  layout: empty
</route>