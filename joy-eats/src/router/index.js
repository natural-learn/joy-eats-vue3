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
          children: [
            {
              path: 'add',
              component: () => import('../views/employee/add.vue'),
              meta: {
                title: '悦享外卖-添加员工'
              }
            }
          ]
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
