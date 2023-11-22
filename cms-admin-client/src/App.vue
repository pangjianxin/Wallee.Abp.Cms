<template>
  <v-app :theme="theme">
    <router-view>
    </router-view>
  </v-app>
</template>
<script setup lang="ts">
import { useThemeStore } from '@/store/themeStore';

const { theme } = storeToRefs(useThemeStore());


</script>
<style scoped lang="scss"></style>