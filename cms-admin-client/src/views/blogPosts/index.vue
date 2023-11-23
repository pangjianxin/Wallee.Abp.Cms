<template>
    <div v-if="list">
        <template v-for="(item, index) in list" :key="index">
            <div>{{ item.blogId }}-{{ item.coverImageMediaId }}</div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { useBlogPostList } from './hooks/blogPostList';

const { getList, list } = useBlogPostList();

onMounted(async () => {
    await getList();
})
</script>

<style scoped></style>

<route lang="yaml">
name: blogPost.index
meta: 
  visible: true
  auth: true
  title: 文章管理
  desc: 文章管理
  icon: mdi-newspaper-variant-outline
</route>