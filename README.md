<p align="center">
  <img src="src/assets/logo.svg" width="80" alt="Admin Pro Logo" />
</p>

<h1 align="center">Admin Pro</h1>

<p align="center">
  A production-ready Vue 3 admin dashboard template with RBAC, i18n, dark mode, 8 color themes, and 20+ pages.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/vue-3.5-brightgreen" alt="Vue 3" />
  <img src="https://img.shields.io/badge/vite-5.4-blue" alt="Vite 5" />
  <img src="https://img.shields.io/badge/typescript-5.6-blue" alt="TypeScript" />
  <img src="https://img.shields.io/badge/element--plus-2.14-409eff" alt="Element Plus" />
  <img src="https://img.shields.io/badge/pinia-3.0-yellow" alt="Pinia" />
  <img src="https://img.shields.io/badge/license-MIT-green" alt="MIT License" />
</p>

---

## ✨ Features

### 🎨 UI & UX
- **8 Preset Color Themes** — Switch themes instantly from the user dropdown
- **Dark / Light Mode** — Full dark mode support with persistent preference
- **Collapsible Sidebar** — Icon-only or expanded with smooth animation
- **Tab Navigation** — Open pages as tabs with keep-alive caching
- **Breadcrumbs** — Auto-generated breadcrumb trail
- **Responsive Layout** — Works on desktop and tablet

### 🌍 Internationalization
- **Chinese (zh-CN) & English (en-US)** built-in
- Easy to add more languages — just extend the locale file

### 🔐 RBAC — Role-Based Access Control
- **3 roles**: `admin`, `editor`, `guest`
- **Menu filtering** — Each user only sees authorized routes
- **Route guards** — Unauthorized access redirects to `/403`
- **Demo accounts** pre-configured:
  | Role | Username | Password |
  |------|----------|----------|
  | Super Admin | `admin` | `admin123` |
  | Editor | `editor` | `editor123` |
  | Guest | `guest` | `guest123` |

### 📊 Data Visualization
- **Dashboard** — KPI cards, gauge charts, line charts, bar charts, radar charts
- **Data Screen** — Full-page 3D visualization with ECharts GL globe

### 📝 Rich Text Editor
- **TipTap** editor with toolbar: bold, italic, headings, lists, blockquote, code blocks, text alignment, links, and image upload

### 📋 Advanced Table
- Pagination, search, multi-column filter
- CSV export, column visibility toggle
- Batch select & delete
- Sortable columns

### 🔧 System Management
- **User Management** — CRUD with role assignment
- **Role Management** — Define roles & permissions
- **System Logs** — Operation log viewer
- **File Manager** — Browse & manage uploaded files
- **Message Center** — Notification management

### 🌐 Front Pages
- **Landing Page** — Hero section, features, CTA
- **Pricing** — Tiered pricing plans
- **FAQ** — Accordion-style FAQ
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
| Charts | ECharts 5.6 + vue-echarts |
| 3D Globe | ECharts GL 2.0 |
| Rich Text | TipTap 3.x |
| CSS | SCSS |
| Utilities | VueUse 14 |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** >= 18
- **npm** >= 9

### Install & Run

```bash
# Clone the project
git clone https://github.com/your-username/admin-pro.git
cd admin-pro

# Install dependencies
npm install

# Start dev server
npm run dev
# → http://localhost:5173
```

### Build for Production

```bash
npm run build
# Output: ./dist
```

### Preview Production Build

```bash
npm run preview
```

---

## 📁 Project Structure

```
admin-pro/
├── src/
│   ├── assets/              # Static assets (logo, images)
│   ├── directives/           # Custom directives (permission)
│   ├── layout/               # Main layout (sidebar + navbar + content)
│   │   └── index.vue
│   ├── locales/              # i18n configuration
│   │   └── index.ts
│   ├── router/               # Routes & guards
│   │   ├── index.ts
│   │   └── guard.ts
│   ├── stores/               # Pinia stores
│   │   ├── app.ts            # App-level state (theme, sidebar)
│   │   ├── tags.ts           # Tab management
│   │   └── user.ts           # Auth & user info
│   ├── styles/               # Global styles
│   │   ├── index.scss
│   │   └── variables.scss
│   ├── utils/                # Utility functions
│   │   └── theme.ts          # Color theme definitions
│   ├── views/
│   │   ├── dashboard/        # Dashboard + Data Screen
│   │   ├── editor/           # Rich text editor (TipTap)
│   │   ├── error/            # 403, 404 pages
│   │   ├── form/             # Form example
│   │   ├── front/            # Landing, Pricing, FAQ, Contact
│   │   ├── login/            # Login, Register, Forgot password
│   │   ├── profile/          # User profile
│   │   ├── settings/         # Settings page
│   │   ├── system/           # User/Role/Logs/Files/Messages
│   │   └── table/            # Advanced table
│   ├── App.vue
│   └── main.ts
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🎨 Theme System

8 preset color themes are built-in:

| Theme | Primary Color | Preview |
|-------|---------------|---------|
| Ocean Blue | `#409EFF` | Clean, professional |
| Mint Green | `#67C23A` | Fresh, natural |
| Sunset Orange | `#E6A23C` | Warm, energetic |
| Rose Red | `#F56C6C` | Bold, passionate |
| Royal Purple | `#9B59B6` | Elegant, creative |
| Teal Cyan | `#1ABC9C` | Modern, crisp |
| Midnight Indigo | `#34495E` | Serious, enterprise |
| Warm Amber | `#D35400` | Vintage, distinctive |

Switch themes via the **user dropdown menu** (click the avatar in the top-right corner).

---

## 🔐 RBAC Demo

```typescript
// Adding role-based access to a route:
{
  path: 'admin-only-page',
  component: () => import('@/views/admin/index.vue'),
  meta: { roles: ['admin'] }  // ← only admins can see this
}
```

The sidebar automatically hides routes the current user doesn't have access to. Direct URL navigation is blocked by the router guard and redirects to `/403`.

---

## 🌍 Adding a New Language

1. Add your locale object in `src/locales/index.ts`:

```typescript
const ja = {
  dashboard: 'ダッシュボード',
  tableExample: 'テーブル例',
  // ... all keys
}
```

2. Register it in the `locales` map and add a toggle button in the layout.

---

## 📄 License

MIT — free for personal and commercial use.

---

## 🙋 Support

For questions, bug reports, or customization requests, please open a GitHub issue or contact the author.

---

**Made with ❤️ by a 7-year frontend veteran. Built to ship fast.**
