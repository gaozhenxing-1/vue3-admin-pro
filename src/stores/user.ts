import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface UserInfo {
  id: number
  username: string
  nickname: string
  avatar: string
  email: string
  roles: string[]
  tokenExp?: number
}

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')

  const savedInfo = localStorage.getItem('userInfo')
  const userInfo = ref<UserInfo | null>(savedInfo ? JSON.parse(savedInfo) : null)

  const isLoggedIn = computed(() => {
    if (!token.value || !userInfo.value) return false
    // 检查 token 是否过期
    if (userInfo.value.tokenExp && Date.now() > userInfo.value.tokenExp) {
      return false
    }
    return true
  })

  const roles = computed(() => userInfo.value?.roles || [])

  function login(tk: string, info: UserInfo) {
    token.value = tk
    userInfo.value = info
    localStorage.setItem('token', tk)
    localStorage.setItem('userInfo', JSON.stringify(info))
  }

  function logout() {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }

  // 模拟刷新 token（延长2小时）
  function refreshToken(): boolean {
    if (!token.value || !userInfo.value) return false
    userInfo.value.tokenExp = Date.now() + 7200 * 1000
    localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
    return true
  }

  function hasRole(role: string): boolean {
    return roles.value.includes(role)
  }

  return { token, userInfo, isLoggedIn, roles, login, logout, refreshToken, hasRole }
})
