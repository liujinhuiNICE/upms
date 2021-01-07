import axios from 'axios'
import {
    Message,
} from 'element-ui'
import Cookie from './cookie'
import router from '../router'
import store from '../store/index'

function errorToast(code, message) {
    if (message) {
        return Message.error(message)
    }

    let codeMessage = ''
    switch (code) {
    case 400:
        codeMessage = '400:请求错误'
        break
    case 401:
        codeMessage = '401:token已过期请重新登录'
        store.dispatch('user/delToken', 'token')
        router.push({ path: '/login' })
        break
    case 403:
        codeMessage = '403:拒绝访问'
        break
    case 404:
        codeMessage = '404:请求地址出错'
        break
    case 405:
        codeMessage = '405:请求方式错误'
        break
    case 408:
        codeMessage = '408:请求超时'
        break
    case 501:
        codeMessage = '501:服务未实现'
        break
    case 502:
        codeMessage = '502:网关错误'
        break
    case 503:
        codeMessage = '503:服务不可用'
        break
    case 504:
        codeMessage = '504:网关超时'
        break
    case 505:
        codeMessage = '505:HTTP版本不受支持'
        break
    default:
        codeMessage = '系统繁忙,请稍后再试'
        break
    }

    return Message.error(codeMessage)
}

const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 10000,
})

service.interceptors.request.use((config) => {
    axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
    config.headers.Authorization = Cookie.get('token')
    if (config.params) {
        config.params = { ...config.params }
    }
    return config
})

service.interceptors.response.use(
    (response) => {
        if (response) {
            return Promise.resolve(response.data)
        }

        errorToast(response.data.code, response.data.message)
        return Promise.reject(response)
    },
    (error) => {
        if (error.response) {
            errorToast(error.response.status)
        } else {
            errorToast(500, '网关超时')
        }
        return Promise.reject(error)
    },
)

export default service
