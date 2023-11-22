<template>
    <v-card>
        <v-toolbar color="transparent" density="compact" rounded>
            <v-toolbar-title>
                {{ orgDisplayName }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="secondary" density="compact" variant="text" prepend-icon="mdi-view-grid-plus" v-bind="props"
                @click="onAddRoleDialogActived" v-permission="'AbpIdentity.OrganizationUnit.ManageRoles'">
                添加角色
            </v-btn>
        </v-toolbar>
        <v-infinite-scroll height="65vh" :items="roleList" @load="onLoadRequested" mode="manual">
            <template v-for="(role, index) in roleList" :key="index">
                <v-list-item color="primary" variant="plain" lines="three">
                    <template v-slot:prepend>
                        <v-avatar color="primary">
                            <v-icon>mdi-clipboard-text</v-icon>
                        </v-avatar>
                    </template>
                    <template #title>
                        <div class="font-weight-bold">{{ role.name }}</div>
                    </template>
                    <template #subtitle>
                        <v-chip density="compact" color="primary" variant="elevated">
                            {{ role.isPublic ? '公开' : '非公开' }}
                        </v-chip>
                        &nbsp;
                        <v-chip color="secondary" density="compact" variant="elevated">
                            {{ role.isDefault ? '默认' : '非默认' }}
                        </v-chip>
                    </template>
                    <template v-slot:append>
                        <v-btn color="secondary" icon="mdi-delete-outline" variant="text"
                            @click=onRemoveRoleDialogActivated(role.id!)
                            v-permission="'AbpIdentity.OrganizationUnit.ManageRoles'">
                        </v-btn>
                    </template>
                </v-list-item>
                <v-divider inset></v-divider>
            </template>
            <template #empty>
                <v-alert icon="mdi-information">
                    已到最底部,没有更多数据了....
                </v-alert>
            </template>
            <template #load-more="{ side, props }">
                <v-btn v-if="side === 'end'" color="primary" elevation="2" prepend-icon="mdi-dots-horizontal" v-bind="props"
                    variant="outlined">
                    加载更多
                </v-btn>
            </template>
        </v-infinite-scroll>
    </v-card>
    <removeRole v-model:show="removeRoleDialog" :org-id="orgId" :role-id="removeRoleDialogParams" @done="refresh">
    </removeRole>
    <addRole v-model:show="addRoleDialog" :org-id="orgId" @done="refresh">
    </addRole>
</template>

<script setup lang="ts">
import { useAddedRoleList } from '@/views/identity/organizationUnits/hooks/addedRoleList';
import removeRole from './removeRole.vue';
import addRole from './addRole.vue';

const { roleList, pageable, getAddedRoles } = useAddedRoleList();

const props = defineProps({
    orgId: {
        type: String,
        required: true
    },
    orgDisplayName: {
        type: String,
        required: true
    }
});

//删除角色对话框
let removeRoleDialog = ref(false);
let removeRoleDialogParams = ref("");

//删除角色对话框
const onRemoveRoleDialogActivated = (roleId: string) => {
    removeRoleDialogParams.value = roleId;
    removeRoleDialog.value = true;
}

//添加角色对话框
let addRoleDialog = ref(false);

//添加角色对话框
const onAddRoleDialogActived = () => {
    addRoleDialog.value = true;
}

const onLoadRequested = async (options: {
    side: 'end' | 'start' | 'both'
    done: (status: 'error' | 'loading' | 'empty' | 'ok') => void
}) => {
    options.done("loading");
    pageable.pageNum++;
    var rows = await getAddedRoles(props.orgId);
    if (rows > 0) {
        options.done("ok");
    } else {
        options.done("empty");
    }
}

const refresh = async () => {
    roleList.value = [];
    pageable.pageNum = 1;
    await getAddedRoles(props.orgId);
}

watch(() => props.orgId,
    async (newValue, oldValue) => {
        if (newValue && newValue !== oldValue) {
            await refresh();
        }
    }, {
    immediate: true
});

</script>

<style scoped></style>