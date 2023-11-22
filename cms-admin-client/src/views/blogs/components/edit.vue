<template>
    <v-dialog transition="dialog-top-transition" :fullscreen="themeStore.mobile" :model-value="show" :persistent="true"
        :scrollable="true">
        <v-form v-model="editBlogFormValid" ref="editBlogFormRef" @submit.prevent="onSubmit">
            <v-card>
                <v-card-title>
                    <span class="text-h6 font-weight-bold">更新博客</span>
                </v-card-title>
                <v-card-subtitle>
                    <span class="text-subtitle-2">
                        填写博客名称和博客SLUG(用于方便的索引博客)
                    </span>
                </v-card-subtitle>
                <v-card-text>
                    <v-text-field label="博客名称" v-model="form.name" color="primary" variant="outlined" type="text"
                        :rules="formRules.name">
                    </v-text-field>
                    <v-text-field label="博客SLUG" v-model="form.slug" color="primary" variant="outlined" type="text"
                        :rules="formRules.slug">
                    </v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn variant="text" icon="mdi-power" @click="emits('update:show', false)"></v-btn>
                    <v-btn type="submit" variant="text" icon="mdi-check" :disabled="!editBlogFormValid"></v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
    </v-dialog>
</template>

<script setup lang="ts">
import { SubmitEventPromise } from 'vuetify/lib/framework.mjs';
import { useThemeStore } from '@/store/themeStore';
import { useGlobalStore } from '@/store/globalStore';
import { useEditBlogForm } from '../hooks/editBlog';
import { BlogAdminService } from '@/openapi';

const { blogId, form, formRules, submit } = useEditBlogForm();

const themeStore = useThemeStore();
const editBlogFormRef = ref();
const editBlogFormValid = ref(false);
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

const onSubmit = async (e: SubmitEventPromise) => {
    if ((await e).valid) {
        const { setLoading } = useGlobalStore();
        try {
            setLoading(true);
            const res = await submit();
            emits("update:show", false);
            emits("done", res, "edit");
        }
        finally {
            setLoading(false);
        }
    }
}

watch(() => props.show, async (val) => {
    if (val) {
        blogId.value = props.id;
        const blog = await BlogAdminService.blogAdminGet({ id: blogId.value });
        form.name = blog.name!;
        form.slug = blog.slug!;
        form.concurrencyStamp = blog.concurrencyStamp;
    }
})
</script>

<style scoped></style>