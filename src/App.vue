<template>
  <transition name="fade" mode="out-in">
    <v-app v-show="showApp">
      <v-app-bar app>
        <v-app-bar-nav-icon @click="showDrawer"></v-app-bar-nav-icon>
        <v-toolbar-title>{{ settingsStore.clubInfo?.name }}</v-toolbar-title>
      </v-app-bar>
      <v-navigation-drawer v-model="drawer" temporary> Test </v-navigation-drawer>

      <v-main>
        <v-container>
          <v-row>
            <v-col cols="12">
              <router-view />
            </v-col>
          </v-row>
        </v-container>
      </v-main>
      <v-overlay
        :model-value="settingsStore.isLoadingData"
        class="align-center justify-center"
        persistent
      >
        <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
      </v-overlay>
    </v-app>
  </transition>
</template>

<script setup lang="ts">
import { onBeforeMount, onUnmounted, ref, onMounted, watchEffect } from 'vue'
import { checkConnection as APIConnCheck } from '@/services/apiconnector'
import { useSettingsStore } from './stores/settings'
import { useUserStore } from './stores/user'
import { onAuthStateChanged } from 'firebase/auth'
import auth from '@/firebase'
import type firebase from 'firebase/compat/app'

let connCheckerHandle: number = 0
let unsubAuthListener: firebase.Unsubscribe | null = null

// Flag to prevent multiple connection checks
let connChecking = false
const drawer = ref(false)
const showApp = ref(false)

const settingsStore = useSettingsStore()
const userStore = useUserStore()

function showDrawer() {
  console.log('Showing drawer')
  drawer.value = true
}

function handleVisibilityChange() {
  console.debug('Visibility changed')
  if (document.hidden) {
    settingsStore.appActive = false
  } else {
    settingsStore.appActive = true
  }
}

function setupAppWatcher() {
  //console.log('Setting up app watcher')
  document.addEventListener('visibilitychange', handleVisibilityChange)
}

function setupConnectionWatcher() {
  //console.log('Setting up connection watcher')
  connCheckerHandle = setInterval(() => {
    checkConnection()
  }, 5000)
}

function setUpAuthListener() {
  //console.log('Setting up auth listener')
  unsubAuthListener = onAuthStateChanged(auth, (user) => {
    console.log('Auth state changed', user)
    userStore.$patch({
      user: user ? user.email : null,
    })
  })
}

function clearConnectionWatcher() {
  //console.log('Clearing connection watcher')
  if (connCheckerHandle > 0) clearInterval(connCheckerHandle)
}

function checkConnection(): void {
  console.debug('Checking connection')

  // If already checking, return
  if (connChecking) return

  //console.log('Checking connection')
  connChecking = true
  APIConnCheck()
    .then(() => {
      //console.log('Connection check successful')
      settingsStore.connected = true
    })
    .catch(() => {
      //console.error('Connection check failed', err)
      settingsStore.connected = false
    })
    .finally(() => {
      connChecking = false
    })
}

onMounted(() => {
  console.log('App mounted in side component')
  showApp.value = true
})

onBeforeMount(() => {
  setupAppWatcher()
  setUpAuthListener()
})

onUnmounted(() => {
  if (unsubAuthListener) {
    unsubAuthListener()
  }
  clearConnectionWatcher()
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})

watchEffect(() => {
  if (settingsStore.appActive) {
    setupConnectionWatcher()
  } else {
    clearConnectionWatcher()
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
