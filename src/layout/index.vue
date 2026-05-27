<template>
  <div style="display: flex; height: 100vh" :class="isDark ? 'dark' : ''">
    <el-menu
      :default-active="activeMenu"
      :collapse="collapsed"
      background-color="var(--sidebar-bg-solid, #304156)"
      text-color="var(--sidebar-text, #bfcbd9)"
      active-text-color="var(--sidebar-active-text, #409eff)"
      style="border-right: none; flex-shrink: 0; overflow-y: auto"
      @select="handleSelect"
    >
      <div
        style="
          height: 50px;
          display: flex;
          align-items: center;
          padding: 0 16px;
          border-bottom: 1px solid var(--sidebar-border, rgba(255, 255, 255, 0.08));
          overflow: hidden;
        "
      >
        <img src="@/assets/logo.svg" style="width: 28px; height: 28px; flex-shrink: 0" />
        <span
          v-show="!collapsed"
          style="
            margin-left: 12px;
            color: var(--sidebar-logo-text, #fff);
            font-size: 16px;
            font-weight: 600;
            white-space: nowrap;
          "
          >Admin Pro</span
        >
      </div>
      <template v-for="r in menuRoutes" :key="r.path">
        <el-sub-menu v-if="r.children && r.children.length" :index="'/' + r.path">
          <template #title>
            <el-icon v-if="r.meta?.icon">
              <component :is="iconMap[r.meta.icon as string]" />
            </el-icon>
            <span>{{ t(r.meta?.title as string) }}</span>
          </template>
          <el-menu-item v-for="c in r.children" :key="c.path" :index="'/' + r.path + '/' + c.path">
            {{ t(c.meta?.title as string) }}
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item v-else :index="'/' + r.path">
          <el-icon v-if="r.meta?.icon"><component :is="iconMap[r.meta.icon as string]" /></el-icon>
          <template #title>{{ t(r.meta?.title as string) }}</template>
        </el-menu-item>
      </template>
    </el-menu>

    <div style="flex: 1; display: flex; flex-direction: column; overflow: hidden">
      <div
        style="
          height: 50px;
          background: var(--navbar-bg, #fff);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
          flex-shrink: 0;
        "
      >
        <div style="display: flex; align-items: center; gap: 12px">
          <el-icon style="font-size: 20px; cursor: pointer" @click="collapsed = !collapsed">
            <Fold v-if="!collapsed" /><Expand v-else />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path" :to="item.path">
              {{ t(item.title) }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div>
          <el-dropdown trigger="click" :hide-on-click="false">
            <span
              style="
                display: flex;
                align-items: center;
                gap: 6px;
                cursor: pointer;
                color: var(--text-regular, #606266);
                font-size: 14px;
              "
            >
              <el-icon><UserFilled /></el-icon> 管理员 <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu style="width: 260px; padding: 8px 0">
                <div style="padding: 8px 16px 4px">
                  <div
                    style="
                      font-size: 12px;
                      color: var(--text-secondary, #909399);
                      margin-bottom: 8px;
                    "
                  >
                    {{ lang === 'zh-cn' ? '主题色' : 'Theme Color' }}
                  </div>
                  <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px">
                    <div
                      v-for="c in themes"
                      :key="c.primary"
                      :style="{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: c.primary,
                        cursor: 'pointer',
                        border:
                          currentTheme === c.primary
                            ? '3px solid var(--text-primary)'
                            : '2px solid transparent',
                        margin: '0 auto',
                      }"
                      :title="lang === 'zh-cn' ? c.nameCN : c.name"
                      @click="switchTheme(c.primary)"
                    />
                  </div>
                </div>

                <div style="padding: 4px 16px 8px">
                  <div
                    style="
                      font-size: 12px;
                      color: var(--text-secondary, #909399);
                      margin-bottom: 8px;
                    "
                  >
                    {{ lang === 'zh-cn' ? '视觉风格' : 'Visual Style' }}
                  </div>
                  <div style="display: flex; gap: 8px">
                    <el-button
                      v-for="s in styleModes"
                      :key="s.key"
                      :type="currentStyle === s.key ? 'primary' : 'default'"
                      size="small"
                      style="flex: 1; font-size: 12px"
                      @click="switchStyle(s.key)"
                    >
                      {{ s.icon }} {{ lang === 'zh-cn' ? s.nameCN : s.name }}
                    </el-button>
                  </div>
                </div>
                <el-divider style="margin: 8px 0" />

                <el-dropdown-item @click="toggleDark">
                  <div
                    style="
                      display: flex;
                      align-items: center;
                      justify-content: space-between;
                      width: 100%;
                    "
                  >
                    <span>{{
                      isDark
                        ? lang === 'zh-cn'
                          ? '浅色模式'
                          : 'Light Mode'
                        : lang === 'zh-cn'
                          ? '暗色模式'
                          : 'Dark Mode'
                    }}</span>
                    <el-icon :size="16"><Sunny v-if="isDark" /><Moon v-else /></el-icon>
                  </div>
                </el-dropdown-item>

                <el-dropdown-item @click="toggleLang">
                  <div
                    style="
                      display: flex;
                      align-items: center;
                      justify-content: space-between;
                      width: 100%;
                    "
                  >
                    <span>{{ lang === 'zh-cn' ? 'Switch to English' : '切换为中文' }}</span>
                    <span
                      style="font-size: 12px; font-weight: 700; color: var(--el-color-primary)"
                      >{{ lang === 'zh-cn' ? 'EN' : '中' }}</span
                    >
                  </div>
                </el-dropdown-item>

                <el-divider style="margin: 8px 0" />

                <el-dropdown-item @click="router.push('/profile')">
                  <el-icon><UserFilled /></el-icon> {{ t('profile') }}
                </el-dropdown-item>

                <el-dropdown-item divided @click="handleLogout">
                  <el-icon><SwitchButton /></el-icon> {{ t('logout') }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>

      <div
        v-if="visitedTags.length > 0"
        style="
          display: flex;
          align-items: center;
          height: 36px;
          background: var(--navbar-bg, #fff);
          border-top: 1px solid var(--border-light, #ebeef5);
          padding: 0 8px;
          flex-shrink: 0;
          gap: 2px;
          overflow: hidden;
        "
      >
        <a
          href="https://gao892947907.lemonsqueezy.com/checkout/buy/7af63e8e-bb13-4946-bf49-0a080797fc19"
          target="_blank"
          style="
            display: flex;
            align-items: center;
            justify-content: center;
            height: 32px;
            background: linear-gradient(135deg, #409eff, #7c3aed);
            color: #fff;
            text-decoration: none;
            font-size: 12px;
            font-weight: 600;
            flex-shrink: 0;
            letter-spacing: 0.5px;
          "
        >
          🛒 Like this template? Buy Admin Pro for $49 — full source code, free updates →
        </a>
        <div
          v-for="tag in visitedTags"
          :key="tag.path"
          :style="{
            padding: '0 10px',
            height: '28px',
            fontSize: '12px',
            borderRadius: '4px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background:
              tag.path === route.path
                ? 'var(--el-color-primary-light-9)'
                : 'var(--fill-light,#f5f5f5)',
            color:
              tag.path === route.path ? 'var(--el-color-primary)' : 'var(--text-secondary,#909399)',
            border:
              '1px solid ' +
              (tag.path === route.path
                ? 'var(--el-color-primary-light-5)'
                : 'var(--border-light,#ebeef5)'),
          }"
          @click="router.push(tag.path)"
          @contextmenu.prevent
        >
          <span>{{ t(tag.title) }}</span>
          <span
            v-if="tag.path !== '/dashboard'"
            style="
              font-size: 10px;
              line-height: 1;
              border-radius: 50%;
              width: 14px;
              height: 14px;
              display: inline-flex;
              align-items: center;
              justify-content: center;
            "
            @click.stop="removeTag(tag.path)"
            >✕</span
          >
        </div>
        <span
          style="
            cursor: pointer;
            font-size: 12px;
            color: var(--text-secondary, #909399);
            margin-left: 4px;
            flex-shrink: 0;
          "
          @click="visitedTags = visitedTags.filter((t) => t.path === '/dashboard')"
          >✕</span
        >
      </div>

      <div style="flex: 1; padding: 16px; overflow-y: auto; background: var(--bg-main, #f0f2f5)">
        <router-view v-slot="{ Component, route: r }">
          <keep-alive :include="cachedNames">
            <component :is="Component" :key="r.fullPath" />
          </keep-alive>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  Fold,
  Expand,
  ArrowDown,
  UserFilled,
  Sunny,
  Moon,
  SwitchButton,
  Odometer,
  DataAnalysis,
  Grid,
  Document,
  User,
  Avatar,
  Tickets,
  Folder,
  Bell,
  Setting,
  EditPen,
  ChatDotSquare,
} from '@element-plus/icons-vue'
import { useI18n, currentLocale } from '@/locales'
import { useUserStore } from '@/stores'
import {
  themes,
  applyTheme,
  getSavedTheme,
  styleModes,
  applyStyle,
  getSavedStyle,
} from '@/utils/theme'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const collapsed = ref(false)
const isDark = ref(false)
const lang = ref(currentLocale.value)
const { t } = useI18n()
const visitedTags = ref<{ path: string; title: string }[]>([])
const cachedNames = ref<string[]>([])
const currentTheme = ref(getSavedTheme())
const currentStyle = ref(getSavedStyle())

const iconMap: Record<string, any> = {
  Odometer,
  DataAnalysis,
  Grid,
  Document,
  User,
  Avatar,
  Tickets,
  Folder,
  Bell,
  Setting,
  EditPen,
  ChatDotSquare,
}

const activeMenu = computed(() => route.path)

function filterByRole(routes: any[]): any[] {
  return routes.filter((r) => {
    if (r.meta?.hidden) return false
    const roles = r.meta?.roles as string[] | undefined
    if (roles && roles.length > 0) {
      if (!roles.some((role) => userStore.roles.includes(role))) return false
    }
    if (r.children) {
      r = { ...r, children: filterByRole(r.children) }
      if (r.children.length === 0) return false
    }
    return true
  })
}

const menuRoutes = computed(() => {
  const root = router.options.routes.find((r) => r.path === '/')
  return filterByRole(root?.children || [])
})

const breadcrumbs = computed(() => {
  return route.matched
    .filter((r) => r.meta?.title && !r.meta?.hidden)
    .map((r) => ({ path: r.path, title: r.meta?.title as string }))
})

function handleSelect(index: string) {
  router.push(index)
}
function switchTheme(primary: string) {
  currentTheme.value = primary
  applyTheme(primary)
}
function switchStyle(mode: 'tech' | 'minimal') {
  currentStyle.value = mode
  applyStyle(mode)
}
function toggleDark() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('darkMode', isDark.value ? 'true' : 'false')
}
function toggleLang() {
  const next = lang.value === 'zh-cn' ? 'en' : 'zh-cn'
  lang.value = next
  currentLocale.value = next
  localStorage.setItem('locale', next)
}
function handleLogout() {
  userStore.logout()
  router.push('/login')
}
function removeTag(path: string) {
  const idx = visitedTags.value.findIndex((t) => t.path === path)
  visitedTags.value.splice(idx, 1)
  if (path === route.path && visitedTags.value.length > 0)
    router.push(visitedTags.value[visitedTags.value.length - 1].path)
}

watch(
  () => route.path,
  () => {
    if (route.meta?.hidden) return
    const exists = visitedTags.value.find((t) => t.path === route.path)
    if (!exists)
      visitedTags.value.push({
        path: route.path,
        title: (route.meta?.title as string) || route.path,
      })
    if (route.meta?.keepAlive && !cachedNames.value.includes(route.name as string))
      cachedNames.value.push(route.name as string)
  },
  { immediate: true },
)
</script>
