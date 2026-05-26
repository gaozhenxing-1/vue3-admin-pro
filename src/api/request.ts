/**
 * Axios 请求封装
 * - 统一 baseURL
 * - 请求拦截器：自动附带 token
 * - 响应拦截器：统一错误处理
 * - Mock 模式：通过环境变量 VITE_USE_MOCK 切换
 */
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api'

const instance: AxiosInstance = axios.create({
  baseURL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// ─── 请求拦截器 ───
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ─── 响应拦截器 ───
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code, message, data } = response.data || {}
    if (code === 0 || code === 200) {
      return data
    }
    ElMessage.error(message || 'Request failed')
    return Promise.reject(new Error(message))
  },
  (error) => {
    if (error.response?.status === 401) {
      ElMessage.error('登录已过期，请重新登录')
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      window.location.href = '/login'
    } else {
      ElMessage.error(error.message || 'Network error')
    }
    return Promise.reject(error)
  },
)

export function get<T = any>(url: string, params?: Record<string, any>): Promise<T> {
  return instance.get(url, { params })
}

export function post<T = any>(url: string, data?: Record<string, any>): Promise<T> {
  return instance.post(url, data)
}

export function put<T = any>(url: string, data?: Record<string, any>): Promise<T> {
  return instance.put(url, data)
}

export function del<T = any>(url: string): Promise<T> {
  return instance.delete(url)
}

export default instance
