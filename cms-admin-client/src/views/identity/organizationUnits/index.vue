<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12" md="4">
                <organizationUnits></organizationUnits>
            </v-col>
            <v-col cols="12" md="8">
                <organizationUnitMembers>
                </organizationUnitMembers>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">

import organizationUnitMembers from '@/views/identity/organizationUnits/components/members/index.vue';
import organizationUnits from './components/organizationUnits.vue';

</script>

<style scoped></style>

<style lang="scss"></style>
<route lang="yaml">
name: identity.organization-unit.index
meta: 
  title: 组织机构
  desc: 身份认证管理
  visible: true
  visibleOnBottom: false
  auth: true
  icon: mdi-home-account
  permissions: 
    - AbpIdentity.OrganizationUnit
</route>