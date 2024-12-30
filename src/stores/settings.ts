import { ref, shallowRef } from 'vue'
import { defineStore } from 'pinia'

import type { ClubInfo } from '../types'

export const useSettingsStore = defineStore('settings', () => {
  const connected = ref(true)
  const appActive = ref(true)
  const clubInfo = shallowRef<ClubInfo | null>(null)

  return { connected, appActive, clubInfo }
})
