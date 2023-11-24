<template>
    <v-container fluid>
        <v-toolbar color="secondary" rounded>
            <v-app-bar-nav-icon>
            </v-app-bar-nav-icon>
            <v-toolbar-title>
                文章详情
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon="mdi-plus"></v-btn>
        </v-toolbar>
        <v-row justify="center" class="mt-3">
            <v-col cols="12" md="6">
                <div>
                    <span class="text-h5 font-weight-bold ">{{ blogPost?.title }}</span>
                </div>

                <v-list density="compact" lines="two">
                    <v-list-item class="mx-0 px-0">
                        <template #title>
                            <span class="text-body-2 font-weight-bold">
                                {{ blog?.name }}
                            </span>
                        </template>
                        <template #subtitle>
                            <span class="text-caption">
                                {{ dayjs(blogPost?.creationTime).format("YYYY/MM/DD") }}
                            </span>
                        </template>
                        <template #append>
                            <v-tooltip :text="'点击收藏'">
                                <template #activator="{ props }">
                                    <v-btn variant="text" size="small" icon="mdi-heart-outline" v-bind="props"></v-btn>
                                </template>
                            </v-tooltip>
                        </template>
                    </v-list-item>
                </v-list>
                <v-divider></v-divider>
                <VuetifyViewer :value="blogPost?.content!"></VuetifyViewer>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { BlogAdminService, BlogDto, BlogPostAdminService, BlogPostDto } from '@/openapi';
import dayjs from 'dayjs';

const route = useRoute("blogPost.detail");
const blog = ref<BlogDto>();
const blogPost = ref<BlogPostDto>();

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