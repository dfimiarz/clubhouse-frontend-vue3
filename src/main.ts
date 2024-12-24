//import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import * as dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import localizedFormat from 'dayjs/plugin/localizedFormat'

import { useOptionsStore } from './stores/options'
import { checkConnection } from './services/apiconnector'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(localizedFormat)

const app = createApp(App)

const pinia = createPinia()

app.config.globalProperties.$dayjs = dayjs

app.use(router)
app.use(pinia)

const optionsStore = useOptionsStore()

checkConnection()
  .then(() => {
    optionsStore.connected = true
  })
  .catch(() => {
    optionsStore.connected = false
  })
  .finally(() => {
    app.mount('#app')
  })
