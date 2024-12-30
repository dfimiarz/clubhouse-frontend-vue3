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

import { useSettingsStore } from './stores/settings'
import { useUserStore } from './stores/user'
import { getClubInfo } from './services/apiconnector'

import auth from './firebase'

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

const settingsStore = useSettingsStore()
const userStore = useUserStore()

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

// function loadClubInfo(): void{
//   return
// }

function setMessages(text: string, type: number): void {
  const errorMessageElement = document.getElementById('message_txt')

  //Remove all classes
  errorMessageElement?.setAttribute('class', '')

  //If type = 0 set class to message, else set class to error
  if (type === 0) {
    errorMessageElement?.classList.add('message_txt')
  } else {
    errorMessageElement?.classList.add('error_txt')
  }

  if (errorMessageElement) {
    errorMessageElement.textContent = text
  }
}

await auth
  .authStateReady()
  .then(() => {
    userStore.$patch({
      user: auth.currentUser?.email || null,
      isAuthInitialized: true,
    })
  })
  .then(getClubInfo)
  .then((clubInfo) => {
    settingsStore.$patch({
      clubInfo: clubInfo,
    })
    startApp()
  })
  .catch((err) => {
    //Set the spinner to display none
    setMessages(err, 1)
  })
