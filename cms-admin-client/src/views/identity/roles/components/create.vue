
<template>
    <v-dialog transition="dialog-top-transition" :fullscreen="themeStore.mobile" width="auto" :model-value="show" :persistent="true"
        :scrollable="true">
        <v-form v-model="createFormValid" ref="createFormRef" @submit.prevent="onSubmitCreateIdentityRole">
            <v-card>
                <v-img height="100" :src="setting" cover aspect-ratio="16/9" class="text-white">
                    <v-toolbar color="rgba(0, 0, 0, 0)" :extended="true">
                        <v-toolbar-title color="white">
                            创建角色信息
                        </v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn icon="mdi-power" variant="text" @click="closeDialog"></v-btn>
                        <v-btn type="submit" icon="mdi-check" variant="text"></v-btn>
                    </v-toolbar>
                </v-img>
                <v-card-text>
                    <v-row class="mt-1" no-gutters>
                        <v-col cols="12">
                            <v-text-field label="角色名称" v-model="createForm.name" color="primary" variant="outlined"
                                density="compact" type="text" :rules="createFormRules.name">
                            </v-text-field>
                        </v-col>

                        <v-col cols="12">
                            <v-checkbox color="primary" density="compact" v-model="createForm.isDefault" label="是否默认"
                                :rules="createFormRules.isDefault">
                            </v-checkbox>
                        </v-col>

                        <v-col cols="12">
                            <v-checkbox color="primary" density="compact" v-model="createForm.isPublic" label="是否公开"
                                :rules="createFormRules.isPublic">
                            </v-checkbox>
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
import { useCreateIdentityRoleForm } from '../hooks/createIdentityRole';
import setting from '@/assets/setting.png';

const { createFormValid,
    createForm,
    createFormRules,
    submitCreateIdentityRole, } = useCreateIdentityRoleForm();
const createFormRef = ref();
const themeStore = useThemeStore();

defineProps({
    show: { type: Boolean, required: true }
})

const emits = defineEmits(["update:show", "done"]);

const closeDialog = () => {
    emits("update:show", false);
}



const onSubmitCreateIdentityRole = async (e: SubmitEventPromise) => {
    createFormValid.value = (await e).valid;
    if (createFormValid.value) {
        const created = await submitCreateIdentityRole();
        emits("done", created, "create");
        emits("update:show", false);
    }

}
</script>

<style scoped></style>