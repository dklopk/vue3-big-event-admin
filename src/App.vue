<script setup>
// import { RouterLink, RouterView } from 'vue-router'
import IndexVue from '@/components/index.vue'
// import { useUserStore } from './stores/modules/user'
// import { useCounterStore } from './stores/modules/counter'
// 由 stores/index.js 统一导出，导入路径统一 `./stores`，而且仓库维护在 stores/modules 中
import { useUserStore, useCounterStore } from './stores'

// 在 Vue3 CompositionAPI 中
// 1. 获取路由对象 router  useRouter
//    const router = useRouter()
// 2. 获取路由参数 route   useRoute
//    const route = useRoute()
import { useRouter, useRoute } from 'vue-router'

const userStore = useUserStore()
const countStore = useCounterStore()

const router = useRouter()
const route = useRoute()
const goList = () => {
  router.push('/list')
  console.log(router, route)
}

// console.log(123)
</script>

<template>
  <div>
    <IndexVue></IndexVue>
    <hr />
    <router-view></router-view>
    <hr />

    我是App
    <hr />
    <!-- 直接使用 无需再导入 -->
    <!-- **彩蛋：**默认 components 下的文件也会被自动注册~ -->
    <test-demo></test-demo>
    <el-button type="primary" @click="$router.push('/home')">跳首页</el-button>
    <el-button type="success" @click="goList">跳列表页</el-button>
    <el-button type="info">Info</el-button>

    <p>{{ userStore.token }}</p>

    <el-button
      type="warning"
      @click="userStore.setToken('Bearer sidfhheiwhuvyweqrjh')"
      >登录</el-button
    >
    <el-button type="danger" @click="userStore.removeToken()">退出</el-button>

    <hr />
    {{ countStore.count }}
    <el-button @click="countStore.add(2)">加法2</el-button>
  </div>
</template>

<style scoped></style>
