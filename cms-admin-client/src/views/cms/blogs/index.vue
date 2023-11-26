<template>
    <v-container fluid>
        <v-toolbar color="secondary" rounded>
            <v-app-bar-nav-icon>
                <v-avatar :image="blogImg"></v-avatar>
            </v-app-bar-nav-icon>
            <v-toolbar-title v-if="!searchBarActivated">
                博客列表
            </v-toolbar-title>
            <v-scale-transition>
                <v-text-field v-if="searchBarActivated" placeholder="搜索...." variant="solo" density="compact" hide-details
                    append-inner-icon="mdi-power" v-model="filter" @click:append-inner="toggleSearchBar" class="ml-3 w-100">
                </v-text-field>
            </v-scale-transition>
            <v-spacer></v-spacer>
            <v-btn variant="text" icon="mdi-feature-search" v-if="!searchBarActivated"
                @click="searchBarActivated = !searchBarActivated">
            </v-btn>
            <v-btn @click="createBlogDialog = true" icon="mdi-plus"></v-btn>
        </v-toolbar>
        <v-data-table-server v-model:items-per-page="pageable.pageSize" :headers="headers" :items-length="pageable.total"
            :items="list" :loading="loading" item-value="name" @update:options="onPageOptionUpdated"
            items-per-page-text="每页">
            <template #[`item.actions`]="{ item }">
                <v-menu>
                    <template #activator="{ props }">
                        <v-btn size="small" color="primary" variant="tonal" prepend-icon="mdi-menu" v-bind="props">
                            菜单
                        </v-btn>
                    </template>
                    <v-list nav lines="one">
                        <v-list-item density="compact" @click="onRemoveBlogDialogOpen(item)">
                            <template #title>
                                <span>删除</span>
                            </template>
                            <template #prepend>
                                <v-icon>mdi-delete-outline</v-icon>
                            </template>
                        </v-list-item>
                        <v-list-item density="compact" @click="onEditBlogDialogOpen(item)">
                            <template #title>
                                <span>更新</span>
                            </template>
                            <template #prepend>
                                <v-icon>mdi-cog-outline</v-icon>
                            </template>
                        </v-list-item>
                        <v-list-item density="compact" @click="onEditBlogFeatureDialogOpen(item)">
                            <template #title>
                                <span>功能</span>
                            </template>
                            <template #prepend>
                                <v-icon>mdi-application-cog-outline</v-icon>
                            </template>
                        </v-list-item>
                        <v-list-item density="compact">
                            <template #title>
                                <span>查看</span>
                            </template>
                            <template #prepend>
                                <v-icon>mdi-feature-search</v-icon>
                            </template>
                        </v-list-item>
                    </v-list>
                </v-menu>
                <v-btn size="small" variant="tonal" color="warning" prepend-icon="mdi-post-outline"
                    @click="onWritePostRequested(item)" class="ml-1">
                    <span class="hidden-sm-and-down">发文</span>
                </v-btn>
            </template>
        </v-data-table-server>

        <create-blog v-model:show="createBlogDialog" @done="onDataChanged">
        </create-blog>

        <edit-blog v-model:show="editBlogDialog" :id="editBlogDialogParams" @done="onDataChanged">
        </edit-blog>

        <remove-blog v-model:show="removeBlogDialog" :blog="removeBlogDialogParams" @done="onDataChanged">
        </remove-blog>

        <blogFeature v-model:show="editBlogFeatureDialog" :id="editBlogFeatureDialogParams" @done="onDataChanged">
        </blogFeature>
    </v-container>
</template>

<script setup lang="ts">
import { BlogDto } from '@/openapi';
import createBlog from './components/create.vue';
import editBlog from './components/edit.vue';
import removeBlog from './components/remove.vue';
import blogFeature from './components/blogFeature.vue';
import { useBlogList } from './hooks/blogList';
import blogImg from '@/assets/blog.png';

const router = useRouter();
const searchBarActivated = ref(false);
const toggleSearchBar = () => {
    searchBarActivated.value = !searchBarActivated.value;
}
const { loading, list, headers, filter, pageable, onDataChanged, getList } = useBlogList();
//创建对话框
const createBlogDialog = ref(false);
//编辑对话框
const editBlogDialog = ref(false);
const editBlogDialogParams = ref("");
const onEditBlogDialogOpen = (blog: BlogDto) => {
    editBlogDialogParams.value = blog.id!;
    editBlogDialog.value = true;
}
//删除对话框
const removeBlogDialog = ref(false);
const removeBlogDialogParams = ref<BlogDto>();
const onRemoveBlogDialogOpen = (blog: BlogDto) => {
    removeBlogDialogParams.value = blog;
    removeBlogDialog.value = true;
}

const editBlogFeatureDialog = ref(false);
const editBlogFeatureDialogParams = ref("");
const onEditBlogFeatureDialogOpen = (blog: BlogDto) => {
    editBlogFeatureDialogParams.value = blog.id!;
    editBlogFeatureDialog.value = true;
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

const onWritePostRequested = async (blog: BlogDto) => {
    await router.push({ name: "blogPost.create", params: { blogId: blog.id! } })
}
</script>

<style scoped></style>

<route lang="yaml">
name: blog.index
meta:  
  visible: true
  auth: false
  title: 博客列表
  desc: 博客管理
  icon: mdi-newspaper-variant-outline

</route>