import request from '@/utils/request'

/** 分页查询通知列表 */
export function queryNotifyByPage(params) {
  return request({
    url: '/notify/page',
    method: 'get',
    params
  })
}

/** 新增通知 */
export function addNotify(data) {
  return request({
    url: '/notify/add',
    method: 'post',
    data
  })
}

/** 更新通知 */
export function updateNotify(data) {
  return request({
    url: '/notify/up',
    method: 'put',
    data
  })
}

/** 删除通知 */
export function delNotify(data) {
  return request({
    url: '/notify/del/' + data.id,
    method: 'delete'
  })
}

/** 批量删除通知 */
export function batchDelNotify(data) {
  return request({
    url: '/notify/batchDel',
    method: 'delete',
    data
  })
}

/** 获取我的通知 */
export function getMyNotify(data) {
  return request({
    url: '/notifyRecord/notifyRecordTip',
    method: 'get',
    data
  })
}
