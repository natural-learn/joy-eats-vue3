import service from "@/utils/request";

const baseURL = 'admin/employee';

export const Login = (dto) => {
    return service({
        url: `${baseURL}/login`,
        method: 'post',
        data: dto
    })
}

/**
 * 分页查询
 * @param {*} pageNum 
 * @param {*} pageSize 
 * @returns 
 */
export const GetEmployeePageList = (pageNum, pageSize) => {
    return service({
        url: `${baseURL}/page?` + `page=${pageNum}&pageSize=${pageSize}`,
        method: 'get',
    })
}

