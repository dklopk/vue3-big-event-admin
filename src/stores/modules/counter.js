import { ref } from 'vue'
import { defineStore } from 'pinia'

// 数字计数器模块
export const useCounterStore = defineStore('big-count', () => {
  const count = ref(100)
  const add = (newValue) => {
    count.value += newValue
  }
  return {
    count,
    add
  }
})
