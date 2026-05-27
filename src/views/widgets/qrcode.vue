<template>
  <div class="qrcode-page">
    <el-row :gutter="16">
      <el-col :xs="24" :md="12">
        <el-card>
          <template #header>
            <span>{{ t('qrContent') }}</span>
          </template>
          <el-input v-model="qrText" type="textarea" :rows="4" placeholder="输入URL或文本..." />
          <div style="margin-top: 12px">
            <span style="font-size: 13px; color: var(--text-secondary, #909399); margin-right: 8px"
              >{{ t('presets') }}:</span
            >
            <el-button v-for="p in presets" :key="p.label" size="small" @click="qrText = p.url">
              {{ p.label }}
            </el-button>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="12">
        <el-card>
          <template #header>
            <span>{{ t('qrcode') }}</span>
          </template>
          <div class="qr-preview">
            <QrcodeVue :value="qrText || 'Admin Pro'" :size="220" level="M" />
          </div>
          <div style="text-align: center; margin-top: 12px">
            <el-button type="primary" @click="downloadQR">{{ t('downloadQR') }}</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import QrcodeVue from 'qrcode.vue'
import { useI18n } from '@/locales'

const { t } = useI18n()

const qrText = ref('https://github.com')
const presets = [
  { label: 'GitHub', url: 'https://github.com' },
  { label: 'Admin Pro', url: 'https://admin-pro.demo.com' },
  { label: '百度', url: 'https://www.baidu.com' },
]

function downloadQR() {
  const canvas = document.querySelector('.qr-preview canvas') as HTMLCanvasElement
  if (!canvas) return
  const a = document.createElement('a')
  a.href = canvas.toDataURL('image/png')
  a.download = 'qrcode.png'
  a.click()
}
</script>

<style scoped>
.qr-preview {
  display: flex;
  justify-content: center;
  padding: 16px;
}
</style>
