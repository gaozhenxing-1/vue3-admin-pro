// ============================================================
// 多主题配色系统 + 双视觉风格
// ============================================================

export interface ThemeColors {
  name: string
  nameCN: string
  primary: string
  light3: string
  light5: string
  light7: string
  light8: string
  light9: string
  dark2: string
}

function mix(hex: string, target: string, ratio: number): string {
  const r1 = parseInt(hex.slice(1, 3), 16)
  const g1 = parseInt(hex.slice(3, 5), 16)
  const b1 = parseInt(hex.slice(5, 7), 16)
  const r2 = parseInt(target.slice(1, 3), 16)
  const g2 = parseInt(target.slice(3, 5), 16)
  const b2 = parseInt(target.slice(5, 7), 16)
  const r = Math.round(r1 + (r2 - r1) * ratio)
  const g = Math.round(g1 + (g2 - g1) * ratio)
  const b = Math.round(b1 + (b2 - b1) * ratio)
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

function buildPalette(primary: string): Omit<ThemeColors, 'name' | 'nameCN'> {
  return {
    primary,
    light3: mix(primary, '#ffffff', 0.3),
    light5: mix(primary, '#ffffff', 0.5),
    light7: mix(primary, '#ffffff', 0.7),
    light8: mix(primary, '#ffffff', 0.8),
    light9: mix(primary, '#ffffff', 0.9),
    dark2: mix(primary, '#000000', 0.2),
  }
}

export const themes: ThemeColors[] = [
  { name: 'Default Blue', nameCN: '默认蓝', ...buildPalette('#409EFF') },
  { name: 'Tech Purple', nameCN: '科技紫', ...buildPalette('#7C3AED') },
  { name: 'Cyan', nameCN: '青碧色', ...buildPalette('#06B6D4') },
  { name: 'Rose', nameCN: '玫瑰红', ...buildPalette('#F43F5E') },
  { name: 'Amber', nameCN: '琥珀橙', ...buildPalette('#F59E0B') },
  { name: 'Emerald', nameCN: '翠绿色', ...buildPalette('#10B981') },
  { name: 'Slate', nameCN: '石墨灰', ...buildPalette('#64748B') },
  { name: 'Deep Blue', nameCN: '深海蓝', ...buildPalette('#1E40AF') },
]

// ============================================================
// 双视觉风格
// ============================================================
export type StyleMode = 'tech' | 'minimal'

export interface StyleDef {
  key: StyleMode
  name: string
  nameCN: string
  icon: string
}

export const styleModes: StyleDef[] = [
  { key: 'tech', name: 'Tech Blue', nameCN: '科技蓝', icon: '🛸' },
  { key: 'minimal', name: 'Minimal White', nameCN: '极简白', icon: '✨' },
]

const THEME_KEY = 'app-theme'
const STYLE_KEY = 'app-style'

// ─── 主题色 ───
export function getSavedTheme(): string {
  return localStorage.getItem(THEME_KEY) || themes[0].primary
}

export function saveTheme(primary: string) {
  localStorage.setItem(THEME_KEY, primary)
}

export function applyTheme(primary: string) {
  const palette = themes.find((t) => t.primary === primary) || themes[0]
  const root = document.documentElement

  root.style.setProperty('--el-color-primary', palette.primary)
  root.style.setProperty('--el-color-primary-light-3', palette.light3)
  root.style.setProperty('--el-color-primary-light-5', palette.light5)
  root.style.setProperty('--el-color-primary-light-7', palette.light7)
  root.style.setProperty('--el-color-primary-light-8', palette.light8)
  root.style.setProperty('--el-color-primary-light-9', palette.light9)
  root.style.setProperty('--el-color-primary-dark-2', palette.dark2)

  saveTheme(primary)
}

// ─── 视觉风格 ───
export function getSavedStyle(): StyleMode {
  return (localStorage.getItem(STYLE_KEY) as StyleMode) || 'tech'
}

export function saveStyle(mode: StyleMode) {
  localStorage.setItem(STYLE_KEY, mode)
}

export function applyStyle(mode: StyleMode) {
  const root = document.documentElement
  root.classList.remove('style-tech', 'style-minimal')
  root.classList.add(`style-${mode}`)
  saveStyle(mode)
}

// ─── 初始化 ───
export function initTheme() {
  applyTheme(getSavedTheme())
  applyStyle(getSavedStyle())
}
