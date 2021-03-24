import axois from 'axios'
import { Message } from 'element-ui'
import { getToken, removeToken } from './utils/cookie'
import domMessage from '@/utils/messageOnce'
// new 对象实例
// eslint-disable-next-line new-cap
const messageOnce = new domMessage()
// 创建axios实例
const service = axois.create({
  baseURL: 'http://localhost:18011', // api 的 base_url
  timeout: 120000 // 请求超时时间
})

// request拦截器设置
service.interceptors.request.use(
  config => {
    if (getToken()) {
      config.headers['Authorization'] = getToken() // 请求头设置自带 token
    }
    config.headers['Content-Type'] = 'application/json' // 请求的数据格式为 json
    return config
  },
  error => {
    console.log(error)
    Promise.reject(error)
  }
)

// response 拦截器设置
service.interceptors.response.use(
  response => {
    const data = response.data
    const code = data.code
    const message = data.message
    if (code === 10000 || code === undefined) {
      return data
    } else {
      Message({
        type: 'error',
        message
      })
      return Promise.reject('error')
    }
  },
  error => {
    const code = error.response.status
    if (code === 401) {
      messageOnce.error({
        message: '登陆信息已失效, 请重新登陆',
        duration: 2 * 1000,
        onClose: () => {
          removeToken()
          window.location.href = 'http://localhost:8000/#/login'
        }
      })
    } else {
      Message({
        type: 'error',
        message: '接口请求失败'
      })
    }
    return Promise.reject(error)
  }
)

export default service
