<template>
  <div class="settings-page">
    <el-card shadow="hover">
      <template #header><span>{{ t('settings') }}</span></template>
      <el-tabs tab-position="left" style="min-height: 400px">
        <el-tab-pane :label="t('basicSettings')">
          <el-form label-width="120px" style="max-width: 500px">
            <el-form-item :label="t('siteName')"><el-input v-model="basic.siteName" /></el-form-item>
            <el-form-item :label="t('siteLogo')"><el-input v-model="basic.logo" /></el-form-item>
            <el-form-item :label="t('footerCopyright')"><el-input v-model="basic.copyright" /></el-form-item>
            <el-form-item><el-button type="primary" @click="save">{{ t('saveSettings') }}</el-button></el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane :label="t('securitySettings')">
          <el-form label-width="140px" style="max-width: 520px">
            <el-form-item :label="t('pwdComplexity')">
              <el-select v-model="security.pwdLevel" style="width: 100%">
                <el-option :label="t('pwdLow')" value="low" />
                <el-option :label="t('pwdMedium')" value="medium" />
                <el-option :label="t('pwdHigh')" value="high" />
              </el-select>
            </el-form-item>
            <el-form-item :label="t('loginLockCount')">
              <el-input-number v-model="security.lockCount" :min="3" :max="10" /> {{ t('times') }}
            </el-form-item>
            <el-form-item :label="t('sessionTimeout')">
              <el-input-number v-model="security.timeout" :min="5" :max="120" /> {{ t('minutes') }}
            </el-form-item>
            <el-form-item><el-button type="primary" @click="save">{{ t('saveSettings') }}</el-button></el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane :label="t('themeSettings')">
          <el-form label-width="100px" style="max-width: 500px">
            <el-form-item :label="t('themeColor')"><el-color-picker v-model="theme.primary" /></el-form-item>
            <el-form-item :label="t('navMode')">
              <el-radio-group v-model="theme.navMode">
                <el-radio value="sidebar">{{ t('sidebar') }}</el-radio>
                <el-radio value="top">{{ t('topNav') }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="t('fixedHeader')"><el-switch v-model="theme.fixedHeader" /></el-form-item>
            <el-form-item :label="t('showTags')"><el-switch v-model="theme.showTags" /></el-form-item>
            <el-form-item><el-button type="primary" @click="save">{{ t('saveSettings') }}</el-button></el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from '@/locales'
const { t } = useI18n()

const basic = reactive({ siteName: 'Admin Pro', logo: '', copyright: '© 2026 Admin Pro' })
const security = reactive({ pwdLevel: 'medium', lockCount: 5, timeout: 30 })
const theme = reactive({ primary: '#409EFF', navMode: 'sidebar', fixedHeader: true, showTags: true })

function save() { ElMessage.success(t('saveSettings')) }
</script>
