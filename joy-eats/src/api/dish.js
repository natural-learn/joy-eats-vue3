import service from "@/utils/request";

const baseURL = 'admin/dish';

/**
 * 分页获取菜品数据
 * @param {*} dto 
 * @returns 
 */
export const GetDishPageList = (dto) => {
    return service({
        url: `${baseURL}/page`,
        method: 'get',
        params: dto
    })
}

/**
 * 新增菜品
 * @param {*} dto 
 */
export const AddDish = (dto) => {
    return service({
        url: baseURL,
        method: 'post',
        data: dto
    })
}

/**
 * 修改菜品
 * @param {*} dto 
 */
export const UpdateDish = (dto) => {
    return service({
        url: baseURL,
        method: 'put',
        data: dto
    })
}

