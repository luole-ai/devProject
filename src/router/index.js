import { createRouter, createWebHistory } from 'vue-router'
import { defineComponent, h } from 'vue'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth' // 验证token的方法
import store from '@/store' // Vuex存储
import { iframePages } from './iframePages'

const createIframeComponent = page => () =>
  import('@/views/iframe/IframePage.vue').then(module =>
    defineComponent({
      name: `Iframe_${page.key}`,
      setup(_, { attrs, slots }) {
        return () => h(module.default, attrs, slots)
      }
    })
  )

const iframeRoutes = iframePages.map(page => ({
  path: `iframe/${page.key}`,
  name: `Iframe_${page.key}`,
  component: createIframeComponent(page),
  meta: {
    title: page.title,
    keepAlive: true,
    keepAliveName: `Iframe_${page.key}`,
    navKey: page.key,
    iframe: true,
    iframeUrl: page.url
  }
}))

// 静态路由 - 所有用户都可以访问的页面
export const constantRoutes = [
  {
    path: '/',
    redirect: '/layout/home',
    hidden: true
  },
  {
    path: '/data-visualization',
    component: () => import('@/views/data-visualization/index.vue'),
    meta: {
      title: '数据可视化',
      keepAlive: true,
      keepAliveName: 'DataVisualization',
      navKey: 'data-visualization'
    }
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    hidden: true
  },
  {
    path: '/layout',
    component: () => import('@/views/content/index.vue'),
    redirect: '/layout/home',
    children: [
      {
        path: 'home',
        name: 'LayoutHome',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页',
          keepAlive: true,
          keepAliveName: 'LayoutHome',
          navKey: 'home'
        }
      },
      {
        path: 'reports',
        name: 'LayoutReports',
        component: () => import('@/views/reports/index.vue'),
        meta: {
          title: '报表中心',
          keepAlive: true,
          keepAliveName: 'LayoutReports',
          navKey: 'reports'
        }
      },
      {
        path: 'workspace',
        name: 'LayoutWorkspace',
        component: () => import('@/views/workspace/index.vue'),
        meta: {
          title: '工作台',
          keepAlive: true,
          keepAliveName: 'LayoutWorkspace',
          navKey: 'workspace'
        }
      },
      {
        path: 'shift-handover',
        name: 'ShiftHandover',
        component: () => import('@/views/shift-handover/index.vue'),
        meta: {
          title: '班次交接',
          keepAlive: true,
          keepAliveName: 'ShiftHandover',
          navKey: 'shift-handover'
        }
      },
      {
        path: 'dataJson',
        name: 'dataJson',
        component: () => import('@/views/dataJson.vue'),
        meta: {
          title: '数据JSON',
          keepAlive: true,
          keepAliveName: 'dataJson',
          navKey: 'dataJson'
        }
      },
      {
        path: 'task-publish',
        name: 'TaskPublish',
        component: () => import('@/views/task-management/TaskPublish.vue'),
        meta: {
          title: '任务发布',
          keepAlive: true,
          keepAliveName: 'TaskPublish',
          navKey: 'task-publish'
        }
      },
      {
        path: 'task-execution',
        name: 'TaskExecution',
        component: () => import('@/views/task-management/TaskExecution.vue'),
        meta: {
          title: '任务执行',
          keepAlive: true,
          keepAliveName: 'TaskExecution',
          navKey: 'task-execution'
        }
      },
      ...iframeRoutes
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    hidden: true
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    hidden: true
  }
]

// 创建路由
const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
  scrollBehavior: () => ({ top: 0 })
})

// // 白名单
// const whiteList = ['/login', '/404']

// // 路由守卫
// router.beforeEach(async(to, from, next) => {
//   NProgress.start()
  
//   const hasToken = getToken()
  
//   if (hasToken) {
//     if (to.path === '/login') {
//       // 如果已登录，重定向到首页
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       // 判断用户是否已获取权限路由
//       const hasRoles = store.getters.roles && store.getters.roles.length > 0
//       if (hasRoles) {
//         next()
//       } else {
//         try {
//           // 获取用户信息（包含权限）
//           const { roles } = await store.dispatch('user/getInfo')
          
//           // 根据权限生成可访问路由
//           const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          
//           // 动态添加路由
//           accessRoutes.forEach(route => {
//             router.addRoute(route)
//           })
          
//           // 设置replace: true，不会在历史记录中留下重定向记录
//           next({ ...to, replace: true })
//         } catch (error) {
//           // 移除token并转到登录页
//           await store.dispatch('user/resetToken')
//           ElMessage.error(error || '认证失败，请重新登录')
//           next(`/login?redirect=${to.path}`)
//           NProgress.done()
//         }
//       }
//     }
//   } else {
//     // 未登录
//     if (whiteList.indexOf(to.path) !== -1) {
//       // 免登录白名单
//       next()
//     } else {
//       // 重定向到登录页
//       next(`/login?redirect=${to.path}`)
//       NProgress.done()
//     }
//   }
// })

// router.afterEach(() => {
//   NProgress.done()
// })

export default router