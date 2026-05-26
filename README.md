<p align="center">
  <img src="src/assets/logo.svg" width="80" alt="Admin Pro Logo" />
</p>

<h1 align="center">Admin Pro</h1>

<p align="center">
  A production-ready Vue 3 admin dashboard template with RBAC, i18n, dark mode, 8 color themes, 2 visual styles, Axios + Mock API, and 30+ pages.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/vue-3.5-brightgreen" alt="Vue 3" />
  <img src="https://img.shields.io/badge/vite-5.4-blue" alt="Vite 5" />
  <img src="https://img.shields.io/badge/typescript-5.6-blue" alt="TypeScript" />
  <img src="https://img.shields.io/badge/element--plus-2.14-409eff" alt="Element Plus" />
  <img src="https://img.shields.io/badge/pinia-3.0-yellow" alt="Pinia" />
  <img src="https://img.shields.io/badge/eslint-8.57-purple" alt="ESLint" />
  <img src="https://img.shields.io/badge/license-MIT-green" alt="MIT License" />
</p>

---

## ✨ Features

### 🎨 UI & UX
- **8 Preset Color Themes** — Switch themes instantly from the user dropdown
- **2 Visual Styles** — Tech Blue & Minimal White, each with distinct sidebar, card, and spacing designs
- **Dark / Light Mode** — Full dark mode support with persistent preference
- **Collapsible Sidebar** — Icon-only or expanded with smooth animation
- **Tab Navigation** — Open pages as tabs with keep-alive caching
- **Breadcrumbs** — Auto-generated breadcrumb trail

### 🌍 Internationalization
- **Chinese (zh-CN) & English (en-US)** built-in
- Easy to add more languages — extend the locale file

### 🔐 RBAC — Role-Based Access Control
- **3 roles**: `admin`, `editor`, `guest`
- **Menu filtering** — Each user only sees authorized routes
- **Route guards** — Unauthorized access → `/403`
- **JWT mock auth** — Realistic token generation with expiration & auto-refresh
- **Remember me** — Persistent login with credential storage
- **Demo accounts**:
  | Role | Username | Password |
  |------|----------|----------|
  | Super Admin | `admin` | `admin123` |
  | Editor | `editor` | `editor123` |
  | Guest | `guest` | `guest123` |

### 📊 Data Visualization
- **Dashboard** — KPI cards, gauge, line, bar, radar charts
- **Data Screen** — Full-page 3D globe visualization with ECharts GL

### 📝 Rich Text Editor
- **TipTap** editor — toolbar with bold, italic, headings, lists, blockquote, code, alignment, links, and image upload

### 📋 Advanced Table
- Pagination, search, multi-column filter, CSV export
- Column visibility toggle, batch select & delete, sortable columns

### 🔌 API Layer — Axios + Mock
- **Axios wrapper** — `src/api/request.ts` with interceptors for token injection & error handling
- **Mock data layer** — `src/api/mock.ts` with 10+ API route mocks
- **Toggle via `.env`** — Set `VITE_USE_MOCK=false` and point to your real backend
- **Structured API modules** — `src/api/modules/` with typed request functions

### 🧹 One-Click Clean
```bash
npm run clean
```
Removes all demo data (mock endpoints, sample accounts, dashboard data, table rows) so you start with a blank, production-ready project.

### 🔧 System Management
- **User Management** — CRUD with role assignment
- **Role Management** — Define roles & permissions
- **System Logs** — Operation log viewer
- **File Manager** — Browse & manage files
- **Message Center** — Notifications with read/unread state

### 🌐 Front Pages
- **Landing Page** — Hero, features, demo accounts, CTA
- **Pricing** — Tiered pricing plans
- **FAQ** — Accordion FAQ
- **Contact** — Contact form with validation

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-------------|
| Framework | Vue 3.5 (Composition API + `<script setup>`) |
| Language | TypeScript 5.6 |
| Build Tool | Vite 5.4 |
| UI Library | Element Plus 2.14 |
| State Management | Pinia 3.0 + persistedstate |
| Router | Vue Router 4.6 |
| HTTP Client | Axios 1.x |
| Charts | ECharts 5.6 + vue-echarts 7 |
| 3D Globe | ECharts GL 2.0 |
| Rich Text | TipTap 3.x |
| Code Quality | ESLint 8 + Prettier |
| CSS | SCSS |
| Utilities | VueUse 14 |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18
- **npm** >= 9

### Install & Run

```bash
git clone https://github.com/gaozhenxing-1/vue3-admin-pro.git
cd vue3-admin-pro
npm install
npm run dev
# → http://localhost:5173
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Lint & auto-fix with ESLint |
| `npm run format` | Format code with Prettier |
| `npm run clean` | Remove all demo data for a fresh start |

### Switching to Your Backend

```bash
# 1. Edit .env
VITE_USE_MOCK=false
VITE_API_BASE_URL=https://your-api.com

# 2. Clean demo data (optional)
npm run clean

# 3. Add your API modules in src/api/modules/
```

---

## 📁 Project Structure

```
admin-pro/
├── scripts/
│   └── clean.js              # Demo data cleanup script
├── src/
│   ├── api/                   # Axios + Mock API layer
│   │   ├── request.ts         # Axios instance + interceptors
│   │   ├── mock.ts            # Mock data & route handlers
│   │   ├── modules/           # Typed API modules
│   │   │   ├── user.ts
│   │   │   └── dashboard.ts
│   │   └── index.ts
│   ├── assets/                # Static assets
│   ├── directives/            # Custom directives (permission)
│   ├── layout/                # Main layout
│   │   └── index.vue
│   ├── locales/               # i18n (zh-CN + en-US)
│   │   └── index.ts
│   ├── router/                # Routes & guards
│   │   ├── index.ts
│   │   └── guard.ts
│   ├── stores/                # Pinia stores
│   │   ├── app.ts
│   │   ├── tags.ts
│   │   └── user.ts
│   ├── styles/                # Global SCSS
│   │   ├── index.scss
│   │   └── variables.scss
│   ├── utils/                 # Utilities
│   │   └── theme.ts           # Theme + style mode system
│   ├── views/
│   │   ├── dashboard/         # Dashboard + Data Screen
│   │   ├── editor/            # TipTap rich text editor
│   │   ├── error/             # 403, 404 pages
│   │   ├── form/              # Form examples
│   │   ├── front/             # Landing, Pricing, FAQ, Contact
│   │   ├── login/             # Login, Register, Forgot
│   │   ├── profile/           # User profile
│   │   ├── settings/          # System settings
│   │   ├── system/            # User/Role/Logs/Files/Messages
│   │   └── table/             # Advanced table
│   ├── App.vue
│   └── main.ts
├── .env                       # Environment variables
├── .env.production            # Production env
├── .eslintrc.cjs              # ESLint config
├── .prettierrc                # Prettier config
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🎨 Theme System

### 8 Color Themes

| Theme | Primary | Vibe |
|-------|---------|------|
| Default Blue | `#409EFF` | Professional |
| Tech Purple | `#7C3AED` | Creative |
| Cyan | `#06B6D4` | Modern |
| Rose | `#F43F5E` | Bold |
| Amber | `#F59E0B` | Warm |
| Emerald | `#10B981` | Fresh |
| Slate | `#64748B` | Serious |
| Deep Blue | `#1E40AF` | Enterprise |

### 2 Visual Styles

| Style | Sidebar | Cards | Feel |
|-------|---------|-------|------|
| **Tech Blue** | Dark gradient | Rounded + shadow | SaaS product |
| **Minimal White** | Pure white + border | Flat + 1px border | Apple/Linear |

Switch both via the **user dropdown menu** (top-right avatar).

---

## 🔐 RBAC

```typescript
// Add role-based access to any route:
{
  path: 'admin-only-page',
  component: () => import('@/views/admin/index.vue'),
  meta: { roles: ['admin'] }
}
```

Unauthorized routes are hidden from the sidebar and blocked by the router guard.

---

## 🌍 i18n

```typescript
// Add a language in src/locales/index.ts:
const ja = {
  dashboard: 'ダッシュボード',
  tableExample: 'テーブル例',
  // ...
}
```

---

## 🛒 Purchase

> [!NOTE]
> 🔗 🛒 [Buy Now — $49](https://gao892947907.lemonsqueezy.com/checkout/buy/7af63e8e-bb13-4946-bf49-0a080797fc19)

## 📄 License

MIT — free for personal and commercial use.

---

## 🙋 Support

Questions or customization requests? Open a GitHub issue or contact the author.

---

**Made with ❤️ by a 7-year frontend veteran. Built to ship fast.**
