# Admin Pro — Phase 1 Development Plan

> 本文档供 Claude Code 或其他 AI 编码助手按步骤执行。
> 每完成一个模块，运行 `npm run build` 验证。
> 不要修改 `package.json` 之外的配置文件（ESLint/Prettier/Husky 已配好）。

---

## 模块 1：3 套行业仪表盘

### 目标
从 1 套通用仪表盘扩展为 3 套：Analytics（分析）、E-Commerce（电商）、SaaS。

### 前置条件
- 现有仪表盘在 `src/views/dashboard/index.vue`，保持不变作为默认仪表盘
- ECharts 已安装，vue-echarts 版本 7.0.3

### 文件变更清单

```
src/views/dashboard/
├── index.vue          # [不改] 通用仪表盘
├── analytics.vue      # [新建] 分析仪表盘
├── ecommerce.vue      # [新建] 电商仪表盘
└── saas.vue           # [新建] SaaS 仪表盘

src/router/index.ts    # [修改] 加3条路由，sidebar支持子菜单
src/locales/index.ts   # [修改] 加翻译词条
src/layout/index.vue   # [修改] 侧边栏支持 el-sub-menu 嵌套
```

### 步骤 1.1：Analytics 仪表盘

新建 `src/views/dashboard/analytics.vue`，包含：

**KPI 卡片行（4个）**：
- 页面浏览量（PV）：12,856 ↑12%
- 独立访客（UV）：8,420 ↑8%
- 平均停留时长：4m 32s ↓3%
- 跳出率：32.5% ↓5%

**图表行（2列）**：
- 左：折线图 — 过去30天访问趋势（PV + UV双线）
- 右：柱状图 — 设备分布（Desktop 55% / Mobile 35% / Tablet 10%）

**下半部分（2列）**：
- 左：饼图 — 流量来源（搜索引擎40% / 直接访问30% / 社交媒体15% / 邮件10% / 广告5%）
- 右：表格 — Top 10 访问页面（含 PV 和 UV）

**技术要求**：
- 使用 `vue-echarts` 组件，options 写在 `computed` 或 `ref` 里
- 数据写死为 mock 常量（不要调 API）
- 页面结构：`<div class="analytics-dashboard">` → 卡片行 → 图表行 → 下半部分
- 样式 scoped，卡片用 `el-card` 包裹

### 步骤 1.2：E-Commerce 仪表盘

新建 `src/views/dashboard/ecommerce.vue`，包含：

**KPI 卡片行（4个）**：
- 总销售额：$48,290 ↑18%
- 订单数：1,286 ↑12%
- 客单价：$37.55 ↑6%
- 转化率：3.24% ↑0.8%

**图表行（2列）**：
- 左：柱状图 — 过去12个月销售额（含同环比虚线）
- 右：折线图 — 订单转化漏斗（浏览→加购→下单→支付）

**下半部分（2列）**：
- 左：排行榜表格 — 热销商品 Top 8（商品名、销量、销售额、库存）
- 右：环形图 — 商品类目销售额占比

### 步骤 1.3：SaaS 仪表盘

新建 `src/views/dashboard/saas.vue`，包含：

**KPI 卡片行（4个）**：
- MRR：$12,450 ↑22%
- 活跃用户：3,842 ↑15%
- 流失率：2.1% ↓1.2%
- LTV：$680 ↑8%

**图表行（2列）**：
- 左：面积图 — MRR 增长趋势（6个月）
- 右：柱状图 — 新用户 vs 流失用户（12个月）

**下半部分（2列）**：
- 左：横向柱状图 — 套餐分布（Free 40% / Pro 35% / Enterprise 25%）
- 右：表格 — 最近注册用户 Top 8

### 步骤 1.4：路由 + 多级菜单

修改 `src/router/index.ts`：

```ts
// 将原来的 dashboard 路由改为嵌套结构
{
  path: 'dashboard',
  component: Layout,  // 实际不需要，已经在 Layout children 下
  meta: { title: 'dashboard', icon: 'Odometer' },
  children: [
    { path: '', name: 'Dashboard', component: () => import('@/views/dashboard/index.vue'), meta: { title: 'dashboard' } },
    { path: 'analytics', name: 'Analytics', component: () => import('@/views/dashboard/analytics.vue'), meta: { title: 'analyticsDashboard' } },
    { path: 'ecommerce', name: 'Ecommerce', component: () => import('@/views/dashboard/ecommerce.vue'), meta: { title: 'ecommerceDashboard' } },
    { path: 'saas', name: 'Saas', component: () => import('@/views/dashboard/saas.vue'), meta: { title: 'saasDashboard' } },
  ]
}
```

修改 `src/layout/index.vue`：

- `el-menu-item` 改成支持 `el-sub-menu` 嵌套
- 当路由有 `children` 时渲染 `<el-sub-menu>`，否则渲染 `<el-menu-item>`
- 子菜单的 `index` 使用 `/parentPath/childPath` 格式
- 折叠状态（collapsed）时子菜单自动变为弹出层（Element Plus 默认行为）

伪代码逻辑：
```html
<template v-for="r in menuRoutes" :key="r.path">
  <el-sub-menu v-if="r.children && r.children.length" :index="'/' + r.path">
    <template #title>
      <el-icon><component :is="iconMap[r.meta.icon]" /></el-icon>
      <span>{{ t(r.meta.title) }}</span>
    </template>
    <el-menu-item v-for="c in r.children" :index="'/' + r.path + '/' + c.path">
      {{ t(c.meta.title) }}
    </el-menu-item>
  </el-sub-menu>
  <el-menu-item v-else :index="'/' + r.path">
    <el-icon v-if="r.meta?.icon"><component :is="iconMap[r.meta.icon]" /></el-icon>
    <template #title>{{ t(r.meta.title) }}</template>
  </el-menu-item>
</template>
```

同时修改 `menuRoutes` computed 和 `activeMenu` computed 以支持嵌套。

### 步骤 1.5：i18n 翻译

在 `src/locales/index.ts` 的中英文里新增：

| Key | 中文 | English |
|-----|------|---------|
| `analyticsDashboard` | 分析仪表盘 | Analytics |
| `ecommerceDashboard` | 电商仪表盘 | E-Commerce |
| `saasDashboard` | SaaS仪表盘 | SaaS |

---

## 模块 2：Widgets 组件库

### 目标
新增 6 个独立组件页面，归类到「组件」菜单下。

### 安装依赖

```bash
npm install vue-draggable-plus qrcode.vue --legacy-peer-deps
```

### 文件变更清单

```
src/views/widgets/
├── drag-sort.vue      # [新建] 拖拽排序
├── qrcode.vue         # [新建] 二维码生成
├── count-to.vue       # [新建] 数字滚动动画
├── watermark.vue      # [新建] 页面水印
├── fullscreen.vue     # [新建] 全屏切换
└── clipboard.vue      # [新建] 复制到剪贴板

src/router/index.ts    # [修改] 加6条路由 + 组件菜单
src/locales/index.ts   # [修改] 加翻译词条
```

### 步骤 2.1：拖拽排序

`src/views/widgets/drag-sort.vue`：

- 一个列表（10条数据：姓名 + 排序号）
- 使用 `vue-draggable-plus` 的 `VueDraggable` 组件
- 拖拽手柄在每行左侧（≡ 图标）
- 拖拽后列表顺序实时更新，底部显示 JSON 结果
- UI：`el-card` 包裹，每行 `el-tag` 显示序号

### 步骤 2.2：二维码生成

`src/views/widgets/qrcode.vue`：

- 左侧：`el-input` 输入框（URL 或文本）
- 右侧：`qrcode-vue` 组件实时渲染二维码
- 下方：下载按钮，将二维码导出为 PNG
- 提供几个预设按钮（GitHub / 官网 / Demo链接）快速切换

### 步骤 2.3：数字滚动动画

`src/views/widgets/count-to.vue`：

- 4 个数字卡片，每个卡片一个数字从 0 滚动到目标值
- 不需要额外库，用 `requestAnimationFrame` + `ref` 实现
- 封装为可复用组件 `<CountTo :end="1260" :duration="2000" />`
- 卡片下方有按钮：重新播放 / 随机数值

### 步骤 2.4：页面水印

`src/views/widgets/watermark.vue`：

- 页面显示一段示例文字内容
- 点击按钮整页打上水印（Canvas 生成半透明文字，`position:fixed` + `pointer-events:none`）
- 水印文字可输入自定义（默认「Admin Pro 水印」）
- 可调节透明度（滑块 0.1 - 0.3）
- 再次点击清除水印

### 步骤 2.5：全屏切换

`src/views/widgets/fullscreen.vue`：

- 页面中心放一段彩色内容（el-card + 渐变背景）
- 按钮：进入全屏 / 退出全屏
- 使用 `screenfull` 或原生 `document.documentElement.requestFullscreen()`
- 监听 `fullscreenchange` 事件实时切换按钮文字和图标
- 不需要额外安装库，用原生 API 即可

### 步骤 2.6：复制到剪贴板

`src/views/widgets/clipboard.vue`：

- 输入框 + 复制按钮
- 点击复制后 `navigator.clipboard.writeText()` 复制到剪贴板
- `ElMessage.success('已复制')` 提示
- 下面展示几个预设文本（API Key 模版、curl 命令、Markdown 代码块）可一键复制

### 步骤 2.7：路由 + 菜单

在 router 中新增「组件」菜单组（和仪表盘一样嵌套结构）：

```ts
{
  path: 'widgets',
  meta: { title: 'components', icon: 'Grid' },
  children: [
    { path: 'drag-sort', name: 'DragSort', component: () => import('@/views/widgets/drag-sort.vue'), meta: { title: 'dragSort' } },
    { path: 'qrcode', name: 'QRCode', component: () => import('@/views/widgets/qrcode.vue'), meta: { title: 'qrcode' } },
    { path: 'count-to', name: 'CountTo', component: () => import('@/views/widgets/count-to.vue'), meta: { title: 'countTo' } },
    { path: 'watermark', name: 'Watermark', component: () => import('@/views/widgets/watermark.vue'), meta: { title: 'watermark' } },
    { path: 'fullscreen', name: 'Fullscreen', component: () => import('@/views/widgets/fullscreen.vue'), meta: { title: 'fullscreenWidget' } },
    { path: 'clipboard', name: 'Clipboard', component: () => import('@/views/widgets/clipboard.vue'), meta: { title: 'clipboard' } },
  ]
}
```

> 注意：`icon: 'Grid'` 和表格共用了一个图标。如果没有重复问题就用，有就换 `Tickets` 或其他。

### 步骤 2.8：i18n

新增翻译：

| Key | 中文 | English |
|-----|------|---------|
| `components` | 组件 | Components |
| `dragSort` | 拖拽排序 | Drag Sort |
| `qrcode` | 二维码 | QR Code |
| `countTo` | 数字滚动 | Count To |
| `watermark` | 水印 | Watermark |
| `fullscreenWidget` | 全屏 | Fullscreen |
| `clipboard` | 剪贴板 | Clipboard |

---

## 模块 3：按钮级权限 + 多级菜单完善

### 目标
- 权限指令 `v-permission` 控制按钮显隐
- 多级菜单在模块 1 中已做，此处确保完整可用

### 步骤 3.1：完善权限指令

修改 `src/directives/permission.ts`（如果文件存在则重写）：

```ts
import type { Directive } from 'vue'
import { useUserStore } from '@/stores/user'

export const permission: Directive = {
  mounted(el, binding) {
    const userStore = useUserStore()
    const requiredRoles = binding.value as string[]

    if (requiredRoles && requiredRoles.length > 0) {
      const hasPermission = requiredRoles.some(role => userStore.roles.includes(role))
      if (!hasPermission) {
        el.parentNode?.removeChild(el)
      }
    }
  }
}
```

在 `main.ts` 注册：

```ts
import { permission } from './directives/permission'
app.directive('permission', permission)
```

### 步骤 3.2：在关键页面应用权限指令

**用户管理页** `src/views/system/user/index.vue`：
- 新增用户按钮：`v-permission="['admin']"`
- 编辑按钮：`v-permission="['admin']"`
- 删除按钮：`v-permission="['admin']"`

**角色管理页** `src/views/system/role/index.vue`：
- 新增角色按钮：`v-permission="['admin']"`
- 编辑按钮：`v-permission="['admin']"`
- 删除按钮：`v-permission="['admin']"`

**表格页** `src/views/table/index.vue`：
- 批量删除按钮：`v-permission="['admin']"`
- 编辑按钮（每行）：`v-permission="['admin','editor']"`
- 删除按钮（每行）：`v-permission="['admin']"`

### 步骤 3.3：验证多级菜单

用 3 个账号分别登录验证：

| 账号 | 应看到 |
|------|--------|
| admin | 所有菜单 + 所有按钮 |
| editor | 仪表盘子菜单、表格（无批量删除/删除）、表单、编辑器、组件子菜单 |
| guest | 仅仪表盘子菜单 |

---

## ✅ 验证清单

每完成一个模块后执行：

```bash
# 1. TypeScript 检查
npx vue-tsc --noEmit

# 2. ESLint 检查
npx eslint src --ext .vue,.ts

# 3. 构建
npx vite build

# 4. 如果以上全部通过，启动 dev server 目测验证
npm run dev
```

### 目测验证点

- [ ] 仪表盘子菜单展开收起正常
- [ ] 3 套仪表盘 KPI 卡片数据不同
- [ ] 3 套仪表盘图表正常渲染（不空白）
- [ ] 组件子菜单展开收起正常
- [ ] 6 个 Widgets 页面功能正常
- [ ] 拖拽排序能拖动
- [ ] 二维码输入文字后变化
- [ ] 数字滚动动画播放
- [ ] 水印显示和清除
- [ ] 全屏进入和退出
- [ ] 复制按钮能复制
- [ ] admin 登录看到所有按钮
- [ ] editor 登录看不到删除/批量删除
- [ ] guest 登录只看到仪表盘菜单

---

## 🚫 不要做的事

- ❌ 不要新装任何不需要的 npm 包（只装 vue-draggable-plus 和 qrcode.vue）
- ❌ 不要修改 ESLint/Prettier/Husky 配置
- ❌ 不要改现有的 `src/views/dashboard/index.vue`
- ❌ 不要改 `package.json` 的 scripts
- ❌ 不要改 `.env` 文件
- ❌ 不要删除任何已有文件

---

## 📝 完成后输出

全部完成后在终端运行：

```bash
npm run build 2>&1 | tail -1
```

预期输出：`✓ built in xx.xxs`

把构建结果和 dev server 截图发给我审核。
