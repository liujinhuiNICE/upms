import request from '@/utils/request'

/** 删除字典 */
export function deleteById(data) {
  return request({
    url: '/dict/deleteById',
    method: 'POST',
    data
  })
}

/** 刷新字典缓存 */
export function flushCache(data) {
  return request({
    url: '/dict/flushCache',
    method: 'get',
    data
  })
}

/** 分页查询字典列表 */
export function queryDictByPage(params) {
  return request({
    url: '/dict/queryDictByPage',
    method: 'get',
    params
  })
}

/** 根据条件查询字典列表 */
export function queryDictList(data) {
  return request({
    url: '/dict/queryDictList',
    method: 'post',
    data
  })
}

/** 新增字典 */
export function saveDict(data) {
  return request({
    url: '/dict/save',
    method: 'post',
    data
  })
}

/** 修改字典 */
export function saveUpdate(data) {
  return request({
    url: '/dict/update',
    method: 'post',
    data
  })
}

/** 新增字典项信息 */
export function addDictItem(data) {
  return request({
    url: '/dict/addDictItem',
    method: 'post',
    data
  })
}

/** 修改字典项信息 */
export function updateDictItem(data) {
  return request({
    url: '/dict/updateDictItem',
    method: 'post',
    data
  })
}

/** 批量删除字典 */
export function batchDelete(data) {
  return request({
    url: '/dict/batchDelete',
    method: 'post',
    data
  })
}

/** 删除字典项信息 */
export function deleteDictItem(data) {
  return request({
    url: '/dict/deleteDictItem',
    method: 'post',
    data
  })
}

/** 分页查询字典项列表 */
export function pageDictItemByDictId(params) {
  return request({
    url: '/dict/pageDictItemByDictId',
    method: 'get',
    params
  })
}
