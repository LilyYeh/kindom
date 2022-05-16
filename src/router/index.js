import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/kingdom',
    name: 'Kingdom',
    component: () => import('../views/Kingdom.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
