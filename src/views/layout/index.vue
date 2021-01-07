<template>
    <div class="wrapper" :class="{ closeBar: opened }">
        <el-container>
            <el-header>
                <TopMenu />
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <LeftMenu />
                </el-aside>
                <transition name="fade-page" mode="out-in">
                    <router-view />
                </transition>
            </el-container>
        </el-container>
    </div>
</template>

<script>

import LeftMenu from '@/components/mainframe/LeftMenu'
import TopMenu from '@/components/mainframe/TopMenu'
import { mapGetters } from 'vuex'

export default {
    name: 'TEMPLATE',
    components: {
        LeftMenu,
        TopMenu,
    },
    computed: {
        ...mapGetters(['opened']),
    },
}
</script>

<style scoped>
.fade-page-enter-active,
.fade-page-leave-active {
  transition: all 0.5s;
}
.fade-page-enter {
  opacity: 0;
  transform: translateX(30px);
}
.fade-page-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
