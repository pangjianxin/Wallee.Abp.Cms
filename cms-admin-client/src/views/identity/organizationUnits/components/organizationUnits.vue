<template>
    <v-card flat>
        <v-toolbar color="secondary" density="compact" rounded>
            <v-toolbar-title>
                机构列表
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn variant="text" density="compact" prepend-icon="mdi-plus" @click="onCreateDialogActivated(undefined)" v-permission="'AbpIdentity.OrganizationUnit.Create'">根机构</v-btn>
        </v-toolbar>
        <v-virtual-scroll :items="tree" :height="'50vh'" item-height="48">
            <v-list density="compact" nav open-strategy="single" lines="two" v-model:opened="openedListItems">
                <organizationUnitTree :tree="tree"></organizationUnitTree>
            </v-list>
        </v-virtual-scroll>
    </v-card>
    <create v-model:show="createDialog" :parent-id="createDialogParams" @done="e => onDataChanged()">
    </create>
    <edit v-model:show="editDialog" :organization-unit-id="editDialogParams" @done="onDataChanged">
    </edit>
    <remove v-model:show="deleteDialog" :org-id="deleteDialogParams" @done="onDataChanged">
    </remove>
</template>

<script setup lang="ts">
import create from './create.vue';
import edit from './edit.vue';
import remove from './remove.vue';
import organizationUnitTree from './organizationUnitTree.vue';
import { Tree, useOrganizationUnitList } from '../hooks/organizationUnitList';
import { onCreateEventBusKey, onEditEventBusKey, onDeleteEventBusKey, } from '../hooks';

//创建组织机构对话框
let createDialog = ref(false);
let createDialogParams = ref<string | undefined>(undefined);

//编辑组织机构对话框
const editDialog = ref(false);
const editDialogParams = ref('');

//删除组织机构对话框
const deleteDialog = ref(false);
const deleteDialogParams = ref("");

//事件总线，因为这个组件包含了递归子组件，使用vue的事件父子传递会有问题
const editEventBus = useEventBus(onEditEventBusKey);
const deleteEventBus = useEventBus(onDeleteEventBusKey);
const createEventBus = useEventBus(onCreateEventBusKey);

const openedListItems = ref(['00001']);

const tree: Ref<Tree[]> = ref([]);

const { getTree } = useOrganizationUnitList();

//创建组织机构对话框
const onCreateDialogActivated = (id: string | undefined) => {
    createDialogParams.value = id!;
    createDialog.value = true;
}
//删除组织机构对话框
const onDeleteDialogActivated = (id: string) => {
    deleteDialogParams.value = id;
    deleteDialog.value = true;
}
//编辑组织机构对话框
const onEditDialogActivated = (id: string) => {
    editDialogParams.value = id;
    editDialog.value = true;
}

//数据变更--创建、更新、删除操作
const onDataChanged = async () => {
    tree.value = [];
    await getTree(tree.value);
}

onMounted(async () => {
    await getTree(tree.value);
    editEventBus.on(onEditDialogActivated);
    deleteEventBus.on(onDeleteDialogActivated);
    createEventBus.on(onCreateDialogActivated);
});
</script>

<style scoped></style>