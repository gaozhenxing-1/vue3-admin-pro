import type { Directive, DirectiveBinding } from 'vue'
import { useUserStore } from '@/stores/user'

// v-permission: 传入角色数组，用户拥有任一角色即显示
export const vPermission: Directive<HTMLElement, string[]> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string[]>) {
    const userStore = useUserStore()
    const required = binding.value
    if (required && required.length > 0) {
      const has = required.some(r => userStore.roles.includes(r))
      if (!has) {
        el.parentNode?.removeChild(el)
      }
    }
  },
}
