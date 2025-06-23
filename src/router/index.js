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

export default router
