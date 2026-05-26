import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'
import { setupRouterGuard } from './guard'

export const routes: RouteRecordRaw[] = [
  { path: '/login', name: 'Login', component: () => import('@/views/login/index.vue'), meta: { title: 'login', hidden: true } },
  { path: '/register', name: 'Register', component: () => import('@/views/login/register.vue'), meta: { title: 'register', hidden: true } },
  { path: '/forgot', name: 'Forgot', component: () => import('@/views/login/forgot.vue'), meta: { title: 'forgotPassword', hidden: true } },
  {
    path: '/', component: Layout, redirect: '/dashboard',
    children: [
      { path: 'dashboard', name: 'Dashboard', component: () => import('@/views/dashboard/index.vue'), meta: { title: 'dashboard', icon: 'Odometer', keepAlive: false } },
      { path: 'screen', name: 'Screen', component: () => import('@/views/dashboard/screen.vue'), meta: { title: 'screenTitle', icon: 'DataAnalysis', keepAlive: false, roles: ['admin','editor'] } },
      { path: 'table', name: 'Table', component: () => import('@/views/table/index.vue'), meta: { title: 'tableExample', icon: 'Grid', keepAlive: true, roles: ['admin','editor'] } },
      { path: 'form', name: 'Form', component: () => import('@/views/form/index.vue'), meta: { title: 'formExample', icon: 'Document', keepAlive: true, roles: ['admin','editor'] } },
      { path: 'editor', name: 'RichEditor', component: () => import('@/views/editor/index.vue'), meta: { title: 'richTextEditor', icon: 'EditPen', keepAlive: false, roles: ['admin','editor'] } },
      { path: 'user', name: 'UserManage', component: () => import('@/views/system/user/index.vue'), meta: { title: 'userManage', icon: 'User', keepAlive: true, roles: ['admin'] } },
      { path: 'role', name: 'RoleManage', component: () => import('@/views/system/role/index.vue'), meta: { title: 'roleManage', icon: 'Avatar', keepAlive: true, roles: ['admin'] } },
      { path: 'logs', name: 'SystemLog', component: () => import('@/views/system/logs/index.vue'), meta: { title: 'systemLog', icon: 'Tickets', keepAlive: true, roles: ['admin','editor'] } },
      { path: 'files', name: 'FileManager', component: () => import('@/views/system/files/index.vue'), meta: { title: 'fileManager', icon: 'Folder', keepAlive: true, roles: ['admin','editor'] } },
      { path: 'messages', name: 'MessageCenter', component: () => import('@/views/system/messages/index.vue'), meta: { title: 'messageCenter', icon: 'Bell', keepAlive: true, roles: ['admin','editor'] } },
      { path: 'settings', name: 'Settings', component: () => import('@/views/settings/index.vue'), meta: { title: 'settings', icon: 'Setting', keepAlive: true, roles: ['admin','editor'] } },
      { path: 'profile', name: 'Profile', component: () => import('@/views/profile/index.vue'), meta: { title: 'profile', icon: 'UserFilled', hidden: true, keepAlive: true } },
    ],
  },
  { path: '/landing', name: 'Landing', component: () => import('@/views/front/landing.vue'), meta: { title: 'landing', hidden: true } },
  { path: '/pricing', name: 'Pricing', component: () => import('@/views/front/pricing.vue'), meta: { title: 'pricing', hidden: true } },
  { path: '/faq', name: 'Faq', component: () => import('@/views/front/faq.vue'), meta: { title: 'faq', hidden: true } },
  { path: '/contact', name: 'Contact', component: () => import('@/views/front/contact.vue'), meta: { title: 'contact', hidden: true } },
  { path: '/403', name: '403', component: () => import('@/views/error/403.vue'), meta: { title: '403', hidden: true } },
  { path: '/404', name: '404', component: () => import('@/views/error/404.vue'), meta: { title: '404', hidden: true } },
  { path: '/:pathMatch(.*)*', redirect: '/404', meta: { hidden: true } },
]

const router = createRouter({ history: createWebHistory(), routes, scrollBehavior: () => ({ top: 0 }) })
setupRouterGuard(router)
export default router
