<template>
    <v-container fluid>
        <v-toolbar color="secondary" rounded>
            <v-app-bar-nav-icon>
            </v-app-bar-nav-icon>
            <v-toolbar-title v-if="!searchBarActivated">
                评论列表
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

            <template #[`item.text`]="{ value }">
                <span class="text-body-2">{{ value }}</span>
            </template>

            <template #[`item.creationTime`]="{ value }">
                <v-chip variant="outlined">
                    {{ dayjs(value).format("YYYY/MM/DD") }}
                </v-chip>
            </template>

            <template #[`item.author`]="{ value }">
                <span class="text-body-2">{{ value }}</span>
            </template>

            <template #[`item.url`]="{ value }">
                <span class="text-body-2">{{ value }}</span>
            </template>

            <template #[`item.menu`]="{ item }">
                <v-btn variant="tonal" color="red" icon="mdi-delete-outeline" @click="onRemoveCommentDialogOpen(item)">
                </v-btn>
                <!-- <v-menu>
                    <template #activator="{ props }">
                        <v-btn size="small" color="primary" variant="tonal" prepend-icon="mdi-menu" v-bind="props">
                            菜单
                        </v-btn>
                    </template>
                    <v-list nav lines="one">
                        <v-list-item density="compact" @click="onRemoveCommentDialogOpen(item)">
                            <template #title>
                                <span>删除</span>
                            </template>
                            <template #prepend>
                                <v-icon>mdi-delete-outline</v-icon>
                            </template>
                        </v-list-item>
                    </v-list>
                </v-menu> -->
            </template>
        </v-data-table-server>
    </v-container>
    <removeComment v-model:show="removeCommentDialog" :comment="removeCommentDialogParams" @done="onDataChanged">
    </removeComment>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { useCommentList } from './hooks/commentList';
import { CommentWithAuthorDto } from '@/openapi';
import removeComment from './components/remove.vue';
//删除Comment对话框
const removeCommentDialog = ref(false);
const removeCommentDialogParams = ref<CommentWithAuthorDto>();
const onRemoveCommentDialogOpen = (comment: CommentWithAuthorDto) => {
    removeCommentDialogParams.value = comment;
    removeCommentDialog.value = true;
}

//搜索栏位
const searchBarActivated = ref(false);
const toggleSearchBar = () => {
    searchBarActivated.value = !searchBarActivated.value;
    if (searchBarActivated.value === false) {
        pageable.filter = undefined;
    }
}

const { loading, getList, headers, list, pageable } = useCommentList();

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
name: comment.index
meta: 
  visible: true
  auth: true
  title: 评论管理
  desc: 博客管理
  icon: mdi-comment-account-outline
</route>