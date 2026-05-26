<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="login-title">{{ t('createAccount') }}</h2>
      <p class="login-subtitle">{{ t('registerDesc') }}</p>
      <el-form ref="formRef" :model="form" :rules="rules" class="login-form">
        <el-form-item prop="username">
          <el-input v-model="form.username" :placeholder="t('username')" :prefix-icon="User" size="large" />
        </el-form-item>
        <el-form-item prop="email">
          <el-input v-model="form.email" :placeholder="t('email')" :prefix-icon="Message" size="large" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" :placeholder="t('password')" :prefix-icon="Lock" size="large" show-password />
        </el-form-item>
        <el-form-item prop="confirmPwd">
          <el-input v-model="form.confirmPwd" type="password" :placeholder="t('confirmPassword')" :prefix-icon="Lock" size="large" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="large" class="login-btn" @click="handleRegister">{{ t('register') }}</el-button>
        </el-form-item>
      </el-form>
      <div class="login-tips"><span>{{ t('hasAccount') }}<router-link to="/login">{{ t('loginNow') }}</router-link></span></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'; import { useRouter } from 'vue-router'
import { User, Lock, Message } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'; import { ElMessage } from 'element-plus'
import { useI18n } from '@/locales'; const { t } = useI18n()
const router = useRouter(); const formRef = ref<FormInstance>()
const form = reactive({ username: '', email: '', password: '', confirmPwd: '' })
const validateConfirm = (_r: any, v: string, cb: any) => { cb(v !== form.password ? new Error(t('pwdNotMatch')) : undefined) }
const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 6, message: '密码长度不少于6位', trigger: 'blur' }],
  confirmPwd: [{ required: true, message: '请确认密码', trigger: 'blur' }, { validator: validateConfirm, trigger: 'blur' }],
}
function handleRegister() {
  formRef.value?.validate((v) => { if (v) { ElMessage.success(t('registerSuccess')); setTimeout(() => router.push('/login'), 1000) } })
}
</script>

<style scoped lang="scss">
.login-container { display: flex; justify-content: center; align-items: center; height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.login-card { width: 420px; padding: 40px; background: var(--bg-white, #fff); border-radius: 8px; box-shadow: 0 8px 32px rgba(0,0,0,0.15); }
.login-title { text-align: center; font-size: 28px; color: var(--text-primary, #303133); margin-bottom: 8px; }
.login-subtitle { text-align: center; color: var(--text-secondary, #909399); font-size: 14px; margin-bottom: 32px; }
.login-form { margin-top: 8px; }
.login-btn { width: 100%; }
.login-tips { text-align: center; color: var(--text-placeholder, #c0c4cc); font-size: 12px; margin-top: 16px;
  a { color: var(--el-color-primary); text-decoration: none; }
}
</style>
