<template>
    <v-dialog transition="dialog-top-transition" :fullscreen="themeStore.mobile" width="auto" :model-value="show"
        :persistent="true" :scrollable="true">
        <v-form v-model="formValid" ref="formRef" @submit.prevent="onSubmit">
            <v-card>
                <v-card-title>
                    <span class="text-h6 font-weight-bold">创建博客</span>
                </v-card-title>
                <v-card-subtitle>
                    <span class="text-subtitle-2">
                        填写博客名称和博客SLUG(用于方便的索引博客)
                    </span>
                </v-card-subtitle>
                <v-card-text>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field label="博客名称" :autofocus="true" v-model="form.name" color="primary"
                                variant="outlined" type="text" :rules="formRules.name">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field label="博客SLUG" v-model="form.slug" color="primary" variant="outlined" type="text"
                                :rules="formRules.slug">
                            </v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn variant="text" icon="mdi-power" @click="emits('update:show', false)"></v-btn>
                    <v-btn type="submit" variant="text" icon="mdi-check" :disabled="!formValid"></v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
    </v-dialog>
</template>

<script setup lang="ts">
import { SubmitEventPromise } from 'vuetify/lib/framework.mjs';
import { useCreateBlogForm } from '../hooks/createBlog';
import { useThemeStore } from '@/store/themeStore';
import { useGlobalStore } from '@/store/globalStore';
const themeStore = useThemeStore();
const formRef = ref();
const formValid = ref(false);
defineProps({
    show: {
        type: Boolean,
        required: true
    },
});

const emits = defineEmits(["update:show", "done"]);

const { form, formRules, submit } = useCreateBlogForm();

const onSubmit = async (e: SubmitEventPromise) => {
    if ((await e).valid) {
        const { setLoading } = useGlobalStore();
        try {
            setLoading(true);
            const res = await submit();
            emits("done", res, "create");
            formRef.value.reset();
            emits("update:show", false);

        }
        finally {
            setLoading(false);
        }
    }
}
</script>

<style scoped></style>