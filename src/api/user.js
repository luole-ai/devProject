import { mockLogin, mockGetUserInfo, mockLogout } from '@/mock/user'

// 登录
export function login(data) {
  // return request({
  //   url: '/api/login',
  //   method: 'post',
  //   data
  // })
  return mockLogin(data)
}

// 获取用户信息
export function getInfo(token) {
  // return request({
  //   url: '/api/getUserInfo',
  //   method: 'get',
  //   params: { token }
  // })
  return mockGetUserInfo(token)
}

// 退出登录
export function logout() {
  // return request({
  //   url: '/api/logout',
  //   method: 'post'
  // })
  return mockLogout()
} 