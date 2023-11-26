<template>
    <v-form ref="formRef" v-model="formValid">
        <v-combobox v-model="form.tags" :items="popularTags" variant="outlined" chips clearable :label="label" multiple
            :rules="formRules.tags">
            <template v-slot:chip="{ item, props }">
                <v-chip v-bind="props" class="mr-1" label closable>
                    <template v-slot:prepend>
                        <v-avatar class="bg-pink text-uppercase" start>{{ item.value.slice(0, 1) }}</v-avatar>
                    </template>
                    {{ item.title }}
                </v-chip>
            </template>
        </v-combobox>
    </v-form>
</template>

<script setup lang="ts">
import { TagService } from '@/openapi';
import { useEditBlogPostTagsForm } from '../hooks/editBlogPostTags';

const props = defineProps({
    label: {
        type: String,
        required: true
    },
    blogPostId: {
        type: String,
        required: false
    }
});

const formRef = ref();
const formValid = ref(false);
const { form, formRules, submit } = useEditBlogPostTagsForm();
const popularTags = ref<string[]>([]);

const getPopularTags = async () => {
    popularTags.value = (await TagService.tagGetPopularTags({ entityType: form.entityType!, maxCount: 10 })).map(it => it.name!);
}

const onSubmit = async (blogPostId: string) => {
    form.entityId = blogPostId;
    await submit();
}

onMounted(async () => {
    await getPopularTags();
    if (props.blogPostId) {
        console.log("???");
        const res = await TagService.tagGetAllRelatedTags({ entityType: form.entityType!, entityId: props.blogPostId });
        form.tags = res.map(it => it.name!);
    }
});

defineExpose({
    onSubmit
})
</script>

<style scoped></style>