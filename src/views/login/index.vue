<template>
  <div class="login-wrapper">
    <!-- 装饰背景 -->
    <div class="login-bg">
      <div class="bg-shape bg-shape-1" />
      <div class="bg-shape bg-shape-2" />
      <div class="bg-shape bg-shape-3" />
    </div>

    <div class="login-card">
      <!-- Logo -->
      <div class="login-header">
        <img src="@/assets/logo.svg" class="login-logo" alt="logo" />
        <h1 class="login-title">Admin Pro</h1>
        <p class="login-subtitle">{{ t('loginSubtitle') }}</p>
      </div>

      <!-- 快捷演示账号 -->
      <div class="demo-accounts">
        <span
          v-for="acc in demoAccounts" :key="acc.role"
          class="demo-tag"
          :class="{ active: loginForm.role === acc.role }"
          @click="fillDemo(acc)"
        >
          {{ lang === 'zh-cn' ? acc.labelCN : acc.label }}
        </span>
      </div>

      <!-- 表单 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="rules" class="login-form" @keyup.enter="handleLogin">
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            :placeholder="t('username')"
            :prefix-icon="User"
            size="large"
            clearable
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            :placeholder="t('password')"
            :prefix-icon="Lock"
            size="large"
            show-password
          />
        </el-form-item>

        <!-- 记住密码 + 忘记密码 -->
        <div class="login-options">
          <el-checkbox v-model="rememberMe" size="small">{{ t('rememberMe') }}</el-checkbox>
          <router-link to="/forgot" class="forgot-link">{{ t('forgotPassword') }}?</router-link>
        </div>

        <el-button
          type="primary"
          size="large"
          :loading="loading"
          class="login-btn"
          @click="handleLogin"
        >
          {{ loading ? t('loggingIn') : t('login') }}
        </el-button>
      </el-form>

      <div class="login-footer">
        <span class="footer-text">{{ t('noAccount') }}</span>
        <router-link to="/register" class="footer-link">{{ t('registerNow') }}</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores'
import { useI18n, currentLocale } from '@/locales'
const { t } = useI18n()

const router = useRouter()
const userStore = useUserStore()
const loginFormRef = ref<FormInstance>()
const loading = ref(false)
const rememberMe = ref(false)
const lang = ref(currentLocale.value)

// 恢复记住的账号
const saved = JSON.parse(localStorage.getItem('rememberedAccount') || 'null')
const loginForm = reactive({
  username: saved?.username || 'admin',
  password: saved?.password || '',
  role: saved?.role || 'admin',
})

const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

const demoAccounts = [
  { role: 'admin', label: 'Admin', labelCN: '超级管理员', username: 'admin', password: 'admin123' },
  { role: 'editor', label: 'Editor', labelCN: '编辑', username: 'editor', password: 'editor123' },
  { role: 'guest', label: 'Guest', labelCN: '访客', username: 'guest', password: 'guest123' },
]

function fillDemo(acc: typeof demoAccounts[0]) {
  loginForm.username = acc.username
  loginForm.password = acc.password
  loginForm.role = acc.role
}

// 生成模拟 JWT token（含过期时间）
function generateToken(role: string): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const now = Math.floor(Date.now() / 1000)
  const payload = btoa(JSON.stringify({
    sub: loginForm.username,
    role,
    iat: now,
    exp: now + 7200, // 2小时过期
  }))
  const sig = btoa(`${header}.${payload}.mock-secret`)
  return `${header}.${payload}.${sig}`
}

function handleLogin() {
  loginFormRef.value?.validate((valid) => {
    if (!valid) return
    loading.value = true

    // 模拟网络延迟
    setTimeout(() => {
      loading.value = false

      const token = generateToken(loginForm.role)

      // 记住密码
      if (rememberMe.value) {
        localStorage.setItem('rememberedAccount', JSON.stringify({
          username: loginForm.username,
          password: loginForm.password,
          role: loginForm.role,
        }))
      } else {
        localStorage.removeItem('rememberedAccount')
      }

      userStore.login(token, {
        id: 1,
        username: loginForm.username,
        nickname: loginForm.role === 'admin' ? '管理员' : loginForm.role === 'editor' ? '编辑' : '访客',
        avatar: '',
        email: loginForm.username + '@example.com',
        roles: [loginForm.role],
        tokenExp: Date.now() + 7200 * 1000,
      })

      ElMessage.success(t('loginSuccess'))
      router.push('/dashboard')
    }, 800)
  })
}

onMounted(() => {
  if (saved) rememberMe.value = true
})
</script>

<style scoped>
.login-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #334155 100%);
  overflow: hidden;
}

/* 装饰动画背景 */
.login-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.bg-shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.08;
  animation: float 20s infinite ease-in-out;
}
.bg-shape-1 {
  width: 600px; height: 600px;
  background: radial-gradient(circle, #3b82f6, transparent 70%);
  top: -200px; right: -150px;
}
.bg-shape-2 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, #8b5cf6, transparent 70%);
  bottom: -100px; left: -100px;
  animation-delay: -7s;
}
.bg-shape-3 {
  width: 300px; height: 300px;
  background: radial-gradient(circle, #06b6d4, transparent 70%);
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: -14s;
}
@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -30px) scale(1.05); }
  66% { transform: translate(-20px, 20px) scale(0.95); }
}

.login-card {
  position: relative;
  z-index: 1;
  width: 420px;
  padding: 44px 40px 36px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1);
}

html.dark .login-card {
  background: rgba(30, 31, 33, 0.95);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05);
}

.login-header { text-align: center; margin-bottom: 28px; }
.login-logo { width: 48px; height: 48px; margin-bottom: 12px; }
.login-title { font-size: 26px; font-weight: 700; color: var(--text-primary, #1e293b); margin: 0 0 4px; letter-spacing: -0.5px; }
.login-subtitle { font-size: 13px; color: var(--text-secondary, #64748b); margin: 0; }

/* 快捷演示账号 */
.demo-accounts {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  justify-content: center;
}
.demo-tag {
  padding: 4px 12px;
  font-size: 12px;
  border-radius: 20px;
  border: 1px solid var(--border-base, #e2e8f0);
  color: var(--text-secondary, #64748b);
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
}
.demo-tag:hover {
  border-color: var(--el-color-primary);
  color: var(--el-color-primary);
}
.demo-tag.active {
  background: var(--el-color-primary-light-9);
  border-color: var(--el-color-primary);
  color: var(--el-color-primary);
  font-weight: 600;
}

.login-form { margin-top: 4px; }

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-size: 13px;
}
.forgot-link {
  color: var(--el-color-primary);
  text-decoration: none;
  font-size: 13px;
}
.forgot-link:hover { text-decoration: underline; }

.login-btn {
  width: 100%;
  height: 44px;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 1px;
}

.login-footer {
  text-align: center;
  margin-top: 20px;
  font-size: 13px;
}
.footer-text { color: var(--text-secondary, #94a3b8); }
.footer-link {
  color: var(--el-color-primary);
  text-decoration: none;
  margin-left: 4px;
  font-weight: 500;
}
.footer-link:hover { text-decoration: underline; }
</style>
