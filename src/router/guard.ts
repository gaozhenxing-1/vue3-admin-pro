import type { Router } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const whiteList = ['/login', '/register', '/forgot', '/404', '/403', '/landing', '/pricing', '/faq', '/contact']

export function setupRouterGuard(router: Router) {
  router.beforeEach((to, _from, next) => {
    const userStore = useUserStore()

    if (whiteList.includes(to.path)) {
      return next()
    }

    // 未登录
    if (!userStore.isLoggedIn) {
      // 区分：token过期 vs 从未登录
      if (userStore.token && userStore.userInfo) {
        ElMessage.warning('登录已过期，请重新登录')
      } else {
        ElMessage.warning('请先登录')
      }
      userStore.logout()
      return next({ path: '/login', query: { redirect: to.fullPath } })
    }

    // 自动续期 token（距过期不到30分钟时刷新）
    if (userStore.userInfo?.tokenExp) {
      const remaining = userStore.userInfo.tokenExp - Date.now()
      if (remaining > 0 && remaining < 30 * 60 * 1000) {
        userStore.refreshToken()
      }
    }

    // RBAC 权限检查
    const requiredRoles = to.meta?.roles as string[] | undefined
    if (requiredRoles && requiredRoles.length > 0) {
      const hasRole = requiredRoles.some(role => userStore.roles.includes(role))
      if (!hasRole) {
        ElMessage.error('无访问权限')
        return next('/403')
      }
    }

    next()
  })
}
