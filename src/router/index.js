import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/views/layout'
import Home from '@/views/Home.vue'
import { Message } from 'element-ui'
import getTitle from '../utils/getTitle'
import store from '../store/index'

Vue.use(VueRouter)
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(to) {
    return VueRouterPush.call(this, to).catch((err) => err)
}

const routes = [
    {
        path: '/login',
        component: () => import('@/views/login'),
        hidden: true,
        name: 'login',
        meta: { title: '登录' },
    },
    {
        path: '/404',
        name: '404',
        component: () => import('@/views/404'),
        hidden: true,
    },
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        meta: { title: '首页', icon: 'el-icon-s-home' },
        children: [
            {
                path: '/dashboard',
                name: 'Dashboard',
                component: Home,
                meta: { title: '首页', icon: 'el-icon-s-home' },
            },
        ],
    },
]

const addRouter = [
    {
        path: '/system',
        name: 'system',
        component: Layout,
        redirect: '/system/org',
        meta: { title: '系统管理', icon: 'el-icon-setting' },
        children: [
            {
                path: 'org',
                name: 'org',
                component: () => import('@/views/system/org'),
                meta: { title: '组织管理', icon: 'el-icon-menu' },
            },
            {
                path: 'user',
                name: 'user',
                component: () => import('@/views/system/user'),
                meta: { title: '用户管理', icon: 'el-icon-s-check' },
            },
            {
                path: 'Role',
                name: 'Role',
                component: () => import('@/views/system/Role'),
                meta: { title: '角色管理', icon: 'el-icon-s-custom' },
            },
            {
                path: 'authority',
                name: 'authority',
                component: () => import('@/views/system/authority'),
                meta: { title: '权限管理', icon: 'el-icon-s-claim' },
            },
            {
                path: 'post',
                name: 'post',
                component: () => import('@/views/system/post'),
                meta: { title: '岗位管理', icon: 'el-icon-s-custom' },
            },
            {
                path: 'dict',
                name: 'dict',
                component: () => import('@/views/system/dict'),
                meta: { title: '字典管理', icon: 'el-icon-s-custom' },
            },
            {
                path: 'notice',
                name: 'notice',
                component: () => import('@/views/system/notice'),
                meta: { title: '通知管理', icon: 'el-icon-s-custom' },
            },
        ],
    },
    {
        path: '/log',
        name: 'log',
        component: Layout,
        redirect: '/log/loginLog',
        meta: { title: '日志管理', icon: 'el-icon-s-order' },
        children: [
            {
                path: 'loginLog',
                name: 'loginLog',
                component: () => import('@/views/log/loginLog'),
                meta: { title: '登录日志', icon: 'el-icon-s-order' },
            },
            {
                path: 'operateLog',
                name: 'operateLog',
                component: () => import('@/views/log/operateLog'),
                meta: { title: '操作日志', icon: 'el-icon-s-order' },
            },
            {
                path: 'errorLog',
                name: 'errorLog',
                component: () => import('@/views/log/errorLog'),
                meta: { title: '错误日志', icon: 'el-icon-s-order' },
            },
        ],
    },
    {
        path: '/document',
        name: 'document',
        component: Layout,
        redirect: '/document/swagger',
        meta: { title: '文档管理', icon: 'el-icon-s-cooperation' },
        children: [
            {
                path: 'swagger',
                name: 'swagger',
                component: () => import('@/views/document/swagger'),
                meta: { title: 'swagger文档', icon: 'el-icon-s-order' },
            },
            {
                path: 'frontEnd',
                name: 'frontEnd',
                component: () => import('@/views/document/frontEnd'),
                meta: { title: '前端技术文档', icon: 'el-icon-s-order' },
            },
            {
                path: 'backEnd',
                name: 'backEnd',
                component: () => import('@/views/document/backEnd'),
                meta: { title: '后端技术文档', icon: 'el-icon-s-order' },
            },
        ],
    },
    {
        path: '/monitor',
        name: 'monitor',
        component: Layout,
        redirect: '/monitor/druid',
        meta: { title: '监控管理', icon: 'el-icon-video-camera-solid' },
        children: [
            {
                path: 'druid',
                name: 'druid',
                component: () => import('@/views/monitor/druid'),
                meta: { title: 'sql监控', icon: 'el-icon-s-order' },
            },
            {
                path: 'monitoring',
                name: 'monitoring',
                component: () => import('@/views/monitor/monitoring'),
                meta: { title: '系统监控', icon: 'el-icon-s-order' },
            },
            {
                path: 'elk',
                name: 'elk',
                component: () => import('@/views/monitor/elk'),
                meta: { title: 'ELK', icon: 'el-icon-s-order' },
            },
        ],
    },
]

const router = new VueRouter({
    routes: [...routes, ...addRouter],
})

Vue.prototype.$message = Message

router.beforeEach((to, from, next) => {
    document.title = getTitle(to.meta.title)
    if (to.path === '/login') {
        next()
    } else {
        // const { token } = store.getters

        // if (!token || token === '') {
        //     // eslint-disable-next-line no-unused-expressions
        //     Message({
        //         message: '用户未登录',
        //         type: 'error',
        //     })
        //     setTimeout(() => {
        //         next('/login')
        //     }, 1000)
        // } else {
        //     if (to.matched.length === 0) { // 判断此跳转路由的来源路由是否存在，存在的情况跳转到来源路由，否则跳转到404页面
        //         next('/404')
        //     }
        //     if (store.getters.userInfo === '') {
        //         store.dispatch('user/getUserInfo')
        //     }
        //     next()
        // }
        // const auth = 'admin'
        // const asyncRouete = addRouter.filter((option, index) => option.meta.roles.includes(auth))
        // router.addRoutes(asyncRouete)
        // router.options.routes = [...routes, ...asyncRouete]
        next()
    }
})

export default router
