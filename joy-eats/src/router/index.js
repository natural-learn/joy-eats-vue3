import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

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
      component: HomeView,
      meta: {
        title: '悦享外卖-首页'
      },
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
