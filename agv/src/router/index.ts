import { createRouter, createWebHistory } from 'vue-router'
import FactoryMap from '@/components/FactoryMap.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'factory-map',
      component: FactoryMap
    }
  ],
})

export default router
