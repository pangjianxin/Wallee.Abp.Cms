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
                您正在编辑<span class="text-primary">{{ blogPost?.title }}</span>
              </span>
            </v-card-subtitle>
            <v-card-text>
              <v-row justify="center">
                <v-col cols="12">
                  <coverImageEditor v-model="form.coverImageMediaId"></coverImageEditor>
                </v-col>
                <v-col cols="12">
                  <v-text-field density="comfortable" label="文章标题" placeholder="标题会直接显示在文章列表中" v-model="form.title"
                    color="primary" variant="outlined" type="text" :rules="formRules.title"
                    prepend-inner-icon="mdi-tag-outline" validate-on="submit">
                  </v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field density="comfortable" label="文章SLUG" placeholder="SLUG能够更好的索引文章" v-model="form.slug"
                    color="primary" variant="outlined" type="text" :rules="formRules.slug"
                    prepend-inner-icon="mdi-tag-check-outline" validate-on="submit">
                  </v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-textarea density="comfortable" :auto-grow="true" :rows="1" label="文章短介绍" placeholder="文章短介绍能够更好的吸引读者"
                    v-model="form.shortDescription" color="primary" variant="outlined" type="text"
                    :rules="formRules.shortDescription" prepend-inner-icon="mdi-content-copy">
                  </v-textarea>
                </v-col>

                <v-col cols="12" v-if="blogPost">
                  <blogPostTagEditor ref="blogPostEditorRef" label="文章标签" :blog-post-id="blogPost?.id">
                  </blogPostTagEditor>
                </v-col>

                <v-col cols="12">
                  <VuetifyTiptap v-model="form.content" min-height="40vh">
                    <template #bottom>
                      <v-row no-gutters align="center">
                        <v-spacer></v-spacer>
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
import { BlogPostAdminService, BlogPostDto } from '@/openapi';
import { useEditBlogPostForm } from '../hooks/editBlogPost';
import { SubmitEventPromise } from 'vuetify/lib/framework.mjs';
import coverImageEditor from '../components/coverImageEditor.vue';
import { useGlobalStore } from '@/store/globalStore';
import { MediaDatabase } from '@/utils/dexie';
import { useMediaManager } from '../hooks/mediaManager';
import onRouteLeavingConfirm from '../components/onRouteLeavingConfirm.vue';
import blogPostTagEditor from '../components/blogPostTagEditor.vue';

const blogPostEditorRef = ref();

const router = useRouter();
const route = useRoute("blogPost.edit");
const blogPost = ref<BlogPostDto>();

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

const formSubmited = ref(false);
const formValid = ref(false);
const formRef = ref();
const { form, formRules, init, submit } = useEditBlogPostForm();

const { uploadMedia, removeMedia, replaceContentBlobWithMedia, ensureIndexedDBCleard, fetchMediaFromBlogPost } = useMediaManager();

const onSubmit = async (e: SubmitEventPromise) => {
  if ((await e).valid) {
    const { setLoading, setSnackbarText } = useGlobalStore();
    try {
      setLoading(true);
      if (form.content) {
        form.content = await handleMedia(form.content);
      }
      await submit(blogPost.value?.id!);
      await ensureIndexedDBCleard();
      formSubmited.value = true;
      setSnackbarText("文章已更新");
      await blogPostEditorRef.value.onSubmit(blogPost.value?.id!);
    } finally {
      setLoading(false);
    }
  }
}

//当表单提交时处理媒体资源
const handleMedia = async (formContent: string) => {
  //1、检查是否有删除的媒体资源
  const checkBlobForDeletion = async (formContent: string, mediaDB: MediaDatabase) => {
    const mediasToBeChecked = await mediaDB.mediasToBeChecked.toArray();
    if (mediasToBeChecked && mediasToBeChecked.length > 0) {
      for (let index = 0; index < mediasToBeChecked.length; index++) {
        const element = mediasToBeChecked[index];
        if (formContent.indexOf(element.mediaDownloadUrl) === -1) {
          await removeMedia(element.mediaDownloadUrl.split("/").pop()!);
        }
      }
    }
  }
  //2、检查是否有要上传的媒体资源
  const fetchBlobAndUpload = async (formContent: string, mediaDB: MediaDatabase) => {
    const mediasToBeUploaded = await mediaDB.mediasToBeUploaded.filter(it => !it.uploaded).toArray();
    if (mediasToBeUploaded && mediasToBeUploaded.length > 0) {
      for (let index = 0; index < mediasToBeUploaded.length; index++) {
        const media = mediasToBeUploaded[index];
        //如果文章内容有这个blobUrl，则进行后续操作
        if (formContent.indexOf(media.blob) > -1) {
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
  const mediaDB = new MediaDatabase();
  //检查是否有删除的媒体资源
  await checkBlobForDeletion(formContent, mediaDB);
  //检查是否有新上传的媒体资源
  formContent = await fetchBlobAndUpload(formContent, mediaDB);
  return formContent;
}

//初始化
onMounted(async () => {
  blogPost.value = await BlogPostAdminService.blogPostAdminGet({ id: route.params.blogPostId });
  await fetchMediaFromBlogPost(blogPost.value);
  init(blogPost.value!);
  window.addEventListener("beforeunload", ensureIndexedDBCleard);
});
//卸载组件时，清理indexedDB
onUnmounted(() => {
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

<style scoped></style>

<route lang="yaml">
name: blogPost.edit
meta: 
  visible: false
  title: 编辑文章
  desc: 博客管理
  auth: true
  icon: mdi-file-document-edit
</route>