<template>
    <v-container fluid>
        <v-toolbar color="secondary" rounded>
            <v-toolbar-title v-if="!searchBarActivated">
                用户列表
            </v-toolbar-title>
            <v-scale-transition>
                <v-text-field v-if="searchBarActivated" placeholder="搜索...." variant="solo" density="compact" hide-details
                    append-inner-icon="mdi-power" v-model="filter" @click:append-inner="toggleSearchBar" class="ml-3 w-100">
                </v-text-field>
            </v-scale-transition>
            <v-spacer></v-spacer>
            <v-btn variant="text" icon="mdi-feature-search" v-if="!searchBarActivated"
                @click="searchBarActivated = !searchBarActivated">
            </v-btn>

            <v-btn variant="text" icon="mdi-account-plus" @click="onCreateDialogActivated"
                v-permission="'AbpIdentity.Users.Create'">
            </v-btn>
        </v-toolbar>

        <v-infinite-scroll :items="list" @load="onLoad">
            <template v-for="(item, index) in list" :key="index">
                <v-list-item lines="one">
                    <template #prepend>
                        <v-avatar :image="roleItem"></v-avatar>
                    </template>
                    <template #title>
                        <span class="text-h6 text-primary">{{ item.name }}</span>
                    </template>
                    <template #append>
                        <v-menu location="end">
                            <template v-slot:activator="{ props }">
                                <v-btn color="secondary" variant="elevated" density="compact" icon="mdi-menu"
                                    v-bind="props">
                                </v-btn>
                            </template>
                            <v-list density="compact" lines="one" nav>
                                <v-list-item @click="onEditDialogActived(item.id!)"
                                    v-permission="'AbpIdentity.Users.Update'">
                                    <template #title>
                                        更新
                                    </template>
                                    <template #prepend>
                                        <v-icon color="primary">mdi-cog</v-icon>
                                    </template>
                                </v-list-item>
                                <v-list-item @click="onDeleteDialogActivated(item)"
                                    v-permission="'AbpIdentity.Users.Delete'">
                                    <template #title>
                                        删除
                                    </template>
                                    <template #prepend>
                                        <v-icon color="warning">mdi-delete</v-icon>
                                    </template>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </template>
                </v-list-item>
            </template>
            <template #empty>
                <v-alert icon="mdi-information">
                    已到最底部,没有更多数据了....
                </v-alert>
            </template>
        </v-infinite-scroll>

        <create v-model:show="createDialog" @done="onDataChanged"></create>
    </v-container>
</template>

<script setup lang="ts">
import { TenantDto } from '@/openapi';
import create from '@/views/tenants/components/create.vue';
import { useTenantList } from '@/views/tenants/hooks/tenantList';
import roleItem from '@/assets/role-item.png';


const {
    list,
    filter,
    scrollList,
    onDataChanged } = useTenantList();

//搜索栏状态
const searchBarActivated = ref(false);
const toggleSearchBar = () => {
    searchBarActivated.value = !searchBarActivated.value;
    filter.value = "";
}

//创建对话框状态
const createDialog = ref(false);
const onCreateDialogActivated = () => {
    createDialog.value = true;
}

//编辑对话框状态
const editDialog = ref(false);
const editDialogParams = ref<string>("");
const onEditDialogActived = (tenantId: string) => {
    editDialog.value = true;
    editDialogParams.value = tenantId;
}

//删除对话框状态
const deleteDialog = ref(false);
const deleteDialogParams = ref<TenantDto>();
const onDeleteDialogActivated = (input: TenantDto) => {
    deleteDialog.value = true;
    deleteDialogParams.value = input;
}

//infinite scroll load事件
const onLoad = async ({ side, done }: { side: 'end' | 'start' | 'both', done: (status: 'error' | 'loading' | 'empty' | 'ok') => void }) => {
    if (side === "end") {
        var rows = await scrollList(1);
        if (rows > 0) {
            done("ok");
        } else {
            done("empty");
        }
    }
}


</script>

<style scoped></style>

<route lang="yaml">
name: tenant.index
meta: 
  title: 租户列表
  desc: 租户管理
  icon: mdi-account-multiple
  visible: true
  visibleOnBottom: false
  auth: true
  permission: 
    - AbpTenantManagement.Tenants
</route>