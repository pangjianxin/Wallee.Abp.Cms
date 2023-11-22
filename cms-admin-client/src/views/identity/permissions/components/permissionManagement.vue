<template>
    <v-dialog transition="dialog-top-transition" width="auto" :fullscreen="themeStore.mobile" :model-value="show"
        :persistent="true" :scrollable="true">
        <v-form @submit.prevent="submitUpdatePermission">
            <v-card width="100%">
                <v-toolbar color="primary" :extended="true">
                    <v-toolbar-title>
                        权限-{{ providerKeyDisplayName }}
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon="mdi-power" variant="text" @click="closeDialog"></v-btn>
                    <v-btn type="submit" icon="mdi-check" variant="text"></v-btn>
                    <template #extension>
                        <v-tabs v-model="tab" direction="horizontal" color="secondary" next-icon="mdi-arrow-right-bold-box-outline"
                            prev-icon="mdi-arrow-left-bold-box-outline" show-arrows>
                            <template v-for="(item, index) in groupNames" :key="index">
                                <v-tab :value="index">
                                    {{ item.displayName }}
                                </v-tab>
                            </template>
                        </v-tabs>
                    </template>
                </v-toolbar>
                <v-card-text>
                    <v-window v-model="tab">
                        <template v-for="(group, index) in permissionInfo" :key="index">
                            <v-window-item :value="index">
                                <v-card flat>
                                    <template #title>
                                        <v-row align="center" justify="space-between" no-gutters>
                                            <span>{{ group.displayName }}</span>
                                            <span>
                                                <v-checkbox label="全选" hide-details density="compact"
                                                    :model-value="isGroupAllSelected(group.name!)"
                                                    @update:model-value="val => onGroupSelected(group.name!, val!)"
                                                    :disabled="isGroupDisabled(group.name!)">
                                                </v-checkbox>
                                            </span>
                                        </v-row>
                                    </template>
                                    <v-divider></v-divider>
                                    <template #text>
                                        <v-row no-gutters>
                                            <template v-for="(item, index) in group.permissions" :key="index">
                                                <v-col cols="12" :offset="item.depth">
                                                    <v-checkbox density="compact" :label="item.displayName!" hide-detiails
                                                        :model-value="item.isGranted"
                                                        @update:model-value="val => onPermissionSelected(item.name!, val!)"
                                                        :disabled="isPermissionDisabled(item.name!)">
                                                    </v-checkbox>
                                                </v-col>
                                            </template>
                                        </v-row>
                                    </template>
                                </v-card>
                            </v-window-item>
                        </template>
                    </v-window>
                </v-card-text>
            </v-card>
        </v-form>
    </v-dialog>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/store/themeStore';
import { useUpdatePermissionForm } from '../hooks/updatePermission';
const { permissionInfo, getPermissions, submitUpdatePermission,
    onGroupSelected, onPermissionSelected, isGroupAllSelected, isGroupDisabled, isPermissionDisabled } = useUpdatePermissionForm();
const themeStore = useThemeStore();
const groupNames = computed(() => {
    return permissionInfo.value.map(it => {
        return {
            name: it.name!,
            displayName: it.displayName!
        }
    });
});

const tab = ref(0);


const props = defineProps({
    show: {
        type: Boolean,
        required: true
    },
    providerName: {
        type: String,
        required: true
    },
    providerKey: {
        type: String,
        required: true
    },
    providerKeyDisplayName: {
        type: String,
        required: true
    }
});

const emits = defineEmits(["update:show"]);

const closeDialog = () => {
    emits("update:show", false);
}

watch(() => props.show, async (newVal) => {
    if (newVal === true) {
        await getPermissions(props.providerKey, props.providerName);
    }
})

</script>

<style scoped></style>