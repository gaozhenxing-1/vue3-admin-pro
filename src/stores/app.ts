import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { currentLocale } from '@/locales'

export type Locale = 'zh-cn' | 'en'

export const useAppStore = defineStore('app', () => {
  const sidebarCollapsed = ref(false)
  const darkMode = ref(false)
  const fullscreen = ref(false)
  const locale = ref<Locale>((localStorage.getItem('locale') as Locale) || currentLocale.value)

  const themeClass = computed(() => (darkMode.value ? 'dark' : ''))

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  function toggleDarkMode() {
    darkMode.value = !darkMode.value
    document.documentElement.classList.toggle('dark', darkMode.value)
    localStorage.setItem('darkMode', darkMode.value ? 'true' : 'false')
  }

  function setLocale(loc: Locale) {
    locale.value = loc
    currentLocale.value = loc
    localStorage.setItem('locale', loc)
  }

  function toggleLocale() {
    setLocale(locale.value === 'zh-cn' ? 'en' : 'zh-cn')
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      fullscreen.value = true
    } else {
      document.exitFullscreen()
      fullscreen.value = false
    }
  }

  const savedDark = localStorage.getItem('darkMode')
  if (savedDark === 'true') {
    darkMode.value = true
    document.documentElement.classList.add('dark')
  }

  return {
    sidebarCollapsed,
    darkMode,
    fullscreen,
    locale,
    themeClass,
    toggleSidebar,
    toggleDarkMode,
    setLocale,
    toggleLocale,
    toggleFullscreen,
  }
})
