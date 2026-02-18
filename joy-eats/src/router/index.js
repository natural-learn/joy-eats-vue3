import { createRouter, createWebHistory } from 'vue-router'
import Index from '../views/Index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   name: 'login',
    //   component: () => import('../views/LoginView.vue'),
    //   meta: {
    //     title: '员工登录'
    //   }
    // },
    {
      path: '/',
      name: 'home',
      component: Index,
      meta: {
        title: '悦享外卖-首页'
      },
      redirect: '/dashboard',
      children: [
        {
          path: 'employee',
          component: () => import('../views/employee/Index.vue'),
        },
        {
          path: 'category',
          component: () => import('../views/category/Index.vue')
        },
        {
          path: 'dish',
          component: () => import('../views/dish/Index.vue')
        },
        {
          path: 'setmeal',
          component: () => import('../views/setmeal/Index.vue')
        },
        {
          path: 'order',
          component: () => import('../views/order/Index.vue')
        },
        {
          path: 'statistics',
          component: () => import('../views/statistics/Index.vue')
        },
        {
          path: 'dashboard',
          component: () => import('../views/dashboard/Index.vue')
        }
      ]
    }
  ],
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  } else {
    document.title = '悦享外卖';
  }
  next();
})


export default router
