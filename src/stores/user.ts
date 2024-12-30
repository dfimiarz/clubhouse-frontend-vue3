import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const user = ref<string | null>(null)
  const role = ref<string | null>(null)
  const geoauth = ref<boolean | null>(null)
  const isAuthInitialized = ref(false)

  const isAuthenticated = computed(() => {
    return user.value !== null || geoauth.value === true
  })

  return { user, role, geoauth, isAuthInitialized, isAuthenticated }
})
