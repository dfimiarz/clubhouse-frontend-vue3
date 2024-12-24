<template>
  <header>The app</header>
</template>

<script setup lang="ts">
import { onBeforeMount, onUnmounted, ref, onMounted, watchEffect } from 'vue'
import { checkConnection as APIConnCheck } from '@/services/apiconnector'
import { useOptionsStore } from './stores/options'

let connCheckerHandle: number = 0

const connChecking = ref(false)

const optionsStore = useOptionsStore()

function handleVisibilityChange() {
  if (document.hidden) {
    optionsStore.appActive = false
  } else {
    optionsStore.appActive = true
  }
}

function showApp() {
  //Hide the loader and show the app
  const loader = document.getElementById('loader')
  const appElement = document.getElementById('app')
  if (loader && appElement) {
    loader.classList.toggle('hide')
    appElement.classList.toggle('show')
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
      console.log('Connection check successful')
      optionsStore.connected = true
    })
    .catch((err) => {
      console.error('Connection check failed', err)
      optionsStore.connected = false
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
  if (optionsStore.appActive) {
    setupConnectionWatcher()
  } else {
    clearConnectionWatcher()
  }
})
</script>

<style scoped></style>
