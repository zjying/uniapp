/**
 * @Name: axios的封装
 * @Description: axios的封装
 * @Author: 杨豫
 * @Date: 2021-05-11 10:31:15
**/
import axios from 'axios'
import qs from 'qs'
// 基础配置
const config = {
  baseURL: '//sea-api.sdbao.com',
  timeout: 10000
}

const CODE = {
  success: 0
}

// 创建实例
const axiosInstance = axios.create(config)

// 区分from & 序列化
axiosInstance.interceptors.request.use((config) => {
  const isForm = config.isForm || false
  const data = config.data || {}

  config.headers['Content-Type'] = 'application/json'

  if (data instanceof window.FormData) {
    return config
  }

  if (isForm) {
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    config.data = qs.stringify(data)
  } else {
    config.data = JSON.stringify(data)
  }

  return config
}, (error) => {
  return Promise.reject(error)
})

// 添加认证信息
axiosInstance.interceptors.request.use((config) => {
  // sea后台优先从localStorage获取登录信息
  const authInfo = {
		token: localStorage.getItem('token') || ''
	}

  // url add auth info
  config.params = config.params || {}

  Object.assign(config.params, authInfo)

  // body add auth info
  if (config.method === 'post') {
    config.data = config.data || {}

    Object.assign(config.data, authInfo)
  }

  return config
}, (error) => {
  return Promise.reject(error)
})

// 数据格式处理
axiosInstance.interceptors.response.use(response => {
  const responseCode = +response.data.code

  // 正常
  if (responseCode === CODE.success) {
    return response.data
  }

  return Promise.reject(response.data)
}, error => {
  return Promise.reject(error)
})

export default axiosInstance
