<template>
    <v-card elevation="1">
        <v-toolbar color="transparent" density="compact" rounded>
            <v-toolbar-title>
                {{ orgDisplayName }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="secondary" density="compact" variant="text" prepend-icon="mdi-account-plus" v-bind="props"
                @click="onAddUserDialogActivated" v-permission="'AbpIdentity.OrganizationUnit.ManageUsers'">
                添加用户
            </v-btn>
        </v-toolbar>
        <v-infinite-scroll height="35vh" :items="userList" @load="onLoadRequested" mode="manual">
            <template v-for="(user, index) in userList" :key="index">
                <v-list-item color="primary" variant="plain" lines="three">
                    <template v-slot:prepend>
                        <v-avatar color="primary">
                            <v-icon>mdi-clipboard-text</v-icon>
                        </v-avatar>
                    </template>
                    <template #title>
                        <div class="font-weight-bold">{{ user.userName }}</div>
                    </template>
                    <template #subtitle>
                        <div class="font-weight-regular">
                            {{ user.name }}
                        </div>
                    </template>
                    <template v-slot:append>
                        <v-btn color="secondary" icon="mdi-delete-outline" variant="text"
                            @click=onRemoveUserDialogActivated(user.id!)
                            v-permission="'AbpIdentity.OrganizationUnit.ManageUsers'">
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
    <removeUser v-model:show="removeUserDialog" :org-id="orgId" :user-id="removeUserDialogParams" @done="refresh">
    </removeUser>
    <addUser v-model:show="addUserDialog" :org-id="orgId" @done="refresh">
    </addUser>
</template>

<script setup lang="ts">
import { useAddedUserList } from '@/views/identity/organizationUnits/hooks/addedUserList';
import removeUser from './removeUser.vue';
import addUser from './addUser.vue';

const { userList, pageable, userFilter, getUsers } = useAddedUserList();


//删除用户对话框
let removeUserDialog = ref(false);
let removeUserDialogParams = ref("");


//添加用户对话框
let addUserDialog = ref(false);

//添加用户对话框
const onAddUserDialogActivated = () => {
    addUserDialog.value = true;
}

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

const onLoadRequested = async (options: {
    side: 'end' | 'start' | 'both'
    done: (status: 'error' | 'loading' | 'empty' | 'ok') => void
}) => {
    options.done("loading");
    pageable.pageNum++;
    var rows = await getUsers(props.orgId);
    if (rows > 0) {
        options.done("ok");
    } else {
        options.done("empty");
    }
}


//删除用户对话框
const onRemoveUserDialogActivated = (userId: string) => {
    removeUserDialogParams.value = userId;
    removeUserDialog.value = true;
}

const refresh = async () => {
    userList.value = [];
    userFilter.value = "";
    pageable.pageNum = 1;
    await getUsers(props.orgId);
}

watch(() => props.orgId,
    async (newValue, oldValue) => {
        if (newValue && newValue !== oldValue) {
            await refresh();
        }
    }, {
    immediate: true
});

watchDebounced(
    () => userFilter.value,
    async () => {
        await getUsers(props.orgId);
    },
    { debounce: 300, maxWait: 1000 }
);

</script>

<style scoped></style>