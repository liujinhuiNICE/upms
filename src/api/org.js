import request from '@/utils/request'

/** 添加组织 */
export function addOrg(data) {
  return request({
    url: '/org/add',
    method: 'post',
    data
  })
}

/** 删除组织 */
export function deleteOrg(data) {
  return request({
    url: '/org/delete',
    method: 'post',
    data
  })
}

/** 批量删除组织 */
export function batchDelete(data) {
  return request({
    url: '/org/batchDelete',
    method: 'post',
    data
  })
}

/** 根据组织名查询组织信息 */
export function detailsOrg(data) {
  return request({
    url: '/org/details',
    method: 'get',
    data
  })
}

/** 编辑组织 */
export function editOrg(data) {
  return request({
    url: '/org/edit',
    method: 'post',
    data
  })
}

/** 返回树形组织集合 */
export function treeOrg(params) {
  return request({
    url: '/org/tree',
    method: 'get',
    params
  })
}

/** 返回当前用户树形组织集合 */
export function userTree() {
  return request({
    url: '/org/user-tree',
    method: 'get'
  })
}

// 分页查询组织
export function orgPage(params) {
  return request({
    url: '/org/page',
    method: 'get',
    params
  })
}
