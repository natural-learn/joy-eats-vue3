import service from "@/utils/request";

const baseURL = 'admin/category';

/**
 * 分页查询
 * @param {*} dto 
 * @returns 
 */
export const GetCategoryPageList = (dto) => {
    return service({
        url: `${baseURL}/page`,
        method: 'get',
        params: dto
    })
}

/**
 * 新增分类
 * @param {*} dto 
 * @returns 
 */
export const AddCategory = (dto) => {
    return service({
        url: baseURL,
        method: 'post',
        data: dto
    })
}

/**
 * 修改分类
 * @param {*} dto 
 * @returns 
 */
export const UpdateCategory = (dto) => {
    return service({
        url: baseURL,
        method: 'put',
        data: dto
    })
}

/**
 * 启用或禁用分类
 * @param {*} status 
 * @param {*} id 
 * @returns 
 */
export const StartOrStop = (status, id) => {
    return service({
        url: `${baseURL}/status/${status}`,
        method: 'post',
        params: { id }
    })
}

/**
 * 删除分类
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