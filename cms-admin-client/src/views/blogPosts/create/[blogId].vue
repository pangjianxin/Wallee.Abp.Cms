<template>
    <v-container fluid>
        <v-toolbar color="secondary" rounded>
            <v-toolbar-title>
                写文章
            </v-toolbar-title>
            <v-spacer></v-spacer>
        </v-toolbar>
        <v-row justify="center">
            <v-col cols="7">
                <v-form ref="createBlogPostFormRef" v-model="createBlogPostFormValid" @submit.prevent="onSubmit">
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
                                    <coverImage v-model="form.coverImageMediaId"></coverImage>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field label="文章标题" placeholder="标题会直接显示在文章列表中" v-model="form.title"
                                        color="primary" variant="outlined" type="text" :rules="formRules.title"
                                        prepend-inner-icon="mdi-tag-outline">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field label="文章SLUG" placeholder="SLUG能够更好的索引文章" v-model="form.slug"
                                        color="primary" variant="outlined" type="text" :rules="formRules.slug"
                                        prepend-inner-icon="mdi-tag-check-outline">
                                    </v-text-field>
                                </v-col>

                                <v-col cols="12">
                                    <v-textarea :auto-grow="true" :rows="2" label="文章短介绍" placeholder="文章短介绍能够更好的吸引读者"
                                        v-model="form.shortDescription" color="primary" variant="outlined" type="text"
                                        :rules="formRules.shortDescription" prepend-inner-icon="mdi-content-copy">
                                    </v-textarea>
                                </v-col>

                                <v-col cols="12">
                                    <VuetifyTiptap v-model="form.content">
                                    </VuetifyTiptap>
                                </v-col>
                            </v-row>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn type="submit" variant="outlined">提交</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-form>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router/auto';
import { useCreateBlogPostForm } from '../hooks/createBlogPost';
import { useGlobalStore } from '@/store/globalStore';
import { SubmitEventPromise } from 'vuetify';
import { BlogDto, BlogAdminService, MediaDescriptorDto } from '@/openapi';
import { MediaDatabase } from '@/utils/dexie';
import { useMediaManager } from '../hooks/mediaManager';
import coverImage from '../components/coverImage.vue';

const { setLoading, setSnackbarText } = useGlobalStore();
const { uploadMedia, removeMedia } = useMediaManager();
const { form, formRules, submit } = useCreateBlogPostForm();

const createBlogPostFormValid = ref(false);
const createBlogPostFormRef = ref();
const route = useRoute("blogPost.create");
const blog = ref<BlogDto>();

const onSubmit = async (e: SubmitEventPromise) => {
    if ((await e).valid) {
        console.log(form);
        const mediaDB = new MediaDatabase();
        try {
            setLoading(true);
            if (form.content) {
                const medias = await mediaDB.medias.toArray();
                for (let index = 0; index < medias.length; index++) {
                    const media = medias[index];
                    //如果文章内容有这个blobUrl，则进行后续操作
                    if (form.content.indexOf(media.id!) > -1) {
                        //1、获取blob
                        let blob = await (await fetch(media.id)).blob();
                        //2、上传blob
                        const res = await uploadMedia(new File([blob], media.name));
                        //3、将indexedDB中的该条目标记为已上传
                        await mediaDB.medias.put({ ...media, uploaded: true });
                        //4、替换文章内容中的blobUrl为mediaUrl
                        replaceContentMedia(res, media.id);
                    }
                }
            }
            await submit();
            await mediaDB.medias.clear();
            resetForm();
            setSnackbarText("文章创建成功");
        } catch (err) {
            //如果出现错误，则将所有已上传文件全部删除，并将所有已上传的文件标记为未上传
            const uploadedMedias = await mediaDB.medias.filter(it => it.uploaded === true).toArray();
            if (uploadedMedias && uploadedMedias.length > 0) {
                uploadedMedias.forEach(async element => {
                    await removeMedia(element.mediaId!);
                });
                await mediaDB.medias.bulkPut(uploadedMedias.map(it => ({ ...it, uploaded: false })));
            }
            throw err;
        } finally {
            setLoading(false);
        }
    }
}

const replaceContentMedia = async (media: MediaDescriptorDto, blobUrl: string) => {
    const mediaUrl = `${import.meta.env.VITE_MEDIA_URL}${media.id}`;
    const regex = new RegExp(blobUrl, "g");
    form.content = form.content?.replace(regex, mediaUrl);
}

const resetForm = () => {
    createBlogPostFormRef.value.reset();
    form.content = undefined;
}

onMounted(async () => {
    form.blogId = route.params.blogId;
    blog.value = await BlogAdminService.blogAdminGet({ id: form.blogId });
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