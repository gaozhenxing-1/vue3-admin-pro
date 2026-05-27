import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'

export interface TagItem {
  path: string
  title: string
  query?: Record<string, any>
}

export const useTagsStore = defineStore('tags', () => {
  const visitedTags = ref<TagItem[]>([])
  const cachedRoutes = ref<string[]>([])

  function addTag(route: RouteLocationNormalized) {
    const title = (route.meta?.title as string) || (route.name as string) || route.path
    const exists = visitedTags.value.find((t) => t.path === route.path)
    if (!exists) {
      visitedTags.value.push({ path: route.path, title, query: route.query as Record<string, any> })
    }
    if (route.meta?.keepAlive && !cachedRoutes.value.includes(route.name as string)) {
      cachedRoutes.value.push(route.name as string)
    }
  }

  function removeTag(path: string) {
    const idx = visitedTags.value.findIndex((t) => t.path === path)
    visitedTags.value.splice(idx, 1)
  }

  function removeOtherTags(path: string) {
    visitedTags.value = visitedTags.value.filter((t) => t.path === path || t.path === '/dashboard')
  }

  function removeAllTags() {
    visitedTags.value = visitedTags.value.filter((t) => t.path === '/dashboard')
  }

  function closeLeftTags(path: string) {
    const idx = visitedTags.value.findIndex((t) => t.path === path)
    visitedTags.value = visitedTags.value.slice(idx)
  }

  function closeRightTags(path: string) {
    const idx = visitedTags.value.findIndex((t) => t.path === path)
    visitedTags.value = visitedTags.value.slice(0, idx + 1)
  }

  return {
    visitedTags,
    cachedRoutes,
    addTag,
    removeTag,
    removeOtherTags,
    removeAllTags,
    closeLeftTags,
    closeRightTags,
  }
})
