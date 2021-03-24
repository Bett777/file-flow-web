import request from '../request'

export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

export function getUserInfo(params) {
  return request({
    url: '/user/info',
    method: 'get',
    params
  })
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}
