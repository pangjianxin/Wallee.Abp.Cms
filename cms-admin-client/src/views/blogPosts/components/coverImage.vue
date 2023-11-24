<template>
    <v-hover v-slot="{ isHovering, props }" v-if="coverImagePreview">
        <v-card class="mx-auto" v-bind="props">
            <v-expand-transition>
                <div v-if="isHovering"
                    class="d-flex flex-column align-center transition-fast-in-fast-out bg-grey-lighten-4 v-card--reveal"
                    style="height: 100%;">
                    <template v-if="coverImageMediaUploaded">
                        <div class="font-weight-bold mb-3">该封面已上传，如需更换封面请点击删除</div>
                        <v-btn variant="outlined" color="primary" @click="removeCoverImageMedia"
                            prepend-icon="mdi-delete-outline">
                            删除封面
                        </v-btn>
                    </template>
                    <template v-else>
                        <div class="font-weight-bold mb-3">该封面还未上传,点击按钮进行上传</div>
                        <v-btn variant="outlined" color="success" prepend-icon="mdi-upload-outline"
                            @click="uploadCoverImageMedia">
                            上传封面
                        </v-btn>
                    </template>
                </div>
            </v-expand-transition>
            <v-img :src="coverImagePreview" height="200px" aspect-ratio="16/9" cover></v-img>
        </v-card>
    </v-hover>
    <v-file-input density="comfortable" :multiple="false" v-model="coverImageMedias" label="文章封面(如无则可空)" accept="image/*"
        variant="outlined" :show-size="1000" prepend-icon="" prepend-inner-icon="mdi-paperclip" class="mt-3">
        <template v-slot:selection="{ fileNames }">
            <template v-for="(fileName, index) in fileNames" :key="fileName">
                <v-chip v-if="index < 2" color="deep-purple-accent-4" label size="small" class="me-2">
                    {{ fileName }}
                </v-chip>
                <span v-else-if="index === 2" class="text-overline text-grey-darken-3 mx-2">
                    +{{ coverImageMedias?.length! - 2 }} 个文件
                </span>
            </template>
        </template>
    </v-file-input>
</template>

<script setup lang="ts">
interface CoverImageEvents {
    (event: "update:modelValue", mediaId: string | undefined): void;
}
import { useGlobalStore } from '@/store/globalStore';
import { useMediaManager } from '../hooks/mediaManager';
const { uploadMedia, removeMedia } = useMediaManager();
const { setLoading, setSnackbarText } = useGlobalStore();

const coverImageMedias = ref<File[] | undefined>(undefined);
const coverImageMediaUploaded = ref(false);
const coverImagePreview = ref<string | undefined>();

const props = defineProps({
    modelValue: {
        type: String,
        required: false,
        default: undefined
    }
});

const emits = defineEmits<CoverImageEvents>();

const uploadCoverImageMedia = async () => {
    try {
        setLoading(true);
        const media = await uploadMedia(coverImageMedias.value![0]!);
        coverImageMediaUploaded.value = true;
        emits("update:modelValue", media.id);
        setSnackbarText("封面上传成功");
    } finally {
        setLoading(false);
    }
}

const removeCoverImageMedia = async () => {
    try {
        setLoading(true);
        await removeMedia(props.modelValue!);
        coverImageMediaUploaded.value = false;
        emits("update:modelValue", undefined);
        setSnackbarText("封面删除成功");
    } finally {
        setLoading(false);
    }
}

watch(() => coverImageMedias.value, (val) => {
    if (coverImagePreview.value) {
        URL.revokeObjectURL(coverImagePreview.value!);
    }
    if (val && val.length > 0) {
        coverImagePreview.value = URL.createObjectURL(val[0]);
    } else {
        coverImagePreview.value = undefined;
    }
}, { deep: true });

//当父组件表单重置，传入的modelValue为undefined时，清空当前组件的状态
watch(() => props.modelValue, async (val) => {
    if (!val) {
        URL.revokeObjectURL(coverImagePreview.value!);
        coverImageMedias.value = undefined;
        coverImagePreview.value = undefined;
        coverImageMediaUploaded.value = false;
    }
});
</script>
<style scoped lang="scss">
.v-card--reveal {
    align-items: center;
    bottom: 0;
    justify-content: center;
    opacity: .9;
    position: absolute;
    width: 100%;
    z-index: 999;
}
</style>