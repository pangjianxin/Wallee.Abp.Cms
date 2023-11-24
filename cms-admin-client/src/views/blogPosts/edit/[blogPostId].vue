<template>
  <div>
    <VuetifyTiptap v-model="form.content"></VuetifyTiptap>
  </div>
</template>

<script setup lang="ts">
import { BlogPostAdminService, BlogPostDto } from '@/openapi';
import { useEditBlogPostForm } from '../hooks/editBlogPost';
import { SubmitEventPromise } from 'vuetify/lib/framework.mjs';
const route = useRoute("blogPost.edit");
const blogPost = ref<BlogPostDto>();
const { form, formRules, submit } = useEditBlogPostForm();
const onSubmit = async (e: SubmitEventPromise) => {
  if ((await e).valid) {
    await submit();
  }
}
onMounted(async () => {
  blogPost.value = await BlogPostAdminService.blogPostAdminGet({ id: route.params.blogPostId });
});
</script>

<style scoped></style>

<route lang="yaml">
name: blogPost.edit
meta: 
  visible: true
  title: 编辑文章
  desc: 博客管理
  auth: true
  icon: mdi-file-document-edit
</route>