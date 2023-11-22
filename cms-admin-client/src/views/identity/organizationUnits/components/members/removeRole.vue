<template>
    <v-dialog transition="dialog-bottom-transition" width="auto" :model-value="show" :persistent="true">
        <v-sheet class="d-flex align-center justify-center flex-wrap text-center mx-auto px-4" elevation="4" height="250"
            rounded max-width="800" width="100%">
            <div>
                <h2 class="text-h4 font-weight-black text-primary">请确认</h2>
                <p class="text-body-1 mb-2">
                    即将从<span class="text-red">{{ org?.displayName }}删除角色{{ role?.name }}</span>
                </p>
                <p class="text-body-2 mb-4">
                    确认无误请点击删除按钮
                </p>
                <v-row justify="space-around" no-gutters>
                    <v-btn variant="outlined" color="warning" prepend-icon="mdi-power" @click="closeDialog">
                        取消
                    </v-btn>
                    <v-btn variant="outlined" color="primary" prepend-icon="mdi-delete" @click="onDelete">
                        确认
                    </v-btn>
                </v-row>
            </div>
        </v-sheet>
    </v-dialog>
</template>

<script setup lang="ts">
import { IdentityRoleDto, OrganizationUnitDto, OrganizationUnitService, RoleService } from '@/openapi';
import { SubmitEventPromise } from 'vuetify';
const org = ref<OrganizationUnitDto>();
const role = ref<IdentityRoleDto>();
const props = defineProps({
    show: {
        type: Boolean,
        required: true
    },
    orgId: {
        type: String,
        required: true
    },
    roleId: {
        type: String,
        required: true
    }
});


const emits = defineEmits(["update:show", "done"]);

const closeDialog = () => {
    emits("update:show", false);
}

const onDelete = async (e: SubmitEventPromise) => {
    e.preventDefault();
    await OrganizationUnitService.organizationUnitDeleteRole({ organizationUnitId: props.orgId, roleId: props.roleId });
    emits("done", true);
    emits("update:show", false);
}

watch(() => props.show, async (newVal) => {
    if (newVal) {
        org.value = await OrganizationUnitService.organizationUnitGet({ id: props.orgId });
        role.value = await RoleService.roleGet({ id: props.roleId });
    }
});
</script>

<style scoped></style>