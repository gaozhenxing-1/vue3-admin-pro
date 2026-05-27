/**
 * Mock 数据层
 *
 * 通过拦截 Axios 请求返回模拟数据。
 * 当 VITE_USE_MOCK=true 时启用。
 *
 * 买家购买后：
 *   1. 设置 VITE_USE_MOCK=false
 *   2. 修改 VITE_API_BASE_URL 指向自己的后端
 *   3. Mock 数据自动失效，开始走真实接口
 */
import type { AxiosInstance } from 'axios'

// ─── Mock 数据定义 ───

const dashboardData = {
  stats: {
    totalUsers: 1260,
    totalOrders: 880,
    totalVisits: 56800,
    totalMessages: 342,
  },
  visitTrend: {
    weeks: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    visits: [820, 932, 901, 934, 1290, 1330, 1520],
    orders: [120, 145, 138, 152, 198, 210, 245],
  },
  sourceDistribution: [
    { name: 'Search Engine', value: 40 },
    { name: 'Direct Visit', value: 30 },
    { name: 'Social Media', value: 15 },
    { name: 'Email', value: 10 },
    { name: 'Ads', value: 5 },
  ],
  recentOrders: Array.from({ length: 8 }, (_, i) => ({
    id: `ORD-${String(20260001 + i)}`,
    customer: [
      'Alice Chen',
      'Bob Wang',
      'Carol Li',
      'David Zhang',
      'Eve Liu',
      'Frank Wu',
      'Grace Sun',
      'Henry Zhao',
    ][i],
    product: [
      'MacBook Pro',
      'iPhone 15',
      'AirPods Pro',
      'iPad Air',
      'Apple Watch',
      'Magic Keyboard',
      'Studio Display',
      'Mac Mini',
    ][i],
    amount: [12999, 8999, 1999, 4999, 3499, 1199, 11499, 4599][i],
    status: ['paid', 'shipped', 'pending', 'paid', 'shipped', 'refunded', 'paid', 'pending'][i],
    date: `2026-05-${String(20 - i).padStart(2, '0')}`,
  })),
}

const tableData = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  username: `user_${String(i + 1).padStart(4, '0')}`,
  nickname: ['张三', '李四', '王五', '赵六', '陈七'][i % 5],
  email: `user${i + 1}@example.com`,
  role: ['admin', 'editor', 'guest'][i % 3],
  status: i % 5 === 0 ? 'disabled' : 'enabled',
  createdTime: `2026-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')}`,
}))

const mockUsers = [
  {
    id: 1,
    username: 'admin',
    nickname: '管理员',
    email: 'admin@example.com',
    role: 'admin',
    status: 'enabled',
  },
  {
    id: 2,
    username: 'editor',
    nickname: '编辑',
    email: 'editor@example.com',
    role: 'editor',
    status: 'enabled',
  },
  {
    id: 3,
    username: 'guest',
    nickname: '访客',
    email: 'guest@example.com',
    role: 'guest',
    status: 'enabled',
  },
  ...Array.from({ length: 27 }, (_, i) => ({
    id: i + 4,
    username: `user${i + 4}`,
    nickname: `用户${i + 4}`,
    email: `user${i + 4}@example.com`,
    role: ['editor', 'guest'][i % 2],
    status: i % 6 === 0 ? 'disabled' : 'enabled',
  })),
]

const mockRoles = [
  {
    id: 1,
    name: '超级管理员',
    code: 'admin',
    desc: '拥有所有权限',
    userCount: 1,
    permissions: [
      'dashboard',
      'table',
      'form',
      'editor',
      'user',
      'role',
      'logs',
      'files',
      'messages',
      'settings',
    ],
  },
  {
    id: 2,
    name: '编辑',
    code: 'editor',
    desc: '内容管理权限',
    userCount: 12,
    permissions: ['dashboard', 'table', 'form', 'editor', 'logs', 'files', 'messages'],
  },
  {
    id: 3,
    name: '访客',
    code: 'guest',
    desc: '只读权限',
    userCount: 17,
    permissions: ['dashboard'],
  },
]

// ─── Mock 适配器（无外部依赖） ───

class MockAdapter {
  private axios: AxiosInstance
  private routes: Map<string, (params?: any) => any> = new Map()

  constructor(axios: AxiosInstance) {
    this.axios = axios
    this.axios.interceptors.request.use((config) => {
      const url = `${config.method?.toUpperCase()}:${config.url}`
      const handler = this.routes.get(url)
      if (handler) {
        let body = config.data
        if (typeof body === 'string') {
          try {
            body = JSON.parse(body)
          } catch {
            body = {}
          }
        }
        const mockResponse = handler(config.params || body || {})
        // 直接返回 mock 数据，取消真实请求
        const adapter = config.adapter
        config.adapter = () =>
          Promise.resolve({
            data: { code: 0, data: mockResponse, message: 'ok' },
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
          })
        // 恢复原始 adapter（避免影响后续请求）
        setTimeout(() => {
          config.adapter = adapter
        }, 0)
      }
      return config
    })
  }

  onGet(url: string, handler: (params?: any) => any) {
    this.routes.set(`GET:${url}`, handler)
  }

  onPost(url: string, handler: (data?: any) => any) {
    this.routes.set(`POST:${url}`, handler)
  }

  onPut(url: string, handler: (data?: any) => any) {
    this.routes.set(`PUT:${url}`, handler)
  }

  onDelete(url: string, handler: (data?: any) => any) {
    this.routes.set(`DELETE:${url}`, handler)
  }
}

// ─── 注册 Mock 路由 ───

export function setupMock(axiosInstance: AxiosInstance) {
  const mock = new MockAdapter(axiosInstance)

  // 登录
  mock.onPost('/api/auth/login', (data) => {
    const { username, password } = data
    const user = mockUsers.find((u) => u.username === username)
    if (!user) return { code: 401, message: '用户不存在' }
    return {
      token: `mock-jwt-${user.role}-${Date.now()}`,
      userInfo: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        email: user.email,
        avatar: '',
        roles: [user.role],
        tokenExp: Date.now() + 7200000,
      },
    }
  })

  // 仪表盘数据
  mock.onGet('/api/dashboard/stats', () => dashboardData.stats)
  mock.onGet('/api/dashboard/trend', () => dashboardData.visitTrend)
  mock.onGet('/api/dashboard/sources', () => dashboardData.sourceDistribution)
  mock.onGet('/api/dashboard/recent-orders', () => dashboardData.recentOrders)

  // 用户列表
  mock.onGet('/api/users', (params) => {
    let list = [...mockUsers]
    if (params?.keyword) {
      list = list.filter(
        (u) => u.username.includes(params.keyword) || u.email?.includes(params.keyword),
      )
    }
    if (params?.status) {
      list = list.filter((u) => u.status === params.status)
    }
    const page = params?.page || 1
    const pageSize = params?.pageSize || 10
    const start = (page - 1) * pageSize
    return { list: list.slice(start, start + pageSize), total: list.length }
  })
  mock.onPost('/api/users', () => ({ id: Date.now() }))
  mock.onPut('/api/users/:id', () => ({}))
  mock.onDelete('/api/users/:id', () => ({}))

  // 角色列表
  mock.onGet('/api/roles', () => ({ list: mockRoles, total: mockRoles.length }))
  mock.onPost('/api/roles', () => ({ id: Date.now() }))
  mock.onPut('/api/roles/:id', () => ({}))
  mock.onDelete('/api/roles/:id', () => ({}))

  // 表格数据
  mock.onGet('/api/table/list', (params) => {
    let list = [...tableData]
    if (params?.keyword) {
      list = list.filter(
        (r) => r.username.includes(params.keyword) || r.nickname.includes(params.keyword),
      )
    }
    const page = params?.page || 1
    const pageSize = params?.pageSize || 10
    const start = (page - 1) * pageSize
    return { list: list.slice(start, start + pageSize), total: list.length }
  })

  // 文件列表
  mock.onGet('/api/files', () => ({
    list: [
      { name: '项目文档', type: 'folder', size: '-', modifyTime: '2026-05-20' },
      { name: '需求规格说明书.pdf', type: 'pdf', size: '2.3 MB', modifyTime: '2026-05-18' },
      { name: '设计稿.fig', type: 'figma', size: '15.8 MB', modifyTime: '2026-05-15' },
      { name: 'logo.svg', type: 'image', size: '45 KB', modifyTime: '2026-05-12' },
      { name: 'CHANGELOG.md', type: 'markdown', size: '8 KB', modifyTime: '2026-05-10' },
    ],
  }))

  // 消息列表
  mock.onGet('/api/messages', () => ({
    list: [
      {
        id: 1,
        title: '系统更新通知',
        content: 'Admin Pro V2.0 已发布，新增多项功能',
        time: '2026-05-26 14:30',
        read: false,
        type: 'info',
      },
      {
        id: 2,
        title: '安全提醒',
        content: '检测到异常登录，请确认是否为本人操作',
        time: '2026-05-25 09:15',
        read: false,
        type: 'warning',
      },
      {
        id: 3,
        title: '任务完成',
        content: '数据备份任务已完成',
        time: '2026-05-24 18:00',
        read: true,
        type: 'info',
      },
      {
        id: 4,
        title: '系统错误',
        content: '定时任务执行失败，请检查日志',
        time: '2026-05-23 22:45',
        read: true,
        type: 'error',
      },
    ],
  }))

  // 日志列表
  mock.onGet('/api/logs', (params) => ({
    list: Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      type: ['login', 'operation', 'system'][i % 3],
      level: ['info', 'warning', 'error'][i % 3],
      content: [
        '用户 admin 登录系统',
        '修改了角色配置',
        '系统定时任务执行',
        '导出用户数据',
        '删除文件',
        '创建新用户',
      ][i % 6],
      operator: 'admin',
      ip: `192.168.1.${100 + i}`,
      time: `2026-05-${String(26 - i).padStart(2, '0')} ${String(8 + (i % 12)).padStart(2, '0')}:${String(i % 60).padStart(2, '0')}:00`,
    })),
    total: 156,
  }))

  console.log('✅ Mock API enabled —', mock.routes.size, 'routes registered')
}

// ─── 初始化 ───

export function initMock() {
  const useMock = import.meta.env.VITE_USE_MOCK === 'true'
  if (!useMock) return
  // 延迟导入避免循环依赖
  import('./request').then(({ default: axiosInstance }) => {
    setupMock(axiosInstance)
  })
}
