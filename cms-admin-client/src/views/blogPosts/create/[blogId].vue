<template>
    <v-container fluid>
        <v-toolbar color="secondary" rounded>
            <v-toolbar-title>
                写文章
            </v-toolbar-title>
            <v-spacer></v-spacer>
        </v-toolbar>
        <v-row justify="center" class="mt-5">
            <v-form ref="createBlogPostFormRef" @submit="onSubmit">
                <v-card>
                    <v-card-title class="d-flex flex-row justify-space-between align-center">
                        <span class="text-h6 font-weight-bold">
                            编辑博客文章
                        </span>
                        <v-btn variant="text" color="primary" prepend-icon="mdi-upload" @click="mediaUploaderDialog = true"
                            density="compact">
                            上传封面
                        </v-btn>
                    </v-card-title>
                    <v-card-subtitle>
                        <span class="text-subtitle-2 font-weight-bold">
                            您正在编辑博客<span class="text-primary">{{ blog?.name }}</span>的文章
                        </span>
                    </v-card-subtitle>
                    <v-card-text>
                        <v-col cols="12">
                            <v-text-field density="compact" label="文章标题" placeholder="标题会直接显示在文章列表中" v-model="form.title"
                                color="primary" variant="outlined" type="text" :rules="formRules.title"
                                prepend-inner-icon="mdi-tag-outline">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field density="compact" label="文章SLUG" placeholder="SLUG能够更好的索引文章" v-model="form.slug"
                                color="primary" variant="outlined" type="text" :rules="formRules.slug"
                                prepend-inner-icon="mdi-tag-check-outline">
                            </v-text-field>
                        </v-col>

                        <v-col cols="12">
                            <v-textarea :auto-grow="true" :rows="2" density="compact" label="文章短介绍"
                                placeholder="文章短介绍能够更好的吸引读者" v-model="form.shortDescription" color="primary"
                                variant="outlined" type="text" :rules="formRules.shortDescription"
                                prepend-inner-icon="mdi-content-copy">
                            </v-textarea>
                        </v-col>

                        <v-col cols="12">
                            <VuetifyTiptap v-model="form.content" markdown-theme="github" />
                        </v-col>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn type="submit" icon="mdi-check"></v-btn>
                    </v-card-actions>
                </v-card>

            </v-form>
        </v-row>
        <mediaUploader v-model:show="mediaUploaderDialog"></mediaUploader>
    </v-container>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router/auto';
import { useCreateBlogPostForm } from '../hooks/createBlogPost';
import { useGlobalStore } from '@/store/globalStore';
import { SubmitEventPromise } from 'vuetify';
import mediaUploader from '../components/mediaUploader.vue';
import { BlogDto, BlogAdminService } from '@/openapi';

const createBlogPostFormRef = ref();
const route = useRoute("blogPost.create");
const blog = ref<BlogDto>();
const mediaUploaderDialog = ref(false);
const { form, formRules, submit } = useCreateBlogPostForm();

const onSubmit = async (e: SubmitEventPromise) => {
    if ((await e).valid) {
        const { setLoading, setSnackbarText } = useGlobalStore();
        try {
            setLoading(true);
            await submit();
            setSnackbarText("文章创建成功");
        } finally {
            setLoading(false);
        }
    }
}


const createSlug = (title: string) => {
    return title.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

onMounted(async () => {
    form.blogId = route.params.blogId;
    blog.value = await BlogAdminService.blogAdminGet({ id: form.blogId });
});

</script>

<style scoped></style>

<route lang="yaml">
name: blogPost.create
meta: 
  visible: false
  auth: true
  title: 创建文章
  desc: 文章管理
  icon: mdi-newspaper-variant-outline
</route>