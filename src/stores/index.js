// pinia 独立维护
// \- 现在：初始化代码在 main.js 中，仓库代码在 stores 中，代码分散职能不单一
// \- 优化：由 stores 统一维护，在 stores/index.js 中完成 pinia 初始化，交付 main.js 使用
import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(persist)

// 仓库 统一导出
// \- 现在：使用一个仓库 import { useUserStore } from `./stores/user.js` 不同仓库路径不一致
// \- 优化：由 stores/index.js 统一导出，导入路径统一 `./stores`，而且仓库维护在 stores/modules 中

export default pinia
export * from './modules/user'
export * from './modules/counter'
// 等价于
// import { useUserStore } from './modules/user'
// import { useCounterStore } from './modules/counter'
// export { useUserStore }
// export { useCounterStore }
