<template>
    <v-layout class="rounded rounded-md v-application" full-height>
        <leftSideMenu ref="leftSideMenuRef" :menus="menuList.leftSideMenuList"></leftSideMenu>
        <rightSideMenu ref="rightSideMenuRef"></rightSideMenu>
        <v-app-bar rounded elevation="1">
            <template v-if="!mobile">
                <!--面包屑-->
                <Breadcrumbs />
            </template>
            <!--mobile下的按钮-->
            <template v-if="mobile">
                <div class="head_logo ml-4 mr-1">
                    <img :src="logo" height="40" />
                </div>
            </template>
            <v-app-bar-nav-icon @click="toggleLeftSideMenu"></v-app-bar-nav-icon>
            <v-spacer></v-spacer>
            <!--搜索框-->
            <div v-if="!mobile" style="width: 220px" class="search_ip mr-2">
                <v-text-field rounded density="compact" variant="outlined" label="Search here"
                    prepend-inner-icon="mdi-magnify" single-line hide-details clearable>
                </v-text-field>
            </div>
            <!--右侧工具栏-->
            <div class="d-flex flex-row align-center">
                <v-btn @click="themeStore.toggleTheme" variant="text" :icon="themeIcon" />
                <v-btn @click="toggleRightSideMenu" variant="text" icon="mdi-cog" />
                <v-btn variant="text" append-icon="mdi-chevron-down" class="mr-2">
                    <v-avatar size="x-small" class="avatar mr-2">
                        <v-img :src="wxtx" alt="wallee"></v-img>
                    </v-avatar>
                    <span v-if="!mobile">{{ serverConfigStore.currentUser?.name }}</span>
                    <v-menu activator="parent">
                        <v-list nav>
                            <v-list-item title="我的账户" prepend-icon="mdi-account-edit" @click="gotoAccount" />
                            <v-list-item title="退出登录" prepend-icon="mdi-login" to="/login" />
                        </v-list>
                    </v-menu>
                </v-btn>
            </div>
            <div style="position: fixed; right: 20px; bottom: 100px; z-index: 99999">
                <v-btn icon="mdi-cog" />
            </div>
        </v-app-bar>
        <v-main scrollable>
            <router-view>
            </router-view>
        </v-main>
        <bottomMenuVue :menus="menuList.bottomMenuList"></bottomMenuVue>
        <v-snackbar v-model="snackbar" :color="snackbarColor">
            {{ snackbarText }}
            <template #actions>
                <v-btn icon="mdi-close" @click="globalStore.closeSnackbar()" />
            </template>
        </v-snackbar>
        <v-overlay v-model="loading" app class="justify-center align-center">
            <v-progress-circular indeterminate size="64" />
        </v-overlay>
    </v-layout>
</template>
<script setup lang="ts">
import logo from '@/assets/logo.png';
import wxtx from '@/assets/user.png';
import Breadcrumbs from '@/components/breadcrumbs/breadcrumbs.vue';
import leftSideMenu from '@/layouts/components/leftSideMenu.vue';
import rightSideMenu from './components/rightSideMenu.vue';
import bottomMenuVue from './components/bottomMenu.vue';
import { useThemeStore } from '@/store/themeStore';
import { useServerConfigStore } from '@/store/serverConfigStore';
import { routes } from "vue-router/auto/routes";

import { ApiError } from '@/openapi/core/ApiError';
import { useGlobalStore } from '@/store/globalStore';
const serverConfigStore = useServerConfigStore();
const globalStore = useGlobalStore();
const themeStore = useThemeStore();

const router = useRouter();
const { snackbarText, loading, snackbar, snackbarColor } = storeToRefs(globalStore);
const { theme, mobile } = storeToRefs(themeStore);
const themeIcon = computed(() => {
    return theme.value === "dark" ? 'mdi-weather-sunny' : 'mdi-weather-night'
});

const leftSideMenuRef = ref();

const toggleLeftSideMenu = () => {
    leftSideMenuRef.value.toggleCollapse();
}

const rightSideMenuRef = ref();

const toggleRightSideMenu = () => {
    rightSideMenuRef.value.toggleCollapse();
}

const gotoAccount = async () => {
    await router.push({ name: "account" });
};

const menuList = computed(() => {
    let leftSideMenuList: Record<string, MenuInfo[]> = {};
    let bottomMenuList: Array<MenuInfo> = [];
    let grantedPermissions = serverConfigStore.auth?.grantedPolicies || [];

    let traverse = (route: any) => {
        if (route.children && route.children.length > 0) {
            route.children.forEach((child: any) => traverse(child));
        } else {
            if (route.meta?.visible === true) {

                if (!leftSideMenuList[route.meta.desc as string]) {
                    leftSideMenuList[route.meta.desc as string] = [];
                }

                if (!route.meta?.permissions || route.meta?.permissions?.some((p: any) => (grantedPermissions as Record<string, boolean>)[p] === true)) {
                    leftSideMenuList[route.meta?.desc as string].push({
                        title: route.meta?.title as string,
                        routeName: route.name as string,
                        icon: route.meta?.icon as string,
                        path: route.path
                    });
                    if (route.meta?.visibleOnBottom === true) {
                        bottomMenuList.push({
                            icon: route.meta.icon!,
                            title: route.meta.title!,
                            routeName: route.name?.toString()!,
                            path: route.path
                        })
                    }
                }
            }
        }
    }
    routes.forEach(route => traverse(route));
    return {
        leftSideMenuList,
        bottomMenuList
    };
})

const parseAbpError = (response: any) => {
    if (response.error) {
        let message = response.error.message;
        if (response.error.validationErrors) {
            message += ': ' + response.error.validationErrors.map((e: any) => e.message).join(', ');
        }
        return message;
    }
    return null;
}

onErrorCaptured((err: Error) => {
    if (err instanceof ApiError) {
        if (err.status === 401) {
            router.push({ name: 'login' });
        }
        let msg = parseAbpError(err.body);
        //let msg = err.body.message ?? err.body.error_description ?? err.body.error.details ?? err.body.error;
        globalStore.setSnackbarText(msg, "warning");
    }
    return false;
});

</script>
<style scoped lang="scss"></style>