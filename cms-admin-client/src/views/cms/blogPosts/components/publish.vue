<template>
    <v-dialog transition="dialog-bottom-transition" min-width="400" width="auto" :model-value="show" :persistent="true">
        <v-card>
            <v-card-title>
                <div class="font-weight-black text-primary">
                    请确认
                </div>
            </v-card-title>
            <v-card-subtitle>
                <div class="text-warning">请确认如下内容:</div>
            </v-card-subtitle>
            <v-card-text>
                即将发布<span class="text-warning">{{ blogPost?.title }}</span>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn variant="outlined" color="warning" density="comfortable" prepend-icon="mdi-power"
                    @click="closeDialog">
                    取消
                </v-btn>
                <v-btn variant="outlined" color="primary" density="comfortable" prepend-icon="mdi-delete"
                    @click="onPublish">
                    确认
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { BlogPostAdminService, BlogPostListDto } from '@/openapi';
import { PropType } from 'vue';
import { SubmitEventPromise } from 'vuetify';

const props = defineProps({
    show: {
        type: Boolean,
        required: true
    },
    blogPost: {
        type: Object as PropType<BlogPostListDto>,
        required: false
    },
});

const emits = defineEmits(["update:show", "done"]);

const closeDialog = () => {
    emits("update:show", false);
}

const onPublish = async (e: SubmitEventPromise) => {
    e.preventDefault();
    await BlogPostAdminService.blogPostAdminPublish({ id: props.blogPost?.id! });
    emits("done", true);
    emits("update:show", false);
}
</script>

<style scoped></style>
