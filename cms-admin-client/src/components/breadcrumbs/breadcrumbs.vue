<template>
    <v-breadcrumbs :items="breadCrumbItems" divider="/">
        <template #prepend>
            <router-link to="/" class="link">
                <v-icon icon="mdi-home-circle"></v-icon>
            </router-link>
        </template>
        <template v-slot:divider>
            /
        </template>
    </v-breadcrumbs>
</template>
<script lang="ts" setup>

const route = useRoute();
let breadCrumbItems = ref();
function getBreadcrumbItems() {
    const { matched } = route;
    const last = matched[matched.length - 1];
    breadCrumbItems.value = [];
    breadCrumbItems.value.push({
        title: last.meta.desc,
        disabled: true,
        href: last.path,
    });
    breadCrumbItems.value.push({
        title: last.meta.title,
        disabled: false,
        href: last.path,
    });
}

watch(() => route, getBreadcrumbItems, { deep: true, immediate: true });
</script>
<style lang="scss">
.v-breadcrumbs__prepend {
    .mdi-home-circle {
        margin-right: 4px;
    }
}
</style>
