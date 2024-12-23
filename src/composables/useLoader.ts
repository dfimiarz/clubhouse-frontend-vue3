import { onMounted } from 'vue'

export function useLoader() {
  onMounted(() => {
    const loader = document.getElementById('loader')
    const appElement = document.getElementById('app')
    if (loader && appElement) {
      loader.classList.toggle('hide')
      appElement.classList.toggle('show')
    }
  })
}
