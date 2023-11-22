<template>
    <v-container fluid>
        <v-toolbar color="secondary" rounded>
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
        <v-row justify="center">
            <v-col cols="12" md="6">
                <v-infinite-scroll v-if="blogsCache" :items="blogsCache" @load="onLoad">
                    <template v-for="(item, index) in blogsCache" :key="index">
                        <v-list-item lines="two">
                            <template #prepend>
                                <v-avatar :image="blogImg"></v-avatar>
                            </template>
                            <template #title>
                                <span class="text-h6 font-weight-bold text-primary">{{ item.name }}</span>
                            </template>
                            <template #subtitle>
                                <span class="text-subtitle-2 text-disabled">{{ item.slug }}</span>
                            </template>
                            <template #append>
                                <v-row>
                                    <v-btn size="small" variant="outlined" color="red" prepend-icon="mdi-delete-outline"
                                        @click="onRemoveBlogDialogOpen(item)">
                                        <span class="hidden-sm-and-down">删除</span>
                                    </v-btn>
                                    <v-btn size="small" variant="outlined" color="primary" prepend-icon="mdi-cog-outline"
                                        @click="onEditBlogDialogOpen(item)">
                                        <span class="hidden-sm-and-down">更新</span>
                                    </v-btn>
                                    <v-btn size="small" variant="outlined" color="success"
                                        prepend-icon="mdi-feature-search-outline">
                                        <span class="hidden-sm-and-down">查看</span>
                                    </v-btn>
                                    <v-btn size="small" variant="outlined" color="warning" prepend-icon="mdi-post-outline"
                                        @click="onWritePostRequested(item)">
                                        <span class="hidden-sm-and-down">写文章</span>
                                    </v-btn>
                                </v-row>
                            </template>
                        </v-list-item>
                    </template>
                    <template #empty>
                        <v-alert icon="mdi-information">
                            已到最底部,没有更多数据了....
                        </v-alert>
                    </template>
                </v-infinite-scroll>

                <create-blog v-model:show="createBlogDialog" @done="onDataChanged"></create-blog>
                <edit-blog v-model:show="editBlogDialog" :id="editBlogDialogParams" @done="onDataChanged"></edit-blog>
                <remove-blog v-model:show="removeBlogDialog" :blog="removeBlogDialogParams"
                    @done="onDataChanged"></remove-blog>

            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { BlogDto } from '@/openapi';
import createBlog from './components/create.vue';
import editBlog from './components/edit.vue';
import removeBlog from './components/remove.vue';
import { useBlogList } from './hooks/blogList';
import blogImg from '@/assets/blog.png';
const router = useRouter();
const searchBarActivated = ref(false);
const toggleSearchBar = () => {
    searchBarActivated.value = !searchBarActivated.value;
}
const { blogsCache, filter, scrollBlogs, onDataChanged } = useBlogList();
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

const onWritePostRequested = async (blog: BlogDto) => {
    await router.push({ name: "blogPost.create", params: { blogId: blog.id! } })
}


//infinite scroll load事件
const onLoad = async ({ side, done }: { side: 'end' | 'start' | 'both', done: (status: 'error' | 'loading' | 'empty' | 'ok') => void }) => {
    if (side === "end") {
        var rows = await scrollBlogs(1);
        if (rows > 0) {
            done("ok");
        } else {
            done("empty");
        }
    }
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