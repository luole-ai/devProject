import { asyncRoutes, constantRoutes } from '@/router'
import { getRouters } from '@/api/menu'
import Layout from '@/layout/index'

// 动态生成路由方法
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.component === 'Layout') {
        tmp.component = Layout
      } else {
        const component = tmp.component
        tmp.component = resolveComponent(component)
      }

      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

// 检查权限
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

// 解析组件
export const resolveComponent = (component) => {
  if (component === 'Layout') {
    return Layout
  }
  return () => import(`@/views/${component}.vue`)
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  // 从服务器获取路由
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      // 从后端获取路由数据
      getRouters().then(res => {
        const accessedRoutes = filterAsyncRoutes(res.data, roles)
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
} 