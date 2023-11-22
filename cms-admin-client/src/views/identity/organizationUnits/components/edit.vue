<template>
    <v-dialog transition="dialog-top-transition" :fullscreen="themeStore.mobile" :model-value="show" :persistent="true"
        :scrollable="true">
        <v-form v-model="updateFormValid" ref="updateFormRef" @submit.prevent="onSubmitUpdateOrganizationUnit">
            <v-card>
                <v-img height="100" :src="setting" cover aspect-ratio="16/9" class="text-white">
                    <v-toolbar color="rgba(0, 0, 0, 0)">
                        <template v-slot:prepend>
                            <v-btn icon="$menu"></v-btn>
                        </template>
                        <v-toolbar-title class="text-h6">
                            更新-{{ updateForm.displayName }}
                        </v-toolbar-title>
                        <template v-slot:append>
                            <v-btn icon="mdi-power" @click="closeDialog" variant="text">
                            </v-btn>
                            <v-btn type="submit" icon="mdi-check" variant="text" :disabled="!updateFormRef.isValid">
                            </v-btn>
                        </template>
                    </v-toolbar>
                </v-img>
                <v-card-text>
                    <v-row class="mt-1">
                        <v-col cols="12" md="6">
                            <v-text-field label="机构名称" v-model="updateForm.displayName" color="primary" variant="outlined"
                                density="compact" type="text" :rules="updateFormRules.displayName">
                            </v-text-field>
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field label="机构号" v-model="updateForm.extraProperties!['OrgNo']" color="primary"
                                variant="outlined" density="compact" type="text"
                                :rules="updateFormRules.extraProperties.OrgNo">
                            </v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-form>
    </v-dialog>
</template>

<script setup lang="ts">
import { SubmitEventPromise } from 'vuetify/lib/framework.mjs';
import { useUpdateOrganizationUnitForm } from '../hooks/updateOrganizationUnit';
import { useThemeStore } from '@/store/themeStore';
import { OrganizationUnitService } from '@/openapi';
import setting from '@/assets/setting.png';

const themeStore = useThemeStore();
let updateFormRef = ref();
const props = defineProps({
    show: {
        type: Boolean,
        required: true
    },
    organizationUnitId: {
        type: String,
        required: true
    }
});

const emits = defineEmits(["update:show", "done"]);

const {
    updateForm,
    updateFormValid,
    updateFormRules,
    initUpdateForm,
    submitUpdateOrganizationUnit, } = useUpdateOrganizationUnitForm();

const onSubmitUpdateOrganizationUnit = async (e: SubmitEventPromise) => {
    let res = await submitUpdateOrganizationUnit(e);
    if (res) {
        updateFormRef.value.reset();
        emits("update:show", false);
        emits("done", true);
    }

}
const closeDialog = () => {
    emits("update:show", false);
}

watch(() => props.show, async (newVal) => {
    if (newVal) {
        let res = await OrganizationUnitService.organizationUnitGet({ id: props.organizationUnitId });
        initUpdateForm(res);
    }
})
</script>

<style scoped></style>