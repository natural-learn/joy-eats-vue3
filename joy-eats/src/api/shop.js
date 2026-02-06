import service from "@/utils/request";

const baseURL = 'admin/shop';

/**
 * 设置店铺的营业状态
 * @param {*} status 
 * @returns 
 */
export const SetShopStatus = (status) => {
    return service({
        url: `${baseURL}/${status}`,
        method: 'put'
    })
}

/**
 * 获取店铺的营业状态
 */
export const GetShopStatus = () => {
    return service({
        url: `${baseURL}/status`,
        method: 'get'
    })
}