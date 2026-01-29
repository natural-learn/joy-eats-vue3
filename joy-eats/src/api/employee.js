import service from "@/utils/request";

const baseURL = 'admin/employee';

export const Login = (dto) => {
    return service({
        url: `${baseURL}/login`,
        method: 'post',
        data: dto
    })
}

