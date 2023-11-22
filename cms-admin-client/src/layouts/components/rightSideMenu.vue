<template>
    <v-navigation-drawer location="end" rounded elevation="1" :rail="false" :permanent="false" :temporary="true"
        v-model="show" width="200px">
        <v-list nav>
            <v-list-item class="mx-1">
                <template #prepend>
                    <v-avatar :image="logo"></v-avatar>
                </template>
                <v-list-item-title class="title">{{ appName }}</v-list-item-title>
                <v-list-item-subtitle>{{ appEngName }}</v-list-item-subtitle>
            </v-list-item>
        </v-list>
        <v-card flat>
            <v-toolbar density="compact" rounded>
                <v-toolbar-title>
                    <span class="text-subtitle-1">企业信息</span>
                </v-toolbar-title>
            </v-toolbar>
            <v-list density="compact">
                <v-list-item>
                    <template #prepend>
                        <v-avatar size="small" color="green" icon="mdi-phone"></v-avatar>
                    </template>
                    <template #title>
                        <span class="font-weight-bold text-caption">联系电话</span>
                    </template>
                    <template #subtitle>
                        <span class="text-subtitle-2"> {{ contactPhone }}</span>
                    </template>
                    <template #append>
                        <v-btn variant="text" size="small" icon="mdi-clipboard-arrow-down-outline"
                            @click="onClip(contactPhone)">
                        </v-btn>
                    </template>
                </v-list-item>
                <v-list-item>
                    <template #prepend>
                        <v-avatar size="small" color="green" icon="mdi-email"></v-avatar>
                    </template>
                    <template #title>
                        <span class="font-weight-bold text-caption">电子邮件</span>
                    </template>
                    <template #subtitle>
                        <span class="text-subtitle-2"> {{ email }}</span>
                    </template>
                    <template #append>
                        <v-btn variant="text" size="small" icon="mdi-clipboard-arrow-down-outline"
                            @click="onClip(email)"></v-btn>
                    </template>
                </v-list-item>
            </v-list>
        </v-card>




    </v-navigation-drawer>
</template>
<script lang="ts" setup>
import { useGlobalStore } from '@/store/globalStore';
import logo from '@/assets/logo.png';
const appName = import.meta.env["VITE_APP_NAME"];
const appEngName = import.meta.env["VITE_APP_ENG_NAME"];
const contactPhone = import.meta.env["VITE_CONTACT_PHONE"];
const email = import.meta.env["VITE_EMAIL"];

const clipBoard = useClipboard();
const show = ref(false);

const toggleCollapse = () => {
    show.value = !show.value;

}

const onClip = async (val: string) => {
    await clipBoard.copy(val);
    useGlobalStore().setSnackbarText("复制成功");
}

defineExpose({
    toggleCollapse
});

</script>