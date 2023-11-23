<template>
    <v-hover v-slot="{ isHovering, props }">
        <v-card class="mx-auto" v-bind="props">
            <v-expand-transition>
                <div v-if="isHovering"
                    class="d-flex flex-column align-center transition-fast-in-fast-out bg-grey-lighten-4 v-card--reveal"
                    style="height: 100%;">
                    <template v-if="coverImageMediaUploaded">
                        <div class="font-weight-bold mb-3">该封面已上传，如需更换封面请点击删除</div>
                        <v-btn variant="outlined" color="primary" v-if="coverImageMediaUploaded"
                            @click="removeCoverImageMedia" prepend-icon="mdi-delete-outline">
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
            <v-img :src="previewImage" height="200px" aspect-ratio="16/9" cover></v-img>
        </v-card>
    </v-hover>
    <v-file-input :multiple="false" v-model="coverImageMedias" label="文章封面(如无则可空)" accept="image/*" variant="outlined"
        :show-size="1000" prepend-icon="" prepend-inner-icon="mdi-paperclip">
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
import { useGlobalStore } from '@/store/globalStore';
import { useMediaManager } from '../hooks/mediaManager';
const { uploadMedia, removeMedia } = useMediaManager();
const { setLoading, setSnackbarText } = useGlobalStore();

const coverImageMedias = ref<File[] | undefined>(undefined);
const coverImageMediaUploaded = ref(false);
const previewImage = ref<string | undefined>();
const uploadCoverImageMedia = async () => {
    try {
        setLoading(true);
        const media = await uploadMedia(coverImageMedias.value![0]!);
        coverImageMediaUploaded.value = true;
        setSnackbarText("封面上传成功");
        emits("update:modelValue", media.id);
    } finally {
        setLoading(false);
    }
}

const removeCoverImageMedia = async () => {
    try {
        setLoading(true);
        await removeMedia(props.modelValue!);
        coverImageMediaUploaded.value = false;
        setSnackbarText("删除成功");
    } finally {
        setLoading(false);
    }
}

const props = defineProps({
    modelValue: {
        type: String,
        required: false,
        default: undefined
    }
});

const emits = defineEmits(["update:modelValue"]);


</script>

<style scoped></style>