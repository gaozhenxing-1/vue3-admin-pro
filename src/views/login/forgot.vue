<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="login-title">{{ t('forgotPasswordTitle') }}</h2>
      <p class="login-subtitle">{{ t('forgotPasswordDesc') }}</p>
      <el-form ref="formRef" :model="form" :rules="rules" class="login-form">
        <el-form-item prop="email">
          <el-input
            v-model="form.email"
            :placeholder="t('email')"
            :prefix-icon="Message"
            size="large"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="large" class="login-btn" @click="handleSubmit">
            {{ t('sendResetLink') }}
          </el-button>
        </el-form-item>
      </el-form>
      <div class="login-tips">
        <span
          ><router-link to="/login">{{ t('backToLogin') }}</router-link></span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Message } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useI18n } from '@/locales'
const { t } = useI18n()
const formRef = ref<FormInstance>()
const form = reactive({ email: '' })
const rules: FormRules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
  ],
}
function handleSubmit() {
  formRef.value?.validate((v) => {
    if (v) ElMessage.success(t('resetLinkSent'))
  })
}
</script>

<style scoped lang="scss">
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.login-card {
  width: 420px;
  padding: 40px;
  background: var(--bg-white, #fff);
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}
.login-title {
  text-align: center;
  font-size: 28px;
  color: var(--text-primary, #303133);
  margin-bottom: 8px;
}
.login-subtitle {
  text-align: center;
  color: var(--text-secondary, #909399);
  font-size: 14px;
  margin-bottom: 32px;
}
.login-form {
  margin-top: 8px;
}
.login-btn {
  width: 100%;
}
.login-tips {
  text-align: center;
  color: var(--text-placeholder, #c0c4cc);
  font-size: 12px;
  margin-top: 16px;
  a {
    color: var(--el-color-primary);
    text-decoration: none;
  }
}
</style>
