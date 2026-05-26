<template>
  <div class="profile-page">
    <el-row :gutter="16">
      <el-col :xs="24" :md="8">
        <el-card shadow="hover">
          <div class="profile-card">
            <el-avatar :size="80" style="background: var(--el-color-primary)">
              <el-icon :size="40"><UserFilled /></el-icon>
            </el-avatar>
            <h3 class="profile-name">管理员</h3>
            <p class="profile-role">{{ t('superAdmin') }}</p>
            <el-divider />
            <div class="profile-info">
              <div class="info-item"><span class="label">{{ t('username') }}</span><span>admin</span></div>
              <div class="info-item"><span class="label">{{ t('email') }}</span><span>admin@example.com</span></div>
              <div class="info-item"><span class="label">{{ t('createdTime') }}</span><span>2026-01-01</span></div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="16">
        <el-card shadow="hover">
          <template #header><span>{{ t('modifyInfo') }}</span></template>
          <el-form :model="form" label-width="80px" style="max-width: 480px">
            <el-form-item :label="t('nickname')"><el-input v-model="form.nickname" /></el-form-item>
            <el-form-item :label="t('email')"><el-input v-model="form.email" /></el-form-item>
            <el-form-item :label="t('phone')"><el-input v-model="form.phone" /></el-form-item>
            <el-form-item :label="t('bio')"><el-input v-model="form.bio" type="textarea" :rows="4" /></el-form-item>
            <el-form-item><el-button type="primary" @click="handleSave">{{ t('save') }}</el-button></el-form-item>
          </el-form>
        </el-card>
        <el-card shadow="hover" style="margin-top: 16px">
          <template #header><span>{{ t('changePassword') }}</span></template>
          <el-form :model="pwdForm" label-width="110px" style="max-width: 480px">
            <el-form-item :label="t('currentPwd')"><el-input v-model="pwdForm.oldPwd" type="password" show-password /></el-form-item>
            <el-form-item :label="t('newPwd')"><el-input v-model="pwdForm.newPwd" type="password" show-password /></el-form-item>
            <el-form-item :label="t('confirmNewPwd')"><el-input v-model="pwdForm.confirmPwd" type="password" show-password /></el-form-item>
            <el-form-item><el-button type="primary" @click="handleChangePwd">{{ t('changePassword') }}</el-button></el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { UserFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useI18n } from '@/locales'
const { t } = useI18n()

const form = reactive({ nickname: '管理员', email: 'admin@example.com', phone: '', bio: '' })
const pwdForm = reactive({ oldPwd: '', newPwd: '', confirmPwd: '' })
function handleSave() { ElMessage.success(t('modifySuccess')) }
function handleChangePwd() {
  if (pwdForm.newPwd !== pwdForm.confirmPwd) { ElMessage.error(t('pwdNotSame')); return }
  ElMessage.success(t('pwdChangeSuccess'))
}
</script>

<style scoped lang="scss">
.profile-card { display: flex; flex-direction: column; align-items: center; }
.profile-name { margin-top: 16px; font-size: 18px; color: var(--text-primary, #303133); }
.profile-role { margin-top: 4px; color: var(--text-secondary, #909399); font-size: 13px; }
.profile-info { width: 100%; }
.info-item { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px;
  .label { color: var(--text-secondary, #909399); }
}
</style>
