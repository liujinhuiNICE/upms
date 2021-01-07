<template>
    <div>
        <el-menu
            :default-active="this.$route.path"
            active-text-color="#409eff"
            background-color="#3a3f51"
            class="el-menu-vertical-demo"
            text-color="#FBFBFB"
            width="200px"
            :collapse="opened"
            :collapse-transition="false"
            router
            @close="handleClose"
            @open="handleOpen">
            <el-menu-item index="/dashboard"><i class="el-icon-s-home" /><span slot="title">首页</span></el-menu-item>
            <menuItem v-for="(item,index) in routes" :key="index" :routers="item" />
        </el-menu>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import menuItem from '@/components/menuItem'

export default {
    name: 'LeftMenu',
    components: {
        menuItem,
    },
    data() {
        return {
            routes: [],
        }
    },
    computed: {
        ...mapGetters(['opened']),
    },
    mounted() {
        this.routes = this.$router.options.routes
        this.routes = this.routes.filter((item) => !item.hidden && item.path !== '/')
    },
    methods: {
        handleOpen(key, keyPath) {
            console.log(key, keyPath)
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath)
        },
    },
}
</script>

<style scoped>
    .el-submenu__title::v-deep {
        width: 200px;
    }

    .el-menu-item-group__title::v-deep {
        width: 200px;
    }
</style>
