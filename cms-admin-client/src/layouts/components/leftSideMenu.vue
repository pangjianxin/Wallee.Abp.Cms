<template>
    <v-navigation-drawer rounded elevation="1" :rail="rail" expand-on-hover :permanent="permanent" :temporary="temporary"
        v-model="sideMenuModel">
        <v-list nav>
            <v-list-item :prepend-avatar="logo" class="mx-1">
                <v-list-item-title class="font-weight-bold">{{ appName }}</v-list-item-title>
                <v-list-item-subtitle>{{ appEngName }}</v-list-item-subtitle>
            </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list :lines="false" density="compact" nav>
            <template v-for="(value, key) in menus" :key="key">
                <v-list-subheader>{{ key }}</v-list-subheader>
                <template v-for="item in value" :key="item.name">
                    <v-list-item :prepend-icon="(item.icon)" :title="(item.title as any)" :to="{ name: item.routeName }">
                    </v-list-item>
                </template>
            </template>
        </v-list>
    </v-navigation-drawer>
</template>
<script lang="ts" setup>
import { PropType } from 'vue';
import logo from '@/assets/logo.png';
import { useSideMenuStore } from '@/store/sideMenuStore';
const appName = import.meta.env.VITE_APP_NAME;
const appEngName=import.meta.env.VITE_APP_ENG_NAME;
const sideMenuStore = useSideMenuStore();
const { rail, sideMenuModel, permanent, temporary } = storeToRefs(sideMenuStore);

defineProps({
    menus: {
        type: Object as PropType<Record<string, Array<MenuInfo>>>,
        required: true
    },
});

defineExpose({
    toggleCollapse: sideMenuStore.toggleCollapse
});


</script>