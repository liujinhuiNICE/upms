import request from '@/utils/request'
/** 查询系统信息 */
export function querySysInfo() {
  return request({
    url: '/monitor/systemInfo',
    method: 'get'
  })
}
