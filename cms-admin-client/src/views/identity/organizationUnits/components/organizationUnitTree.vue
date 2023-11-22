<template>
    <template v-for="(item, index) in tree" :key="index">
        <v-list-group v-if="item.children.length > 0" :value="item.code">
            <template v-slot:activator="{ props, isOpen }">
                <v-list-item v-bind="props">
                    <template #prepend>
                        <v-icon density="compact"
                            :icon="isOpen ? 'mdi-arrow-down-bold-circle-outline' : 'mdi-arrow-up-bold-circle-outline'">
                        </v-icon>
                    </template>
                    <template #title>
                        <span class="font-weight-bold text-indigo">{{ item.displayName }}</span>
                    </template>
                    <template #subtitle>
                        <span class="text-subtitle-2 text-medium-emphasis">{{ item.orgNo }}</span>
                    </template>
                    <template #append>
                        <v-menu location="end">
                            <template v-slot:activator="{ props }">
                                <v-btn color="secondary" density="compact" variant="text" icon="mdi-menu" v-bind="props">
                                </v-btn>
                            </template>
                            <v-list density="compact" lines="one" nav>
                                <v-list-item @click="onView({ id: item.id, displayName: item.displayName })">
                                    <template #title>
                                        查看
                                    </template>
                                    <template #prepend>
                                        <v-icon color="success">mdi-view-dashboard</v-icon>
                                    </template>
                                </v-list-item>
                                <v-list-item @click="onEditRequest(item.id)"
                                    v-permission="'AbpIdentity.OrganizationUnit.Update'">
                                    <template #title>
                                        更新
                                    </template>
                                    <template #prepend>
                                        <v-icon color="primary">mdi-cog</v-icon>
                                    </template>
                                </v-list-item>
                                <v-list-item @click="oncCreateRequest(item.id)"
                                    v-permission="'AbpIdentity.OrganizationUnit.Create'">
                                    <template #title>
                                        子机构
                                    </template>
                                    <template #prepend>
                                        <v-icon color="secondary">mdi-plus</v-icon>
                                    </template>
                                </v-list-item>
                                <v-list-item @click="onDeleteRequest(item.id!)"
                                    v-permission="'AbpIdentity.OrganizationUnit.Delete'">
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
            <organizationUnitTree :tree="item.children">
            </organizationUnitTree>
        </v-list-group>
        <v-list-item v-else density="compact" :value="item.code">
            <template #title>
                <span class="font-weight-bold text-indigo">{{ item.displayName }}</span>
            </template>
            <template #subtitle>
                <span class="text-subtitle-2 text-medium-emphasis">{{ item.orgNo }}</span>
            </template>

            <template #append>
                <v-menu location="end">
                    <template v-slot:activator="{ props }">
                        <v-btn color="secondary" density="compact" variant="text" icon="mdi-menu" v-bind="props">
                        </v-btn>
                    </template>
                    <v-list density="compact" lines="one" nav>
                        <v-list-item @click="onView({ id: item.id, displayName: item.displayName })">
                            <template #title>
                                查看
                            </template>
                            <template #prepend>
                                <v-icon color="success">mdi-view-dashboard</v-icon>
                            </template>
                        </v-list-item>
                        <v-list-item @click="onEditRequest(item.id)"
                            v-permission="'AbpIdentity.OrganizationUnit.Update'">
                            <template #title>
                                更新
                            </template>
                            <template #prepend>
                                <v-icon color="primary">mdi-cog</v-icon>
                            </template>
                        </v-list-item>
                        <v-list-item @click="oncCreateRequest(item.id)"
                            v-permission="'AbpIdentity.OrganizationUnit.Create'">
                            <template #title>
                                子机构
                            </template>
                            <template #prepend>
                                <v-icon color="secondary">mdi-plus</v-icon>
                            </template>
                        </v-list-item>
                        <v-list-item @click="onDeleteRequest(item.id!)"
                            v-permission="'AbpIdentity.OrganizationUnit.Delete'">
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
</template>

<script setup lang="ts">
import { Tree } from '../hooks/organizationUnitList';
import { onCreateEventBusKey, onEditEventBusKey, onDeleteEventBusKey, onViewEventBusKey } from '../hooks';
defineProps({
    tree: {
        type: Array<Tree>,
        required: true
    }
});

const onCreatEventBus = useEventBus(onCreateEventBusKey);
const onDeleteEventBus = useEventBus(onDeleteEventBusKey);
const onEditEventBus = useEventBus(onEditEventBusKey);
const onViewEventBus = useEventBus(onViewEventBusKey);

const onView = (e: { id: string, displayName: string }) => {
    onViewEventBus.emit(e);
}

const onEditRequest = (id: string) => {
    onEditEventBus.emit(id);
}

const onDeleteRequest = (id: string) => {
    onDeleteEventBus.emit(id);
}

const oncCreateRequest = (parentId: string | undefined) => {
    onCreatEventBus.emit(parentId);
}
</script>

<script lang="ts">
defineComponent({
    name: 'organizationUnitTree',
})
</script>

<style scoped></style>