import { getLoginUserInfo,logout } from '@/api/user'
import Cookie from '../../utils/cookie'

const state = {
    token: Cookie.get('token') ? Cookie.get('token') : '', // 认证凭证'
    username: '',
    userId: '',
    roles: '',
    userInfo: '',
}
const mutations = {
    SET_TOKEN(state, val) {
        state.token = val
        Cookie.set('token', val)
    },
    DEL_TOKEN(state) {
        state.token = ''
        state.userInfo = ''
        Cookie.delete('token')
    },
    SET_ROLES(state, payload) {
        state.roles = payload
        Cookie.set('roles', JSON.stringify(payload))
    },
    SET_INTRODUCE(state, payload) {
        state.introduce = payload
    },
    SET_USER_INFO: (state, value) => {
        state.userInfo = value
        state.username = value.user.username
        state.userId = value.user.userId
    },
}
const actions = {
    getUserInfo({ commit }) {
        getLoginUserInfo().then((res) => {
            if (res.success) {
                commit('SET_USER_INFO', res.data)
            }
        })
        // .catch((res) => {
        //     if (String(res).indexOf('401') !== -1) {
        //         commit('DEL_TOKEN')
        //         router.push({ path: '/login' })
        //     }
        // })
    },
    // user login
    //  设置 token
    setToken({ commit }, token) {
        commit('SET_TOKEN', token)
    },
    delToken({ commit }) {
        commit('DEL_TOKEN')
    },
    setName({ commit }, value) {
        commit('SET_NAME', value)
    },
    setRole({ commit }, value) {
        commit('SET_ROLES', value)
    },
}
export default {
    namespaced: true,
    state,
    mutations,
    actions,
}
