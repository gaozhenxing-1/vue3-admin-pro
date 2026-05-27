<template>
  <div class="watermark-page">
    <el-card>
      <template #header>
        <span>{{ t('watermark') }}</span>
      </template>
      <div
        style="
          display: flex;
          gap: 12px;
          align-items: flex-end;
          flex-wrap: wrap;
          margin-bottom: 16px;
        "
      >
        <div>
          <span style="font-size: 13px; color: var(--text-secondary, #909399)">{{
            t('watermarkText')
          }}</span>
          <el-input v-model="watermarkText" style="width: 220px; margin-top: 4px" />
        </div>
        <div>
          <span style="font-size: 13px; color: var(--text-secondary, #909399)"
            >{{ t('opacity') }}: {{ opacity }}</span
          >
          <el-slider v-model="opacity" :min="0.1" :max="0.3" :step="0.02" style="width: 160px" />
        </div>
        <el-button v-if="!showWatermark" type="primary" @click="applyWatermark">
          {{ t('applyWatermark') }}
        </el-button>
        <el-button v-else type="danger" @click="removeWatermark">
          {{ t('clearWatermark') }}
        </el-button>
      </div>
      <div ref="contentRef" class="watermark-area">
        <h3>示例内容区域</h3>
        <p>这是一段示例文本，用于演示水印效果。</p>
        <p>水印会覆盖在整个页面之上，不影响用户操作。</p>
        <p>
          使用 Canvas 生成半透明的水印文字，position: fixed + pointer-events: none 确保不影响交互。
        </p>
      </div>
    </el-card>
    <div
      v-if="showWatermark"
      class="watermark-layer"
      :style="{ backgroundImage: `url(${watermarkDataUrl})` }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from '@/locales'

const { t } = useI18n()

const watermarkText = ref('Admin Pro 水印')
const opacity = ref(0.15)
const showWatermark = ref(false)
const watermarkDataUrl = ref('')

function applyWatermark() {
  const canvas = document.createElement('canvas')
  canvas.width = 240
  canvas.height = 140
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.globalAlpha = opacity.value
  ctx.font = '16px sans-serif'
  ctx.fillStyle = '#000'
  ctx.rotate((-20 * Math.PI) / 180)
  ctx.fillText(watermarkText.value, 10, 100)
  watermarkDataUrl.value = canvas.toDataURL()
  showWatermark.value = true
}

function removeWatermark() {
  showWatermark.value = false
}
</script>

<style scoped>
.watermark-area {
  min-height: 200px;
  padding: 20px;
  background: var(--bg-main, #fafafa);
  border-radius: 8px;
  border: 1px dashed var(--border-light, #dcdfe6);
}
.watermark-area h3 {
  margin-top: 0;
}
.watermark-area p {
  color: var(--text-secondary, #909399);
  line-height: 1.8;
}
.watermark-layer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 9999;
  background-repeat: repeat;
}
</style>
