
<template>
    <v-dialog transition="dialog-top-transition" :fullscreen="themeStore.mobile" min-width="400" width="auto" :model-value="show"
        :persistent="true" :scrollable="true">
        <v-form v-model="formValid" ref="formRef" @submit.prevent="onSubmit">
            <v-card>
                <v-img height="100" :src="setting" cover aspect-ratio="16/9" class="text-white">
                    <v-toolbar color="rgba(0, 0, 0, 0)">
                        <v-toolbar-title>
                            更新标签信息
                        </v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn icon="mdi-power" variant="text" @click="closeDialog"></v-btn>
                        <v-btn type="submit" icon="mdi-check" variant="text"></v-btn>
                    </v-toolbar>
                </v-img>
                <v-card-text>
                    <v-row class="mt-1" no-gutters>
                        <v-col cols="12">
                            <v-text-field label="标签名称" v-model="form.name" color="primary" variant="outlined"
                                density="compact" type="text" :rules="formRules.name">
                            </v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-form>
    </v-dialog>
</template>

<script setup lang="ts">
import { SubmitEventPromise } from 'vuetify';
import { useThemeStore } from '@/store/themeStore';
import { useEditTagForm } from "../hooks/editTag";
import { TagAdminService } from '@/openapi';
import setting from '@/assets/setting.png';
const { form, formRules, submit, init, formValid, formRef } = useEditTagForm();
const themeStore = useThemeStore();
const props = defineProps({
    show: {
        type: Boolean,
        required: true
    },
    tagId: {
        type: String,
        required: false
    }
})

const emits = defineEmits(["update:show", "done"]);

const closeDialog = () => {
    emits("update:show", false);
}

watch(() => props.show, async (newVal) => {
    if (newVal === true) {
        const res = await TagAdminService.tagAdminGet({ id: props.tagId! });
        init(res);
    }
});

const onSubmit = async (e: SubmitEventPromise) => {
    if ((await e).valid) {
        const edited = await submit();
        emits("done", edited, "edit");
        emits("update:show", false);
    }

}
</script>

<style scoped></style>