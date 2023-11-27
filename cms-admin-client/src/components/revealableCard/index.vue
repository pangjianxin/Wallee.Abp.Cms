<template>
    <v-hover v-slot="{ isHovering, props }">
        <v-card class="mx-auto" v-bind="props">
            <v-expand-transition>
                <div v-if="isHovering" class="d-flex transition-fast-in-fast-out bg-secondary v-card--reveal text-h2"
                    style="height: 100%;">
                    <v-btn variant="outlined" color="white" prepend-icon="mdi-tab-search">{{ item % 2 === 0 ? '查看详情' :
                        '注册会员' }}</v-btn>
                </div>
            </v-expand-transition>
            <v-card-text>

                <div class="d-flex flex-row justify-space-between align-start w-100">
                    <div>
                        <div class="text-h6 font-weight-bold text-orange mb-2">
                            烧结钕铁硼
                        </div>
                        <div class="text-subtitle-1 font-weight-light mb-2">
                            ￥150-160/KG
                        </div>
                    </div>
                    <v-avatar size="80" rounded="0">
                        <v-img :src="productImg"></v-img>
                    </v-avatar>
                </div>

                <div class="d-flex flex-row justify-space-between align-center mb-2">
                    <div class="d-flex flex-column  align-center">
                        <span class="text-subtitle-2">N35</span>
                        <span class="text-caption text-primary font-weight-bold">牌号</span>
                    </div>
                    <div class="d-flex flex-column align-center">
                        <span class="text-subtitle-2">jHc≥955</span>
                        <span class="text-caption text-primary font-weight-bold">内禀矫顽力</span>
                    </div>
                    <div class="d-flex flex-column align-center">
                        <span class="text-subtitle-2">(BH)max263-280</span>
                        <span class="text-caption text-primary font-weight-bold">最大磁能积</span>
                    </div>
                </div>
                <v-divider></v-divider>
            </v-card-text>
        </v-card>
    </v-hover>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.v-card--reveal {
    align-items: center;
    bottom: 0;
    justify-content: center;
    opacity: .9;
    position: absolute;
    width: 100%;
    z-index: 999999;
}
</style>