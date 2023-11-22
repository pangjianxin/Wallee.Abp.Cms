<template>
    <v-dialog transition="dialog-top-transition" :fullscreen="themeStore.mobile" :model-value="show" :persistent="true"
        :scrollable="true">
        <v-form v-model="createFormValid" ref="createFormRef" @submit.prevent="onSubmitCreateOrganizationUnit">
            <v-card>
                <v-img height="100" :src="setting" cover aspect-ratio="16/9" class="text-white">
                    <v-toolbar color="rgba(0, 0, 0, 0)">
                        <template v-slot:prepend>
                            <v-btn icon="$menu"></v-btn>
                        </template>
                        <v-toolbar-title class="text-h6">
                            创建机构
                        </v-toolbar-title>
                        <template v-slot:append>
                            <v-btn color="white" density="compact" variant="text" @click="closeDialog" icon="mdi-power">
                            </v-btn>
                            <v-btn color="white" type="submit" icon="mdi-check" variant="text" :disabled="!createFormValid">
                            </v-btn>
                        </template>
                    </v-toolbar>
                </v-img>
                <v-card-text>
                    <v-row class="mt-1">
                        <v-col cols="12" md="6">
                            <v-text-field label="机构名称" v-model="createForm.displayName" color="primary" variant="outlined"
                                density="compact" type="text" :rules="createFormRules.displayName">
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field label="机构号" v-model="createForm.extraProperties!['OrgNo']" color="primary"
                                variant="outlined" density="compact" type="text"
                                :rules="createFormRules.extraProperties.OrgNo">
                            </v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-form>
    </v-dialog>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/store/themeStore';
import { useCreateOrganizationUnitForm } from '../hooks/createOrganizationUnit';
import { SubmitEventPromise } from 'vuetify';
import setting from '@/assets/setting.png';
const createFormRef = ref();
const { createForm,
    createFormRules,
    createFormValid,
    initCreateForm,
    submitCreateOrganizationUnit, } = useCreateOrganizationUnitForm();
const themeStore = useThemeStore();

const props = defineProps({
    show: {
        type: Boolean,
        required: true
    },
    parentId: {
        type: String,
        required: false
    }
});

const emits = defineEmits(["update:show", "done"]);

const closeDialog = () => {
    emits("update:show", false);
}

const onSubmitCreateOrganizationUnit = async (e: SubmitEventPromise) => {
    let res = await submitCreateOrganizationUnit(e);
    if (res === true) {
        createFormRef.value.reset();
        emits("done", true);
        emits("update:show", false);
    }

}

watch(() => props.show, (newVal) => {
    if (newVal) {
        initCreateForm(props.parentId);
    }
})
</script>

<style scoped></style>