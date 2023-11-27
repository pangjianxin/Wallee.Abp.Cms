<template>
    <v-dialog transition="dialog-bottom-transition" width="auto" :model-value="show" :persistent="true">
        <v-card>
            <v-card-title>
                <div class="font-weight-black text-primary">
                    请确认
                </div>
            </v-card-title>
            <v-card-subtitle>
                <div class="text-warning">删除后将无法恢复</div>
            </v-card-subtitle>
            <v-card-text>
                即将删除
                <span class="text-warning">{{ comment?.text }}</span>评论
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn variant="outlined" color="warning" density="comfortable" prepend-icon="mdi-power"
                    @click="closeDialog">
                    取消
                </v-btn>
                <v-btn variant="outlined" color="primary" density="comfortable" prepend-icon="mdi-delete" @click="onDelete">
                    确认
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { CommentAdminService, CommentWithAuthorDto } from '@/openapi';
import { PropType } from 'vue';
import { SubmitEventPromise } from 'vuetify';

const props = defineProps({
    show: {
        type: Boolean,
        required: true
    },
    comment: {
        type: Object as PropType<CommentWithAuthorDto>,
        required: false
    },
});

const emits = defineEmits(["update:show", "done"]);

const closeDialog = () => {
    emits("update:show", false);
}

const onDelete = async (e: SubmitEventPromise) => {
    e.preventDefault();
    await CommentAdminService.commentAdminDelete({ id: props.comment?.id! });
    emits("done", props.comment, "remove");
    emits("update:show", false);
}
</script>

<style scoped></style>
