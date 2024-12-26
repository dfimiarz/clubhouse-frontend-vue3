<template>
  <v-app>
    <v-app-bar app>
      <v-app-bar-nav-icon @click="showDrawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Knickerbocker Field Club</v-toolbar-title>
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
  </v-app>
</template>

<script setup lang="ts">
import { onBeforeMount, onUnmounted, ref, onMounted, watchEffect } from 'vue'
import { checkConnection as APIConnCheck } from '@/services/apiconnector'
import { useSettingsStore } from './stores/settings'

let connCheckerHandle: number = 0

const connChecking = ref(false)
const drawer = ref(false)

const settingsStore = useSettingsStore()

function showDrawer() {
  console.log('Showing drawer')
  drawer.value = true
}

function handleVisibilityChange() {
  if (document.hidden) {
    settingsStore.appActive = false
  } else {
    settingsStore.appActive = true
  }
}

function showApp() {
  //Hide the loader and show the app
  const loader = document.getElementById('loader')
  const appElement = document.getElementById('app')
  if (loader && appElement) {
    //Swap classes from show to hide
    loader.classList.replace('show', 'hide')
    appElement.classList.replace('hide', 'show')
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

function clearConnectionWatcher() {
  //console.log('Clearing connection watcher')
  if (connCheckerHandle > 0) clearInterval(connCheckerHandle)
}

function checkConnection(): void {
  // If already checking, return
  if (connChecking.value) return

  //console.log('Checking connection')
  connChecking.value = true
  APIConnCheck()
    .then(() => {
      //console.log('Connection check successful')
      settingsStore.connected = true
    })
    .catch((err) => {
      //console.error('Connection check failed', err)
      settingsStore.connected = false
    })
    .finally(() => {
      connChecking.value = false
    })
}

onMounted(() => {
  showApp()
})

onBeforeMount(() => {
  setupAppWatcher()
})

onUnmounted(() => {
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

<style scoped></style>
