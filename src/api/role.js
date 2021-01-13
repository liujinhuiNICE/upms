import request from '@/utils/request'

/** 添加角色 */
export function addRole(data) {
  return request({
    url: '/role/add',
    method: 'post',
    data
  })
}

/** 删除角色 */
export function roleDelete(data) {
  return request({
    url: '/role/delete',
    method: 'post',
    data
  })
}

/** 批量删除角色 */
export function batchDelete(data) {
  return request({
    url: '/role/batchDelete',
    method: 'post',
    data
  })
}

/** 获取角色列表 */
export function roleList(data) {
  return request({
    url: '/role/list',
    method: 'get',
    data
  })
}

/** 更新角色菜单 */
export function roleMenu(data) {
  return request({
    url: '/role/menu',
    method: 'post',
    data
  })
}

/** 分页查询角色信息 */
export function rolePage(params) {
  return request({
    url: '/role/page',
    method: 'get',
    params
  })
}

/** 修改角色 */
export function roleUpdate(data) {
  return request({
    url: '/role/update',
    method: 'post',
    data
  })
}

/** 根据角色id获取角色信息 */
export function roleId(params) {
  return request({
    url: '/role',
    method: 'get',
    params
  })
}
