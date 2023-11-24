<template>
    <v-dialog transition="dialog-top-transition" :fullscreen="themeStore.mobile" width="auto" :model-value="show"
        :persistent="true" :scrollable="true">
        <v-form v-model="eidtBlogFeatureFormValid" ref="editBlogFeatureFormRef" @submit.prevent="onSubmit">
            <v-card>
                <v-card-title>
                    <span class="text-h6 font-weight-bold">更新博客功能</span>
                </v-card-title>
                <v-card-subtitle>
                    <span class="text-subtitle-2">
                        用于开放或者关闭该博客的某些功能
                    </span>
                </v-card-subtitle>
                <v-card-text>
                    <v-row>
                        <v-col cols="12">
                            <template v-for="(item, index) in form" :key="index">
                                <v-checkbox :label="form[index].featureName" v-model="form[index].isEnabled"></v-checkbox>
                            </template>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn variant="text" icon="mdi-power" @click="emits('update:show', false)"></v-btn>
                    <v-btn type="submit" variant="text" icon="mdi-check" :disabled="!eidtBlogFeatureFormValid"></v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
    </v-dialog>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/store/themeStore';
import { useEditBlogFeature } from '../hooks/eidtBlogFeature';
import { SubmitEventPromise } from 'vuetify/lib/framework.mjs';
import { useGlobalStore } from '@/store/globalStore';
const themeStore = useThemeStore();
const editBlogFeatureFormRef = ref();
const eidtBlogFeatureFormValid = ref(false);
const props = defineProps({
    show: {
        type: Boolean,
        required: true
    },
    id: {
        type: String,
        required: true
    }
});
const emits = defineEmits(["update:show", "done"]);

const { fetchFeatures, form, submit } = useEditBlogFeature();

watch(() => props.show, async val => {
    if (val) {
        await fetchFeatures(props.id);
    }
});

const onSubmit = async (e: SubmitEventPromise) => {
    if ((await e).valid) {
        const { setLoading, setSnackbarText } = useGlobalStore();
        try {
            setLoading(true);
            await submit(props.id);
            emits("done", true);
            emits("update:show", false);
            setSnackbarText("更新博客功能成功");
        } finally {
            setLoading(false);
        }
    }
}
</script>

<style scoped></style>