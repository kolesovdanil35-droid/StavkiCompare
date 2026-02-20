import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: ()=> import('../views/MainPage.vue')
    },
    {
      path: '/news',
      name: 'news',
      component: () => import('../views/NewsPage.vue')
    },
    // Добавляем fallback route для GitHub Pages
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

export default router