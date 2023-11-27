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

            <template #[`item.title`]="{ value }">
                <span class="text-body-2">{{ value }}</span>
            </template>

            <template #[`item.slug`]="{ value }">
                <span class="text-body-2">{{ value }}</span>
            </template>

            <template #[`item.status`]="{ value }">
                <v-chip density="compact" color="primary" variant="tonal">
                    {{ BlogPostStatus[value] }}
                </v-chip>
            </template>

            <template #[`item.blogName`]="{ value }">
                <span class="text-body-2">{{ value }}</span>
            </template>

            <template #[`item.creationTime`]="{ value }">
                <span class="text-body-2"> {{ dayjs(value).format("YYYY年MM月DD日") }}</span>
            </template>

            <template #[`item.shortDescription`]="{ value }">
                <v-tooltip :text="value" location="top">
                    <template #activator="{ props }">
                        <div class="text-truncate text-body-2" style="max-width: 130px;" v-bind="props">{{ value }}</div>
                    </template>
                </v-tooltip>

            </template>
            <template #[`item.menu`]="{ item }">
                <v-menu>
                    <template #activator="{ props }">
                        <v-btn size="small" color="primary" variant="tonal" prepend-icon="mdi-menu" v-bind="props">
                            菜单
                        </v-btn>
                    </template>
                    <v-list nav lines="one">
                        <v-list-item density="compact" @click="gotoEditBlogPost(item.id!)">
                            <template #title>
                                <span>更新</span>
                            </template>
                            <template #prepend>
                                <v-icon>mdi-cog-outline</v-icon>
                            </template>
                        </v-list-item>
                        <v-list-item density="compact" @click="onRemoveBlogDialogOpen(item)">
                            <template #title>
                                <span>删除</span>
                            </template>
                            <template #prepend>
                                <v-icon>mdi-delete-outline</v-icon>
                            </template>
                        </v-list-item>
                        <v-list-item v-if="item.status === BlogPostStatus.Draft" v-permission="'CmsKit.BlogPosts.Publish'"
                            @click="onPublishBlogDialogOpen(item)" density="compact">
                            <template #title>
                                <span>发布</span>
                            </template>
                            <template #prepend>
                                <v-icon>mdi-file-document-check</v-icon>
                            </template>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </template>
            <template #[`item.actions`]="{ item }">
                <v-btn density="compact" variant="text" icon="mdi-feature-search-outline" @click="gotoBlogPost(item.id!)">
                </v-btn>
            </template>
        </v-data-table-server>

        <remove v-model:show="removeBlogPostDialog" :blog-post="removeBlogPostDialogParams" @done="onDataChanged">
        </remove>

        <publish v-model:show="publishBlogPostDialog" :blog-post="publishBlogPostDialogParams" @done="onDataChanged">
        </publish>

    </v-container>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { useBlogPostList } from './hooks/blogPostList';
import remove from './components/remove.vue';
import { BlogPostListDto, BlogPostStatus } from '@/openapi';
import publish from './components/publish.vue';

const router = useRouter();
//删除博客文章
const removeBlogPostDialog = ref(false);
const removeBlogPostDialogParams = ref<BlogPostListDto>();
const onRemoveBlogDialogOpen = (blogPost: BlogPostListDto) => {
    removeBlogPostDialogParams.value = blogPost;
    removeBlogPostDialog.value = true;
}

//发布博客文章
const publishBlogPostDialog = ref(false);
const publishBlogPostDialogParams = ref<BlogPostListDto>();
const onPublishBlogDialogOpen = (blogPost: BlogPostListDto) => {
    publishBlogPostDialogParams.value = blogPost;
    publishBlogPostDialog.value = true;
}
//搜索栏位
const searchBarActivated = ref(false);
const toggleSearchBar = () => {
    searchBarActivated.value = !searchBarActivated.value;
    if (searchBarActivated.value === false) {
        pageable.filter = undefined;
    }
}

const { loading, getList, headers, list, pageable } = useBlogPostList();

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

const onDataChanged = async (val: boolean) => {
    if (val) {
        await getList();
    }
}

const gotoBlogPost = async (blogPostId: string) => {
    await router.push({ name: "blogPost.detail", params: { blogPostId: blogPostId } });
}

const gotoEditBlogPost = async (blogPostId: string) => {
    await router.push({ name: "blogPost.edit", params: { blogPostId: blogPostId } });
}

onMounted(async () => {
    await getList();
});
</script>

<style scoped></style>

<route lang="yaml">
name: blogPost.index
meta: 
  visible: true
  auth: true
  title: 文章管理
  desc: 博客管理
  icon: mdi-post-outline
</route>