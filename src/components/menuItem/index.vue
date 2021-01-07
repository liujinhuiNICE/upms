<template>
    <!--这个表示有子菜单的情况下，才会显示-->
    <el-submenu v-if="routers.children && routers.children.length>0" :popper-append-to-body="false" :index="routers.path">
        <template slot="title">
            <i :class="routers.meta.icon" />
            <span slot="title">{{ routers.meta.title }}</span>
        </template>
        <!-- 注意这个表示判断子菜单下面是否还有三级和四级菜单 -->
        <template v-for="(routePath,index) in routers.children">
            <menuItem v-if="routePath.children && routePath.children.length>0" :key="index" :routers="routePath" />
            <el-menu-item v-else :key="index" :index="routers.path+'/'+routePath.path">
                <i :class="routePath.meta.icon" />
                <span slot="title">{{ routePath.meta.title }}</span>
            </el-menu-item>
        </template>
    </el-submenu>
    <!--表示一级菜单-->
    <el-menu-item v-else :index="routers.path">
        <i :class="routers.meta.icon" />
        <span slot="title">{{ routers.meta.title }}</span>
    </el-menu-item>
</template>

<script>
import menuItem from '@/components/menuItem'

export default {
    components: {
        menuItem,
    },
    props: {
        routers: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
        }
    },
    methods: {

    },
}
</script>
<style lang="scss" scoped>

</style>
