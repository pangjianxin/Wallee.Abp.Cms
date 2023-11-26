<template>
    <v-container fluid>
        <v-toolbar color="secondary" rounded>
            <v-toolbar-title>
                写文章
            </v-toolbar-title>
            <v-spacer></v-spacer>
        </v-toolbar>
        <v-row justify="center">
            <v-col cols="12" lg="7" md="10">
                <v-form ref="formRef" v-model="formValid" @submit.prevent="onSubmit">
                    <v-card>
                        <v-card-title class="d-flex flex-row justify-space-between align-center">
                            <span class="text-h6 font-weight-bold">
                                编辑博客文章
                            </span>
                        </v-card-title>
                        <v-card-subtitle>
                            <span class="text-subtitle-2 font-weight-bold">
                                您正在编辑博客<span class="text-primary">{{ blog?.name }}</span>的文章
                            </span>
                        </v-card-subtitle>
                        <v-card-text>
                            <v-row justify="center">
                                <v-col cols="12">
                                    <coverImageEditor v-model="form.coverImageMediaId"></coverImageEditor>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field density="comfortable" label="文章标题" placeholder="标题会直接显示在文章列表中"
                                        v-model="form.title" color="primary" variant="outlined" type="text"
                                        :rules="formRules.title" prepend-inner-icon="mdi-tag-outline" validate-on="submit">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field density="comfortable" label="文章SLUG" placeholder="SLUG能够更好的索引文章"
                                        v-model="form.slug" color="primary" variant="outlined" type="text"
                                        :rules="formRules.slug" prepend-inner-icon="mdi-tag-check-outline"
                                        validate-on="submit">
                                    </v-text-field>
                                </v-col>

                                <v-col cols="12">
                                    <v-textarea density="comfortable" :auto-grow="true" :rows="1" label="文章短介绍"
                                        placeholder="文章短介绍能够更好的吸引读者" v-model="form.shortDescription" color="primary"
                                        variant="outlined" type="text" :rules="formRules.shortDescription"
                                        prepend-inner-icon="mdi-content-copy">
                                    </v-textarea>
                                </v-col>

                                <v-col cols="12">
                                    <blogPostTagEditor ref="blogPostTagEditorRef" :label="'文章标签'">
                                    </blogPostTagEditor>
                                </v-col>

                                <v-col cols="12">
                                    <VuetifyTiptap v-model="form.content" min-height="40vh">
                                        <template #bottom>
                                            <v-row justify="space-between" no-gutters align="center">
                                                <v-btn-toggle v-model="operationType" mandatory>
                                                    <v-btn prepend-icon="mdi-file-document-alert" value="draft">草稿</v-btn>
                                                    <v-btn prepend-icon="mdi-file-document-edit" value="review">送审</v-btn>
                                                    <v-btn prepend-icon="mdi-file-document-check" value="publish"
                                                        v-permission="'CmsKit.BlogPosts.Publish'">
                                                        发布
                                                    </v-btn>
                                                </v-btn-toggle>
                                                <v-btn type="submit" variant="outlined" :disabled="formSubmited">
                                                    提交
                                                </v-btn>
                                            </v-row>
                                        </template>
                                    </VuetifyTiptap>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-form>
            </v-col>
        </v-row>
        <onRouteLeavingConfirm v-model="onRouteLeavingConfirmDialog" @update:confirm="onRouteLeavingConfirmed">
        </onRouteLeavingConfirm>
    </v-container>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router/auto';
import { useCreateBlogPostForm } from '../hooks/createBlogPost';
import { useGlobalStore } from '@/store/globalStore';
import { BlogDto, BlogAdminService, BlogPostDto } from '@/openapi';
import { MediaDatabase } from '@/utils/dexie';
import { useMediaManager } from '../hooks/mediaManager';
import coverImageEditor from '../components/coverImageEditor.vue';
import { SubmitEventPromise } from 'vuetify';
import onRouteLeavingConfirm from '../components/onRouteLeavingConfirm.vue';
import blogPostTagEditor from '../components/blogPostTagEditor.vue';
import router from '@/router';

const { setLoading, setSnackbarText } = useGlobalStore();
const { uploadMedia, replaceContentBlobWithMedia, ensureIndexedDBCleard } = useMediaManager();
const { form, formRules, saveDraft, saveAndPublish, saveAndSendToReview } = useCreateBlogPostForm();

const formValid = ref(false);
const formRef = ref();
const formSubmited = ref(false);
const formSubmitResult = ref<BlogPostDto>();
const blogPostTagEditorRef = ref();
const route = useRoute("blogPost.create");
const blog = ref<BlogDto>();
const operationType = ref<"draft" | "publish" | "review">("draft");

const onRouteLeavingConfirmDialog = ref(false);
const routeLeavingConfirmed = ref(false);
const routeTo = ref<any>();

const onRouteLeavingConfirmed = async (e: boolean) => {
    routeLeavingConfirmed.value = e;
    if (e) {
        await ensureIndexedDBCleard();
        await router.push({ name: routeTo.value.name });
    }
}

const onSubmit = async (e: SubmitEventPromise) => {
    if ((await e).valid) {
        const mediaDB = new MediaDatabase();
        try {
            setLoading(true);
            if (form.content) {
                form.content = await fetchBlobToUploadAndReplace(form.content, mediaDB);
            }
            switch (operationType.value) {
                case "draft":
                    formSubmitResult.value = await saveDraft();
                    break;
                case "publish":
                    formSubmitResult.value = await saveAndPublish();
                    break;
                case "review":
                    formSubmitResult.value = await saveAndSendToReview();
                    break;
            }
            formSubmited.value = true;
            await ensureIndexedDBCleard();
            setSnackbarText("文章创建成功");
            await blogPostTagEditorRef.value.onSubmit(formSubmitResult.value.id!);
        } finally {
            setLoading(false);
        }
    }
}

const fetchBlobToUploadAndReplace = async (formContent: string, mediaDB: MediaDatabase) => {
    const mediasToBeUploaded = await mediaDB.mediasToBeUploaded.filter(it => !it.uploaded).toArray();
    if (mediasToBeUploaded && mediasToBeUploaded.length > 0) {
        for (let index = 0; index < mediasToBeUploaded.length; index++) {
            const media = mediasToBeUploaded[index];
            //如果文章内容有这个blobUrl，则进行后续操作
            if (formContent.indexOf(media.blob!) > -1) {
                //1、获取blob
                let blob = await (await fetch(media.blob)).blob();
                //2、上传blob
                const res = await uploadMedia(new File([blob], media.name));
                //3、将indexedDB中的该条目标记为已上传
                await mediaDB.mediasToBeUploaded.put({ ...media, uploaded: true });
                //4、替换文章内容中的blobUrl为mediaUrl
                formContent = replaceContentBlobWithMedia(res, media.blob, formContent);
            }
        }
    }
    return formContent;
}

onMounted(async () => {
    //用户有可能中途刷新页面，这个时候需要清理indexedDB
    window.addEventListener('beforeunload', ensureIndexedDBCleard);
    form.blogId = route.params.blogId;
    blog.value = await BlogAdminService.blogAdminGet({ id: form.blogId });
});

//卸载组件时，清理indexedDB
onUnmounted(() => {
    //用户有可能中途刷新页面，这个时候需要清理indexedDB
    window.removeEventListener('beforeunload', ensureIndexedDBCleard);
});

//路由检测到切换时，如果表单尚未提交，则弹出提示框
onBeforeRouteLeave((to, from, next) => {
    if (!routeLeavingConfirmed.value) {
        if (formSubmited.value) {
            next();
        } else {
            routeTo.value = to;
            onRouteLeavingConfirmDialog.value = true;
        }
    } else {
        next();
    }
});
</script>

<style scoped lang="scss"></style>

<route lang="yaml">
name: blogPost.create
meta: 
  visible: false
  auth: true
  title: 创建文章
  desc: 文章管理
  icon: mdi-newspaper-variant-outline
</route>