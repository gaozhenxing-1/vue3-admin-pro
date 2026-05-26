/**
 * Clean Script — 一键清除 Demo 数据
 *
 * 运行：node scripts/clean.js
 *
 * 此脚本会：
 *   1. 关闭 Mock 模式（VITE_USE_MOCK=false）
 *   2. 清除登录页的演示账号
 *   3. 清除 localStorage 中的 demo 凭据
 *   4. 输出手动清理清单
 *
 * ⚠️  运行后不可逆，建议先 git commit 保存当前状态。
 */

const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')

function backup(file) {
  const backupDir = path.join(ROOT, '.clean-backup')
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir)
  const src = path.join(ROOT, file)
  const dest = path.join(backupDir, path.basename(file))
  fs.copyFileSync(src, dest)
}

function replaceInFile(file, pattern, replacement) {
  const filePath = path.join(ROOT, file)
  let content = fs.readFileSync(filePath, 'utf8')
  const original = content
  content = content.replace(pattern, replacement)
  if (content !== original) {
    fs.writeFileSync(filePath, content)
    return true
  }
  return false
}

console.log('🧹 Admin Pro — Clean Script')
console.log('============================\n')

// ─── 1. 关闭 Mock ───
backup('.env')
let changed = replaceInFile('.env', /VITE_USE_MOCK=true/, 'VITE_USE_MOCK=false')
console.log(changed ? '✅ Mock mode disabled' : '⚠️  Mock already disabled')

// ─── 2. 清除演示账号 ───
backup('src/views/login/index.vue')
changed = replaceInFile(
  'src/views/login/index.vue',
  /const demoAccounts = \[[\s\S]*?\]/,
  'const demoAccounts: typeof demoAccounts = []'
)
console.log(changed ? '✅ Demo accounts cleared' : '⚠️  Demo accounts already cleared')

// ─── 3. 清除默认登录表单值 ───
changed = replaceInFile(
  'src/views/login/index.vue',
  /username: saved\?.username \|\| 'admin'/,
  "username: saved?.username || ''"
)
changed = replaceInFile(
  'src/views/login/index.vue',
  /role: saved\?.role \|\| 'admin'/,
  "role: saved?.role || ''"
)
console.log('✅ Default login form values cleared')

// ─── 4. 清除 Mock 数据定义 ───
backup('src/api/mock.ts')
changed = replaceInFile(
  'src/api/mock.ts',
  /const dashboardData = \{[\s\S]*?\n\}/,
  'const dashboardData = { stats: { totalUsers: 0, totalOrders: 0, totalVisits: 0, totalMessages: 0 }, visitTrend: { weeks: [], visits: [], orders: [] }, sourceDistribution: [], recentOrders: [] }'
)
console.log(changed ? '✅ Dashboard mock data cleared' : '⚠️  Dashboard mock already cleared')

changed = replaceInFile(
  'src/api/mock.ts',
  /const tableData = Array\.from[\s\S]*?\)\)/,
  'const tableData: any[] = []'
)
console.log(changed ? '✅ Table mock data cleared' : '⚠️  Table mock already cleared')

// ─── 完成 ───
console.log('\n============================')
console.log('🎉 Clean complete!\n')
console.log('📋 Next steps (manual):')
console.log('  1. Update VITE_API_BASE_URL in .env → point to your real API')
console.log('  2. Replace logo.svg in src/assets/ with your own logo')
console.log('  3. Update site name in src/layout/index.vue (search "Admin Pro")')
console.log('  4. Customize landing page in src/views/front/landing.vue')
console.log('  5. Add your own API modules in src/api/modules/')
console.log('\n📦 Backups saved in .clean-backup/')
console.log('   Delete this folder when you no longer need the originals.')
console.log('\n💡 To undo: git checkout .')
