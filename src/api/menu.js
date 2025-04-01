import { mockGetRouters } from '@/mock/menu'

// 获取路由
export function getRouters() {
  // 在实际项目中，取消注释下面的代码，使用真实接口
  // return request({
  //   url: '/api/getRouters',
  //   method: 'get'
  // })
  
  // 使用模拟数据
  return mockGetRouters()
} 