import request from '@/utils/request'

/** 获取token */
export function getToken(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

/** 退出登录 */
export function logout(data) {
  return request({
    url: '/logout',
    method: 'post',
    data
  })
}

/** 获取登录信息 */
export function getLoginUserInfo() {
  return request({
    url: '/user/getLoginUserInfo',
    method: 'post'
  })
}

/** 修改密码 */
export function changePsw(data) {
  return request({
    url: '/user/changePsw',
    method: 'post',
    data
  })
}

/** 更换用户状态 */
export function switchStatus(data) {
  return request({
    url: '/user/switchStatus',
    method: 'post',
    data
  })
}

/** 删除用户信息 */
export function userDelete(data) {
  return request({
    url: '/user/delete',
    method: 'post',
    data
  })
}

/** 批量删除用户 */
export function batchDelete(data) {
  return request({
    url: '/user/batchDelete',
    method: 'post',
    data
  })
}

/** 分页查询用户列表 */
export function userList(params) {
  return request({
    url: '/user/list',
    method: 'get',
    params
  })
}

/** 添加用户 */
export function userSave(data) {
  return request({
    url: '/user/save',
    method: 'post',
    data
  })
}

/** 更新用户 */
export function userUpdate(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data
  })
}

/** 更新用户 */
export function logPage(params) {
  return request({
    url: '/log/page',
    method: 'get',
    params
  })
}
