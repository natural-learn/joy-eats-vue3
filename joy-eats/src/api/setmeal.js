import service from "@/utils/request";

const baseURL = 'admin/setmeal';

/**
 * 分页查询套餐
 * @param {*} dto 
 * @returns 
 */
export const GetSetmealPageList = (dto) => {
    return service({
        url: `${baseURL}/page`,
        method: 'get',
        params: dto
    })
}

/**
 * 添加套餐
 * @param {*} dto 
 * @returns 
 */
export const AddSetmeal = (dto) => {
    return service({
        url: baseURL,
        method: 'post',
        data: dto
    })
}

/**
 * 修改套餐
 * @param {*} dto 
 */
export const UpdateSetmeal = (dto) => {
    return service({
        url: baseURL,
        method: 'put',
        data: dto
    })
}

/**
 * 根据Id删除套餐
 * @param {*} id 
 * @returns 
 */
export const DeleteById = (id) => {
    return service({
        url: baseURL,
        method: 'delete',
        params: { id }
    })
}