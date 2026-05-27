<template>
  <div class="fullscreen-page">
    <el-card>
      <template #header>
        <span>{{ t('fullscreenWidget') }}</span>
      </template>
      <div ref="demoRef" class="fullscreen-demo">
        <div class="fullscreen-content">
          <h2>全屏区域演示</h2>
          <p>点击下方按钮切换全屏状态</p>
          <div class="color-blocks">
            <div v-for="c in colors" :key="c" :style="{ background: c }" class="color-block" />
          </div>
        </div>
      </div>
      <div style="text-align: center; margin-top: 16px">
        <el-button :type="isFullscreen ? 'danger' : 'primary'" @click="toggleFullscreen">
          <el-icon :size="16" style="margin-right: 4px">
            <FullScreen v-if="!isFullscreen" /><Aim v-else />
          </el-icon>
          {{ isFullscreen ? t('exitFullscreenBtn') : t('enterFullscreen') }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { FullScreen, Aim } from '@element-plus/icons-vue'
import { useI18n } from '@/locales'

const { t } = useI18n()

const demoRef = ref<HTMLElement>()
const isFullscreen = ref(false)

function onFullscreenChange() {
  isFullscreen.value = !!document.fullscreenElement
}

function toggleFullscreen() {
  if (isFullscreen.value) {
    document.exitFullscreen()
  } else {
    demoRef.value?.requestFullscreen()
  }
}

onMounted(() => document.addEventListener('fullscreenchange', onFullscreenChange))
onUnmounted(() => document.removeEventListener('fullscreenchange', onFullscreenChange))
</script>

<style scoped>
.fullscreen-demo {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  cursor: pointer;
}
.fullscreen-content {
  text-align: center;
  color: #fff;
}
.fullscreen-content h2 {
  margin: 0 0 8px;
  font-size: 24px;
}
.fullscreen-content p {
  opacity: 0.9;
  margin: 0 0 16px;
}
.color-blocks {
  display: flex;
  gap: 8px;
  justify-content: center;
}
.color-block {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 2px solid rgba(255, 255, 255, 0.3);
}
</style>
