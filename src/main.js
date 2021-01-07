import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element'
import '@/assets/style/common.scss'

Vue.config.productionTip = false
if (process.env.NODE_ENV === 'development') {
    // require('./mock') // simulation data
}
Vue.prototype.$axios = axios

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount('#app')
