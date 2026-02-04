import service from "@/utils/request";

const baseURL = 'admin/employee';

export const Login = (dto) => {
    return service({
        url: `${baseURL}/login`,
        method: 'post',
        data: dto,
    })
}

/**
 * 分页查询
 * @param {*} pageNum 
 * @param {*} pageSize 
 * @returns 
 */
export const GetEmployeePageList = (dto) => {
    return service({
        url: `${baseURL}/page`,
        method: 'get',
        params: dto
    })
}

/**
 * 添加员工
 * @param {*} dto 
 * @returns 
 */
export const AddEmployee = (dto) => {
    return service({
        url: baseURL,
        method: 'post',
        data: dto
    })
}

/**
 * 编辑员工
 * @param {*} dto 
 * @returns 
 */
export const UpdateEmployee = (dto) => {
    return service({
        url: baseURL,
        method: 'put',
        data: dto
    })
}

/**
 * 根据id删除员工信息
 * @param {*} id 
 * @returns 
 */
export const DeleteEmployeeById = (id) => {
    return service({
        url: `${baseURL}/${id}`,
        method: 'delete',
    })
}

/**
 * 启用或禁用员工信息
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