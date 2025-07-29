import { useUserStore } from '@/stores'
import { createRouter, createWebHistory } from 'vue-router'
// import { createRouter, createWebHashHistory } from 'vue-router'

// createRouter 创建路由实例
// 配置 history 模式
// 1. history模式：createWebHistory     地址栏不带 # http://xxx/user
// 2. hash模式：   createWebHashHistory 地址栏带 #  http://xxx/#/user   该模式下并带前缀'/jd'得到 http://localhost:5173/jd#/

// vite 的配置 import.meta.env.BASE_URL 是路由的基准地址，默认是 ’/‘, 就是 vite.config.js 中的 base 配置项
// https://cn.vite.dev/guide/env-and-mode.html
// console.log(import.meta.env.BASE_URL)
// 再 vite.config.js 中配置 base: '/', 会在域名后面加上该地址
// 如果将来你部署的域名路径是：http://xxx/my-path/user
// vite.config.js  添加配置  base: my-path，路由这就会加上 my-path 前缀了

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/login/LoginPage.vue') },
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/article/manage',
      children: [
        {
          path: '/article/manage',
          component: () => import('@/views/article/ArticleManage.vue')
        },
        {
          path: '/article/channel',
          component: () => import('@/views/article/ArticleChannel.vue')
        },
        {
          path: '/user/profile',
          component: () => import('@/views/user/UserProfile.vue')
        },
        {
          path: 'user/avatar',
          component: () => import('@/views/user/UserAvatar.vue')
        },
        {
          path: '/user/password',
          component: () => import('@/views/user/UserPassword.vue')
        }
      ]
    }
  ]
})

// 登录访问拦截 => 默认是直接放行的
// router.beforeEach((to, from) => {
//   // ...
//   // 返回 false 以取消导航
//   return false
// })
// 根据返回值决定，是放行还是拦截
// 返回值：
// 1. undefined / true  直接放行
// 2. false 拦回from的地址页面
// 3. 具体路径 或 路径对象  拦截到对应的地址
//    '/login'   { name: 'login' }
router.beforeEach((to) => {
  // 如果没有token, 且访问的是非登录页，拦截到登录，其他情况正常放行
  const userStore = useUserStore()
  if (!userStore.token && to.path !== '/login') return '/login'
})

export default router
