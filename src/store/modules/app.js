/*
set sidebar open or close,and some app setting
 */
const state = {
    opened: sessionStorage.getItem('open')
        ? sessionStorage.getItem('open')
        : 'false',
    msgIsShow: false,
}
const mutations = {

    // eslint-disable-next-line no-shadow
    SET_OPENED(state, payload) {
        state.opened = String(payload)
        sessionStorage.setItem('open', payload)
    },

    // eslint-disable-next-line no-shadow
    SET_MSGISOPEN(state) {
        state.msgIsShow = !state.msgIsShow
    },
}
export default {
    namespaced: true,
    state,
    mutations,
}
