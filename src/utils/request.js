import axios from 'axios'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
// 这里导入的是 Vue Router 的实例（通常是在 @/router/index.js 中通过 createRouter 创建的），可以直接调用 router.push() 等方法。
// useRouter 是 Vue 3 的 Composition API 写法，用于在 组件 (<script setup>) 或 setup() 函数 内访问路由。
// 但在 axios 拦截器 这样的 纯 JavaScript 模块 里，不能用 useRouter，因为它依赖 Vue 的组件上下文。
import router from '@/router'

const baseURL = 'http://big-event-vue-api-t.itheima.net'

// 利用 axios.create 创建一个自定义的 axios 来使用
const request = axios.create({
  // TODO 1. 基础地址，超时时间
  baseURL,
  timeout: 10000
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // TODO 2. 携带token
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = userStore.token
    }
    return config
  },
  (err) => Promise.reject(err)
)

// 响应拦截器
request.interceptors.response.use(
  (res) => {
    // 2xx 范围内的状态码都会触发该函数。

    // TODO 4. 摘取核心响应数据
    if (res.data.code === 0) {
      return res
    }
    // TODO 3. 处理业务失败
    // 处理业务失败, 给错误提示，抛出错误
    ElMessage.error(res.data.message || '服务异常')
    return Promise.reject(res.data)
  },
  (err) => {
    // 超出 2xx 范围的状态码都会触发该函数。

    // TODO 5. 处理401错误
    // 错误的特殊情况 => 401 权限不足 或 token 过期 => 拦截到登录
    if (err.response?.status === 401) {
      router.push('/login')
    }

    // 错误的默认情况 => 只要给提示
    ElMessage.error(err.response.data.message || '服务异常')
    return Promise.reject(err)
  }
)

export default request
export { baseURL }
