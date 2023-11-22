<!-- <template>
    <v-data-table-server :items-per-page="pageable.pageSize" :items-length="pageable.total" :page="pageable.pageNum"
            :headers="headers" :items="list" item-value="id" @update:options="onPaginationOptionsChanged" items-per-page-text="每行页">
            <template #top>
                <v-toolbar color="secondary" rounded>
                    <v-toolbar-title v-if="!searchBarActivated">
                        用户列表
                    </v-toolbar-title>
                    <v-scale-transition>
                        <v-text-field v-if="searchBarActivated" placeholder="搜索...." variant="solo" density="compact"
                            hide-details append-inner-icon="mdi-power" v-model="filter"
                            @click:append-inner="toggleSearchBar" class="ml-1 w-100">
                        </v-text-field>
                    </v-scale-transition>
                    <v-spacer></v-spacer>
                    <v-btn variant="text" icon="mdi-feature-search" v-if="!searchBarActivated"
                        @click="searchBarActivated = !searchBarActivated">
                    </v-btn>
                    <v-btn variant="text" icon="mdi-account-plus" @click="onCreateDialogActivated">
                    </v-btn>
                </v-toolbar>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-menu location="end">
                    <template v-slot:activator="{ props }">
                        <v-btn color="primary" density="compact" v-bind="props">
                            <v-icon>mdi-menu</v-icon>
                        </v-btn>
                    </template>
                    <v-list density="compact" lines="one" nav>
                        <v-list-item @click="onEditDialogActived(item.id)">
                            <template #title>
                                更新
                            </template>
                            <template #prepend>
                                <v-icon color="primary">mdi-cog</v-icon>
                            </template>
                        </v-list-item>
                        <v-list-item @click="onPermissionDialogActived(item.id, item.userName)">
                            <template #title>
                                权限
                            </template>
                            <template #prepend>
                                <v-icon color="secondary">mdi-account-circle</v-icon>
                            </template>
                        </v-list-item>
                        <v-list-item @click="onDeleteDialogActivated(item.userName, item.id)">
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
            <template #no-data>
                <span>没有找到数据</span>
            </template>
            <template v-slot:bottom v-if="themeStore.mobile">
                <v-row no-gutters align="center" justify="space-between" class="ma-1">
                    <v-col cols="4">
                        <v-select v-model="pageable.pageSize" :items="pageSizeArray" variant="outlined" label="每页"
                            type="number" density="compact" hide-details>
                        </v-select>
                    </v-col>
                    <v-col cols="8">
                        <v-pagination v-model="pageable.pageNum" :length="pageCount" prev-icon="mdi-menu-left"
                            next-icon="mdi-menu-right">
                        </v-pagination>
                    </v-col>
                </v-row>
            </template>
        </v-data-table-server>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style> -->