<template>
    <v-dialog :model-value="show" :fullscreen="themeStore.mobile" transition="dialog-top-transition" :persistent="true"
        :scrollable="true">
        <v-card flat width="100%">
            <v-img height="100" :src="setting" cover aspect-ratio="16/9" class="text-white">
                <v-toolbar color="rgba(0, 0, 0, 0)">
                    <template v-slot:prepend>
                        <v-btn icon="$menu"></v-btn>
                    </template>
                    <v-toolbar-title class="text-h6">
                        添加用户
                    </v-toolbar-title>
                    <template v-slot:append>
                        <v-spacer></v-spacer>
                        <v-btn variant="text" icon="mdi-power" @click="closeDialog">
                        </v-btn>
                        <v-btn variant="text" icon="mdi-check" @click="onSubmitAddUsers"
                            :disabled="selectedUsers.length <= 0" class="ml-1">
                        </v-btn>
                    </template>
                </v-toolbar>
            </v-img>
            <v-card-text>
                <v-text-field v-model="unAddedUserFilter" density="compact" hide-details variant="outlined" label="搜索用户"
                    class="ma-3" rounded>
                </v-text-field>
                <v-list select-strategy="classic" v-model:selected="selectedUsers" lines="two">
                    <v-list-item v-for="(item, index) in unaddedUserList" :key="index" :value="item.id">
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
                            登录名:{{ item.userName }}
                        </template>
                    </v-list-item>
                </v-list>
            </v-card-text>
            <v-pagination v-model="pageable.pageNum" :ellipsis="undefined" :length="pageCount"></v-pagination>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { useUnaddedUserList } from '@/views/identity/organizationUnits/hooks/unaddedUserList';
import { useThemeStore } from '@/store/themeStore';
import { useGlobalStore } from '@/store/globalStore';
import { OrganizationUnitService } from '@/openapi';
import setting from '@/assets/setting.png';

const themeStore = useThemeStore();
const {
    unaddedUserList,
    unAddedUserFilter,
    pageable,
    pageCount,
    getUnaddedUsers } = useUnaddedUserList();

const selectedUsers = ref<string[]>([]);

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

const onSubmitAddUsers = async () => {
    const { setLoading, setSnackbarText } = useGlobalStore();
    if (selectedUsers.value.length === 0) {
        setSnackbarText("请选择用户", "warning");
        return;
    }
    try {
        setLoading(true);
        await OrganizationUnitService.organizationUnitAddUsers({
            id: props.orgId,
            requestBody: {
                userIds: selectedUsers.value
            }
        })
        setSnackbarText("添加成功");
    } finally {
        setLoading(false);
    }
    emits("done", selectedUsers.value);
    emits("update:show", false);
    selectedUsers.value = [];
}

watch(() => props.show, async (newValue) => {
    if (newValue) {
        await getUnaddedUsers(props.orgId);
    }
});
</script>

<style scoped></style>../hooks/organizationUnitMembers