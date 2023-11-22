<template>
    <v-form ref="formRef" v-model="valid" @submit.prevent="handleSubmit">
        <v-card class="ma-0 pa-0">
            <template #text>
                <v-text-field label="用户名" placeholder="用户名一般是你的员工号" autocomplete="off" v-model="form.username"
                    :rules="rules.username" density="compact" variant="outlined" append-inner-icon="mdi-mail">
                </v-text-field>
                <v-text-field type="password" placeholder="密码" autocomplete="off" label="密码" variant="outlined"
                    density="compact" v-model="form.password" :rules="rules.password" append-inner-icon="mdi-lock"
                    class="mt-5">
                </v-text-field>
            </template>
            <template #actions>
                <v-spacer />
                <v-btn color="secondary" append-icon="mdi-arrow-right" type="submit">
                    登录
                </v-btn>
                <v-btn color="warning" append-icon="mdi-circle-edit-outline" @click="formRef.reset()" class="ml-2">
                    重置
                </v-btn>
            </template>
        </v-card>
    </v-form>
</template>

<script setup lang="ts">
import { usePasswordLogin } from '../hooks/passwordLogin';
import { SubmitEventPromise } from 'vuetify';
import { useGlobalStore } from '@/store/globalStore';

const emits = defineEmits(["done"]);
const formRef = ref();
const globalStore = useGlobalStore();
const { valid, form, rules, login } = usePasswordLogin();
const handleSubmit = async (e: SubmitEventPromise) => {
    let res = await e;
    if (res.valid === true) {
        try {
            globalStore.setLoading(true);
            const tokenRes = await login(form);
            emits("done", tokenRes);
        } finally {
            globalStore.setLoading(false);
        }
    }
}
</script>

<style scoped></style>