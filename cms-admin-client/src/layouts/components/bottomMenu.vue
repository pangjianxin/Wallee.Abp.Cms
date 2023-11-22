<template>
    <v-bottom-navigation v-model="selectedRoute" color="teal" grow absolute>
        <template v-for="menu in menus" :key="menu.route">
            <v-btn :value="menu.routeName">
                <v-icon>{{ menu.icon }}</v-icon>
                {{ menu.title }}
            </v-btn>
        </template>
    </v-bottom-navigation>
</template>

<script setup lang="ts">
import router from '@/router';

let selectedRoute: Ref<string> = ref("");

defineProps({
    menus: {
        type: Array<MenuInfo>,
        required: true
    }
});

const navigateTo = async (routeName: string) => {
    await router.push({ name: routeName });
}

watch(
    () => selectedRoute.value,
    async (newVal) => {
        await navigateTo(newVal);
    });
</script>

<style scoped></style>