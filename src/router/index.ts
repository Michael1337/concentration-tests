import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/ctweber',
      name: 'ctweber',
      component: () => import('../views/CTWeberView.vue')
    },
    {
      path: '/simplemaths',
      name: 'simplemaths',
      component: () => import('../views/SimpleMathsView.vue')
    },
    {
      path: '/wordsbackwards',
      name: 'wordsbackwards',
      component: () => import('../views/WordsBackwardsView.vue')
    }
  ]
})

export default router
