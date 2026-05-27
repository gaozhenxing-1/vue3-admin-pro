import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'
import { setupRouterGuard } from './guard'

export const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: 'login', hidden: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/login/register.vue'),
    meta: { title: 'register', hidden: true },
  },
  {
    path: '/forgot',
    name: 'Forgot',
    component: () => import('@/views/login/forgot.vue'),
    meta: { title: 'forgotPassword', hidden: true },
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        meta: { title: 'dashboard', icon: 'Odometer' },
        children: [
          {
            path: '',
            name: 'Dashboard',
            component: () => import('@/views/dashboard/index.vue'),
            meta: { title: 'dashboard' },
          },
          {
            path: 'analytics',
            name: 'Analytics',
            component: () => import('@/views/dashboard/analytics.vue'),
            meta: { title: 'analyticsDashboard' },
          },
          {
            path: 'ecommerce',
            name: 'Ecommerce',
            component: () => import('@/views/dashboard/ecommerce.vue'),
            meta: { title: 'ecommerceDashboard' },
          },
          {
            path: 'saas',
            name: 'Saas',
            component: () => import('@/views/dashboard/saas.vue'),
            meta: { title: 'saasDashboard' },
          },
        ],
      },
      {
        path: 'screen',
        name: 'Screen',
        component: () => import('@/views/dashboard/screen.vue'),
        meta: {
          title: 'screenTitle',
          icon: 'DataAnalysis',
          keepAlive: false,
          roles: ['admin', 'editor'],
        },
      },
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index.vue'),
        meta: { title: 'tableExample', icon: 'Grid', keepAlive: true, roles: ['admin', 'editor'] },
      },
      {
        path: 'form',
        name: 'Form',
        component: () => import('@/views/form/index.vue'),
        meta: {
          title: 'formExample',
          icon: 'Document',
          keepAlive: true,
          roles: ['admin', 'editor'],
        },
      },
      {
        path: 'editor',
        name: 'RichEditor',
        component: () => import('@/views/editor/index.vue'),
        meta: {
          title: 'richTextEditor',
          icon: 'EditPen',
          keepAlive: false,
          roles: ['admin', 'editor'],
        },
      },
      {
        path: 'user',
        name: 'UserManage',
        component: () => import('@/views/system/user/index.vue'),
        meta: { title: 'userManage', icon: 'User', keepAlive: true, roles: ['admin'] },
      },
      {
        path: 'role',
        name: 'RoleManage',
        component: () => import('@/views/system/role/index.vue'),
        meta: { title: 'roleManage', icon: 'Avatar', keepAlive: true, roles: ['admin'] },
      },
      {
        path: 'widgets',
        meta: { title: 'components', icon: 'Tickets' },
        children: [
          {
            path: 'drag-sort',
            name: 'DragSort',
            component: () => import('@/views/widgets/drag-sort.vue'),
            meta: { title: 'dragSort' },
          },
          {
            path: 'qrcode',
            name: 'QRCode',
            component: () => import('@/views/widgets/qrcode.vue'),
            meta: { title: 'qrcode' },
          },
          {
            path: 'count-to',
            name: 'CountTo',
            component: () => import('@/views/widgets/count-to.vue'),
            meta: { title: 'countTo' },
          },
          {
            path: 'watermark',
            name: 'Watermark',
            component: () => import('@/views/widgets/watermark.vue'),
            meta: { title: 'watermark' },
          },
          {
            path: 'fullscreen',
            name: 'Fullscreen',
            component: () => import('@/views/widgets/fullscreen.vue'),
            meta: { title: 'fullscreenWidget' },
          },
          {
            path: 'clipboard',
            name: 'Clipboard',
            component: () => import('@/views/widgets/clipboard.vue'),
            meta: { title: 'clipboard' },
          },
        ],
      },
      {
        path: 'logs',
        name: 'SystemLog',
        component: () => import('@/views/system/logs/index.vue'),
        meta: { title: 'systemLog', icon: 'Bell', keepAlive: true, roles: ['admin', 'editor'] },
      },
      {
        path: 'files',
        name: 'FileManager',
        component: () => import('@/views/system/files/index.vue'),
        meta: { title: 'fileManager', icon: 'Folder', keepAlive: true, roles: ['admin', 'editor'] },
      },
      {
        path: 'messages',
        name: 'MessageCenter',
        component: () => import('@/views/system/messages/index.vue'),
        meta: {
          title: 'messageCenter',
          icon: 'ChatDotSquare',
          keepAlive: true,
          roles: ['admin', 'editor'],
        },
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/settings/index.vue'),
        meta: { title: 'settings', icon: 'Setting', keepAlive: true, roles: ['admin', 'editor'] },
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/profile/index.vue'),
        meta: { title: 'profile', icon: 'UserFilled', hidden: true, keepAlive: true },
      },
    ],
  },
  {
    path: '/landing',
    name: 'Landing',
    component: () => import('@/views/front/landing.vue'),
    meta: { title: 'landing', hidden: true },
  },
  {
    path: '/pricing',
    name: 'Pricing',
    component: () => import('@/views/front/pricing.vue'),
    meta: { title: 'pricing', hidden: true },
  },
  {
    path: '/faq',
    name: 'Faq',
    component: () => import('@/views/front/faq.vue'),
    meta: { title: 'faq', hidden: true },
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('@/views/front/contact.vue'),
    meta: { title: 'contact', hidden: true },
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/error/403.vue'),
    meta: { title: '403', hidden: true },
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error/404.vue'),
    meta: { title: '404', hidden: true },
  },
  { path: '/:pathMatch(.*)*', redirect: '/404', meta: { hidden: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})
setupRouterGuard(router)
export default router
