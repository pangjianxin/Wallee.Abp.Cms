<template>
    <v-container fluid>
        <v-toolbar color="secondary" rounded>
            <v-app-bar-nav-icon>
            </v-app-bar-nav-icon>
            <v-toolbar-title v-if="!searchBarActivated">
                文章列表
            </v-toolbar-title>
            <v-scale-transition>
                <v-text-field v-if="searchBarActivated" placeholder="搜索...." variant="solo" density="compact" hide-details
                    append-inner-icon="mdi-power" v-model="pageable.filter" @click:append-inner="toggleSearchBar"
                    class="ml-3 w-100">
                </v-text-field>
            </v-scale-transition>
            <v-spacer></v-spacer>
            <v-btn variant="text" icon="mdi-feature-search" v-if="!searchBarActivated"
                @click="searchBarActivated = !searchBarActivated">
            </v-btn>
            <v-btn icon="mdi-plus"></v-btn>
        </v-toolbar>
        <v-data-table-server v-model:items-per-page="pageable.pageSize" :headers="headers" :items-length="pageable.total"
            :items="list" :loading="loading" item-value="name" @update:options="onPageOptionUpdated"
            items-per-page-text="每页">

            <template #[`item.entityType`]="{ value }">
                <span class="text-body-2">{{ value }}</span>
            </template>

            <template #[`item.name`]="{ value }">
                <span class="text-body-2">{{ value }}</span>
            </template>

            <template #[`item.creationTime`]="{ value }">
                <v-chip variant="outlined">
                    {{ dayjs(value).format("YYYY/MM/DD") }}
                </v-chip>
            </template>

            <template #[`item.menu`]="{ item }">
                <v-menu>
                    <template #activator="{ props }">
                        <v-btn size="small" color="primary" variant="tonal" prepend-icon="mdi-menu" v-bind="props">
                            菜单
                        </v-btn>
                    </template>
                    <v-list nav lines="one">
                        <v-list-item density="compact" @click="onEditTagDialogOPen(item.id!)">
                            <template #title>
                                <span>更新</span>
                            </template>
                            <template #prepend>
                                <v-icon>mdi-cog-outline</v-icon>
                            </template>
                        </v-list-item>
                        <v-list-item density="compact" @click="onRemoveTagDialogOpen(item)">
                            <template #title>
                                <span>删除</span>
                            </template>
                            <template #prepend>
                                <v-icon>mdi-delete-outline</v-icon>
                            </template>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </template>
        </v-data-table-server>
        <editTag v-model:show="editTagDialog" :tag-id="editTagDialogParams" @done="onDataChanged"></editTag>
        <removeTag v-model:show="removeTagDialog" :tag="removeTagDialogParams!" @done="onDataChanged"></removeTag>
    </v-container>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { useTagsList } from './hooks/tagsList';
import { TagDto } from '@/openapi';
import editTag from './components/edit.vue';
import removeTag from './components/remove.vue';
//删除Tag对话框
const removeTagDialog = ref(false);
const removeTagDialogParams = ref<TagDto>();
const onRemoveTagDialogOpen = (blogPost: TagDto) => {
    removeTagDialogParams.value = blogPost;
    removeTagDialog.value = true;
}
//更新Tag对话框
const editTagDialog = ref(false);
const editTagDialogParams = ref<string>();
const onEditTagDialogOPen = (tagId: string) => {
    editTagDialogParams.value = tagId;
    editTagDialog.value = true;
}
//搜索栏位
const searchBarActivated = ref(false);
const toggleSearchBar = () => {
    searchBarActivated.value = !searchBarActivated.value;
    if (searchBarActivated.value === false) {
        pageable.filter = undefined;
    }
}

const { loading, getList, headers, list, pageable } = useTagsList();

const onDataChanged = async () => {
    await getList();
}

const onPageOptionUpdated = async ({
    page,
    itemsPerPage,
    sortBy,
}: {
    page: number;
    itemsPerPage: number;
    sortBy: { key: string; order: string }[] | undefined;
}) => {
    pageable.pageNum = page;
    pageable.pageSize = itemsPerPage;
    if (sortBy && sortBy.length > 0) {
        pageable.sorting = sortBy[0].key + " " + sortBy[0].order;
    }
    await getList();
};

onMounted(async () => {
    await getList();
});
</script>

<style scoped></style>

<route lang="yaml">
name: tag.index
meta: 
  visible: true
  auth: true
  title: 标签管理
  desc: 博客管理
  icon: mdi-tag-arrow-down-outline
</route>