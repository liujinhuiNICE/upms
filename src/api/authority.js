import request from '@/utils/request'

/** 新增菜单 */
export function addMenu(data) {
    return request({
        url: '/menu/add',
        method: 'post',
        data,
    })
}

/** 删除菜单 */
export function delMenu(data) {
    return request({
        url: '/menu/del',
        method: 'post',
        data,
    })
}

/** 批量删除菜单 */
export function batchDel(data) {
    return request({
        url: '/menu/batchDel',
        method: 'post',
        data,
    })
}

/** 查询全部菜单树 */
export function treeAll(data) {
    return request({
        url: '/menu/treeAll',
        method: 'get',
        data,
    })
}

/** 更新菜单 */
export function menuUp(data) {
    return request({
        url: '/menu/update',
        method: 'post',
        data,
    })
}

/** 通过id查询菜单 */
export function menuId(data) {
    return request({
        url: '/menu',
        method: 'get',
        data,
    })
}

/** 分页查询菜单 */
export function menuPage(params) {
    return request({
        url: '/menu/page',
        method: 'get',
        params,
    })
}
