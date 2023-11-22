<template>
    <v-bottom-sheet :model-value="show" :persistent="true">
        <v-row justify="center">
            <v-col cols="6">
                <v-card>
                    <v-card-title>
                        <span class="text-h6 font-weight-bold">上传媒体资源</span>
                    </v-card-title>
                    <v-card-text>
                        <v-file-input :multiple="false" v-model="selectedFiles" label="选择文件" accept="image/*"
                            variant="outlined" :show-size="1000" counter>
                            <template v-slot:selection="{ fileNames }">
                                <template v-for="(fileName, index) in fileNames" :key="fileName">
                                    <v-chip v-if="index < 2" color="deep-purple-accent-4" label size="small" class="me-2">
                                        {{ fileName }}
                                    </v-chip>
                                    <span v-else-if="index === 2" class="text-overline text-grey-darken-3 mx-2">
                                        +{{ selectedFiles?.length! - 2 }} 个文件
                                    </span>
                                </template>
                            </template>
                        </v-file-input>
                        <v-sheet v-if="previewImage" class="my-3">
                            <v-img :src="previewImage" height="200px" aspect-ratio="16/9" cover></v-img>
                        </v-sheet>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn value="text" icon="mdi-power" @click="close"></v-btn>
                        <v-btn variant="text" icon="mdi-check" @click="upload"></v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-bottom-sheet>
</template>
  
<script lang="ts" setup>
import { MediaDescriptorAdminService } from '@/openapi';
const selectedFiles = ref<File[]>([]);
const previewImage = ref<string | undefined>();

const props = defineProps({
    show: {
        type: Boolean,
        required: true,
    },
    entityType: {
        type: String,
        required: false,
        default: "BlogPost"
    }
});

const emits = defineEmits(["update:show", "done"]);

const upload = async () => {
    const res = await MediaDescriptorAdminService.mediaDescriptorAdminCreate({
        entityType: props.entityType,
        name: selectedFiles.value[0].name,
        formData: {
            File: selectedFiles.value[0]
        }
    });
    emits("done", res);
    emits("update:show", false);
}

const close = () => {
    emits("update:show", false);
}

watch(() => selectedFiles.value[0], async (newVal) => {
    console.log(newVal);
    URL.revokeObjectURL(previewImage.value!);
    previewImage.value = undefined;
    if (newVal) {
        previewImage.value = URL.createObjectURL(newVal);
    }
}, {
    deep: true
});

watch(() => props.show, (val) => {
    if (val === false) {
        if (previewImage.value) {
            URL.revokeObjectURL(previewImage.value);
        }
    }
});
</script>
  
<style scoped>
.preview {
    max-width: 200px;
}
</style>