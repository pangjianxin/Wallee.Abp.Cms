<template>
    <v-dialog :model-value="modelValue" :persistent="true" width="auto">
        <v-card>
            <v-card-title class="text-primary text-subtitle-1 font-weight-bold">
                你确定要离开吗？
            </v-card-title>
            <v-card-subtitle class="text-caption text-warning">
                表单尚未提交，离开后将丢失所有已填写的内容
            </v-card-subtitle>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn variant="text" icon="mdi-power" @click="onClose"></v-btn>
                <v-btn variant="text" icon="mdi-check" @click="onConfirm"></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    confirm: {
        type: Boolean,
        default: false
    }
})

const emits = defineEmits(["update:modelValue", "update:confirm"]);

const onClose = () => {
    emits("update:confirm", false);
    emits("update:modelValue", false);
}
const onConfirm = () => {
    emits("update:confirm", true);
    emits("update:modelValue", false);
}
</script>

<style scoped></style>