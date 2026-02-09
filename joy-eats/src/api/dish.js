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


