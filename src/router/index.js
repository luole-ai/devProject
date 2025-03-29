import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Camera from '../views/Camera.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: '首页' }
  },
  {
    path: '/camera',
    name: 'Camera',
    component: Camera,
    meta: { title: '相机' }
  }
  // 其他路由可以在需要时添加
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// 设置页面标题
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - 响应式应用` : '响应式应用'
  next()
})

export default router