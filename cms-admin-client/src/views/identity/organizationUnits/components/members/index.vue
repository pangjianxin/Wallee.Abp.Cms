<template>
    <div flat v-if="selectedOrgId" fluid>
        <v-tabs v-model="selectedTab" grow bg-color="secondary">
            <v-tab v-for="item in tabs" :key="item" :value="item" :border="true">
                <v-icon>mdi-cog</v-icon>&nbsp;
                {{ item }}
            </v-tab>
        </v-tabs>
        <v-window v-model="selectedTab">
            <v-window-item value="用户管理">
                <organizationUnitUsers :org-id="selectedOrgId" :org-display-name="selectedOrgDisplayName">
                </organizationUnitUsers>
            </v-window-item>
            <v-window-item value="角色管理">
                <organizationUnitRoles :org-id="selectedOrgId" :org-display-name="selectedOrgDisplayName">
                </organizationUnitRoles>
            </v-window-item>
        </v-window>
    </div>
    <v-toolbar v-else density="compact">
        <v-toolbar-title>请选择机构</v-toolbar-title>
    </v-toolbar>
</template>

<script setup lang="ts">
import organizationUnitUsers from './organizationUnitUsers.vue';
import organizationUnitRoles from './organizationUnitRoles.vue';
import { onViewEventBusKey } from '../../hooks';

const selectedTab = ref("用户管理");
const tabs = ["用户管理", "角色管理"]
const onViewEventBus = useEventBus(onViewEventBusKey);

const selectedOrgId = ref("");
const selectedOrgDisplayName = ref("");

//查看组织机构
const onView = (e: { id: string, displayName: string }) => {
    selectedOrgId.value = e.id;
    selectedOrgDisplayName.value = e.displayName;
}

onMounted(() => {
    onViewEventBus.on(onView);
});


</script>

<style scoped></style>