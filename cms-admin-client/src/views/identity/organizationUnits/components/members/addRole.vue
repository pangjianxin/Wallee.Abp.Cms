<template>
    <v-dialog :model-value="show" :fullscreen="themeStore.mobile" transition="dialog-top-transition" :persistent="true"
        :scrollable="true">
        <v-card elevation="1">
            <v-img height="100" :src="settings" cover aspect-ratio="16/9" class="text-white">
                <v-toolbar color="rgba(0, 0, 0, 0)">
                    <template v-slot:prepend>
                        <v-btn icon="$menu"></v-btn>
                    </template>
                    <v-toolbar-title class="text-h6">
                        添加角色
                    </v-toolbar-title>
                    <template v-slot:append>
                        <v-spacer></v-spacer>
                        <v-btn variant="text" icon="mdi-power" @click="closeDialog">
                        </v-btn>
                        <v-btn variant="text" icon="mdi-check" @click="onSubmitAddRoles"
                            :disabled="selectedRoles.length <= 0" class="ml-1">
                        </v-btn>
                    </template>
                </v-toolbar>
            </v-img>
            <v-card-text>
                <v-list select-strategy="classic" v-model:selected="selectedRoles" lines="two">
                    <v-list-item v-for="(item, index) in unaddedRoleList" :key="index" :value="item.id">
                        <template #append="{ isActive }">
                            <v-list-item-action start>
                                <v-checkbox-btn :model-value="isActive"></v-checkbox-btn>
                            </v-list-item-action>
                        </template>
                        <template #prepend>
                            <v-icon color="secondary">mdi-account-plus</v-icon>
                        </template>
                        <template #title>
                            {{ item.name }}
                        </template>
                        <template #subtitle>
                            <v-chip density="compact" color="primary" variant="elevated">
                                {{ item.isPublic ? '公开' : '非公开' }}
                            </v-chip>
                            &nbsp;
                            <v-chip color="secondary" density="compact" variant="elevated">
                                {{ item.isDefault ? '默认' : '非默认' }}
                            </v-chip>
                        </template>
                    </v-list-item>
                </v-list>
            </v-card-text>
            <v-pagination v-model="pageable.pageNum" :ellipsis="undefined" :length="pageCount"></v-pagination>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { useUnaddedRoleList } from '@/views/identity/organizationUnits/hooks/unaddedRoleList';
import { useThemeStore } from '@/store/themeStore';
import { useGlobalStore } from '@/store/globalStore';
import { OrganizationUnitService } from '@/openapi';
import settings from '@/assets/setting.png';

const themeStore = useThemeStore();

const { unaddedRoleList, pageCount, pageable, getUnaddedRoles } = useUnaddedRoleList();
const selectedRoles = ref<string[]>([]);

const props = defineProps({
    show: {
        type: Boolean,
        required: true
    },
    orgId: {
        type: String,
        required: true
    }
});


const emits = defineEmits(["update:show", "done"]);

const closeDialog = () => {
    emits("update:show", false);
}

const onSubmitAddRoles = async () => {
    const { setLoading, setSnackbarText } = useGlobalStore();
    if (selectedRoles.value.length === 0) {
        setSnackbarText("请选择用户", "warning");
        return;
    }
    try {
        setLoading(true);
        await OrganizationUnitService.organizationUnitAddRoles({
            id: props.orgId,
            requestBody: {
                roleIds: selectedRoles.value
            }
        })
        setSnackbarText("添加成功");
    } finally {
        setLoading(false);
    }
    emits("done", selectedRoles.value);
    emits("update:show", false);
    selectedRoles.value = [];
}

watch(() => props.show, async (newValue) => {
    if (newValue) {
        await getUnaddedRoles(props.orgId);
    }
});
</script>

<style scoped></style>