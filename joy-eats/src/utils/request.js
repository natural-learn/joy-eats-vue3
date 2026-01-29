import axios from "axios";
import { ElMessage } from "element-plus";
import router from "@/router";
import { useApp } from "@/stores/app";

const service = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 5000, // 请求超时时间
  headers: { "Content-Type": "application/json;charset=utf-8" },
  withCredentials: true,
});

service.interceptors.request.use(config => {
  const { authorization } = useApp();
  if (authorization) {
    config.headers.token = `${authorization.token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
})

service.interceptors.response.use(response => {
    // 如果响应是二进制流，则直接返回（用于文件下载、Excel 导出等）
    if (response.config.responseType === 'blob') {
        return response;
    }
    return response.data;    
}, async error => {
  // 如果响应状态码是401，则请求获取新的token
  if (error.response && error.response.status === 401) {
    // 检验是否有 refresh_token
    const { authorization, clearToken, setToken } = useApp();
    if (!authorization || !authorization.refresh_token) {
        if (router.currentRoute.value.name === 'login') {
          return Promise.reject(error)
        }
        const redirect = encodeURIComponent(window.location.href)
        router.push(`/login?redirect=${redirect}`)
        // 清除token
        clearToken()
        setTimeout(() => {
          ElMessage.closeAll()
          try {
            ElMessage.error(error.response.data.msg)
          } catch (err) {
            ElMessage.error(error.message)
          }
        })
        // 代码不要往后执行了
        return Promise.reject(error)
      }

      // 如果有refresh_token，则请求获取新的 token
      try {
        const res = await axios({
          method: 'PUT',
          url: '/api/authorizations',
          timeout: 10000,
          headers: {
            Authorization: `Bearer ${authorization.refresh_token}`
          }
        })

        setToken({
          token: res.data.data.token, // 最新获取的可用token
          refresh_token: authorization.refresh_token, // 继续使用原来的refresh_token
        })
        return service(error.config)
      } catch (err) {
        const redirect = encodeURIComponent(window.location.href)
        router.push(`/login?redirect=${redirect}`);
        clearToken();
        return Promise.reject(error);
      }
    }
    ElMessage.closeAll();
    try {
      ElMessage.error(error.response.data.message);
    } catch (err) {
      ElMessage.error(error.message);
    }
    return Promise.reject(error);
})

export default service;