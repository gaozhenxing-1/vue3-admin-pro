<template>
  <div class="error-page">
    <div class="error-content">
      <h1 class="error-code">404</h1>
      <p class="error-desc">{{ t('pageNotFound') }}</p>
      <el-button type="primary" @click="$router.push('/dashboard')">{{ t('backHome') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '@/locales'
const { t } = useI18n()
</script>

<style scoped lang="scss">
.error-page { display: flex; justify-content: center; align-items: center; height: 100vh; background: var(--bg-main, #f0f2f5); }
.error-content { text-align: center; }
.error-code { font-size: 120px; font-weight: 700; color: var(--el-color-primary); line-height: 1; margin-bottom: 16px; }
.error-desc { font-size: 18px; color: var(--text-secondary, #909399); margin-bottom: 32px; }
</style>
