<template>
    <v-container fluid>
        <v-toolbar color="secondary" rounded>
            <v-app-bar-nav-icon>
            </v-app-bar-nav-icon>
            <v-toolbar-title>
                {{ blogPost?.title }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon="mdi-arrow-left-bold" @click="back"></v-btn>
            <v-tooltip :text="'编辑该文章'">
                <template #activator="{ props }">
                    <v-btn icon="mdi-cog-outline" @click="gotoEditBlogPost" v-bind="props"
                        v-permission="'CmsKit.BlogPosts.Update'">
                    </v-btn>
                </template>
            </v-tooltip>
        </v-toolbar>
        <v-row justify="center" class="mt-3">
            <v-col cols="12" md="6">
                <v-card flat>
                    <v-img v-if="coverImage" max-height="300" aspect-ratio="16/9" cover :src="coverImage">
                    </v-img>
                    <v-list density="compact" lines="two">
                        <v-list-item class="mx-0 px-0">
                            <template #title>
                                <span class="text-h5 font-weight-bold">
                                    {{ blogPost?.title }}
                                </span>
                            </template>
                            <template #subtitle>
                                <span class="text-caption">
                                    【{{ blog?.name }}】发布于{{ dayjs(blogPost?.creationTime).format("YYYY/MM/DD") }}
                                </span>
                            </template>
                            <template #append>
                                <v-tooltip :text="'点击收藏'">
                                    <template #activator="{ props }">
                                        <v-btn color="pink" variant="text" size="small" icon="mdi-heart-outline"
                                            v-bind="props">
                                        </v-btn>
                                    </template>
                                </v-tooltip>
                            </template>
                        </v-list-item>
                    </v-list>
                </v-card>
                <VuetifyViewer :value="blogPost?.content!"></VuetifyViewer>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { BlogAdminService, BlogDto, BlogPostAdminService, BlogPostDto } from '@/openapi';
import dayjs from 'dayjs';

const route = useRoute("blogPost.detail");
const router = useRouter();
const blog = ref<BlogDto>();
const blogPost = ref<BlogPostDto>();

const coverImage = computed(() => {
    if (blogPost.value?.coverImageMediaId) {
        return `${import.meta.env.VITE_MEDIA_URL}${blogPost.value?.coverImageMediaId}`
    }
    return undefined;
})

const gotoEditBlogPost = async () => {
    await router.push({ name: "blogPost.edit", params: { blogPostId: blogPost.value?.id! } });
}

const back = async () => {
    await router.push({ name: "blogPost.index" });
}

onMounted(async () => {
    blogPost.value = await BlogPostAdminService.blogPostAdminGet({ id: route.params.blogPostId });
    blog.value = await BlogAdminService.blogAdminGet({ id: blogPost.value.blogId! });
})
</script>

<style scoped></style>

<route lang="yaml">
name: blogPost.detail
meta: 
  visible: false
  auth: true
  title: 文章详情
  desc: 博客管理
</route>