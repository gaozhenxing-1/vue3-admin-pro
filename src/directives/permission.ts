import type { Directive } from 'vue'
import { useUserStore } from '@/stores/user'

export const permission: Directive = {
  mounted(el, binding) {
    const userStore = useUserStore()
    const requiredRoles = binding.value as string[]

    if (requiredRoles && requiredRoles.length > 0) {
      const hasPermission = requiredRoles.some((role) => userStore.roles.includes(role))
      if (!hasPermission) {
        el.parentNode?.removeChild(el)
      }
    }
  },
}
