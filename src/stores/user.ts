import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const user = ref<string | null>(null)
  const role = ref<string | null>(null)
  const geoauth = ref<boolean | null>(null)
  const isAuthInitialized = ref(false)

  return { user, role, geoauth, isAuthInitialized }
})
