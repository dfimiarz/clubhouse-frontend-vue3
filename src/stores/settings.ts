import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', () => {
  const connected = ref(true)
  const appActive = ref(true)

  return { connected, appActive }
})
