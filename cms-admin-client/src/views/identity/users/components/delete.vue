<template>
    <v-dialog transition="dialog-bottom-transition" width="auto" :model-value="show" :persistent="true">
        <v-sheet class="d-flex align-center justify-center flex-wrap text-center mx-auto px-4" elevation="4" height="250"
            rounded max-width="800" width="100%">
            <div>
                <h2 class="text-h4 font-weight-black text-primary">请确认</h2>
                <p class="text-body-1 mb-2">
                    即将删除<span class="text-red">{{ user?.userName }}</span>
                </p>
                <p class="text-body-2 mb-4">
                    确认无误请点击删除按钮进行删除
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
import { IdentityUserDto, UserService } from '@/openapi';
import { PropType } from 'vue';
import { SubmitEventPromise } from 'vuetify';

const props = defineProps({
    show: {
        type: Boolean,
        required: true
    },
    user: {
        type: Object as PropType<IdentityUserDto>,
        required: false
    },
});

const emits = defineEmits(["update:show", "done"]);

const closeDialog = () => {
    emits("update:show", false);
}

const onDelete = async (e: SubmitEventPromise) => {
    e.preventDefault();
    await UserService.userDelete({ id: props.user?.id! });
    emits("done", props.user, "remove");
    emits("update:show", false);
}
</script>

<style scoped></style>
