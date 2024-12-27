//import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'

import App from './App.vue'
import router from './router'

import * as dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import localizedFormat from 'dayjs/plugin/localizedFormat'

//import { useSettingsStore } from './stores/settings'
import { useUserStore } from './stores/user'
//import { checkConnection } from './services/apiconnector'

import auth from './firebase'
import { onAuthStateChanged } from 'firebase/auth'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(localizedFormat)

const app = createApp(App)

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'dark',
  },
})

const pinia = createPinia()

app.config.globalProperties.$dayjs = dayjs

app.use(router)
app.use(pinia)
app.use(vuetify)

//const settingsStore = useSettingsStore()
const userStore = useUserStore()

//Subscribe to the auth store to know when the auth is initialized
const unsub = userStore.$subscribe((_mutation, state) => {
  //call startApp when the auth is initialized
  console.log('Subscribed to userStore', state.isAuthInitialized)
  if (state.isAuthInitialized) {
    startApp()
    unsub()
  }
})

const loader = document.getElementById('loader')
loader?.addEventListener('transitionend', handleLoaderFadoutTransition)

function startApp() {
  //Start transition to fadeout the loader
  console.log('startApp')
  loader?.classList.add('fadeout')
}

function handleLoaderFadoutTransition() {
  loader?.remove()
  //Add a div element to the body to mount the app
  const appContainer = document.createElement('div')
  document.body.insertBefore(appContainer, document.body.firstChild)
  app.mount(appContainer)
}

onAuthStateChanged(auth, (user) => {
  userStore.$patch({
    user: user?.email || null,
    isAuthInitialized: true,
  })
})
