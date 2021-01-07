import request from '@/utils/request'

/** 查询组织下的岗位列表 */
export function listPostByOrgId(data) {
    return request({
        url: '/listPostByOrgId',
        method: 'get',
        data,
    })
}

/** 根据id删除岗位 */
export function delPost(data) {
    return request({
        url: '/post/del',
        method: 'post',
        data,
    })
}

/** 根据Id列表批量删除岗位 */
export function batchDel(data) {
    return request({
        url: '/post/batchDel',
        method: 'post',
        data,
    })
}


/** 新增岗位信息 */
export function savePost(data) {
    return request({
        url: '/post/save',
        method: 'post',
        data,
    })
}

/** 修改岗位信息 */
export function upPost(data) {
    return request({
        url: '/post/update',
        method: 'post',
        data,
    })
}

/** 分页查询岗位 */
export function pagePost(params) {
    return request({
        url: '/post/page',
        method: 'get',
        params,
    })
}
