import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useOptionsStore = defineStore('options', () => {
  const connected = ref(true)
  const appActive = ref(true)

  return { connected, appActive }
})
