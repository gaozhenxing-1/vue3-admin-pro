<template>
  <div class="count-to-page">
    <el-row :gutter="16">
      <el-col v-for="card in cards" :key="card.label" :xs="24" :sm="12" :lg="6">
        <el-card shadow="hover" class="count-card">
          <div class="count-label">{{ card.label }}</div>
          <div class="count-value" :style="{ color: card.color }">
            {{ formatDisplay(card.current) }}
          </div>
          <div class="count-suffix">{{ card.suffix }}</div>
        </el-card>
      </el-col>
    </el-row>
    <div
      style="
        margin-top: 24px;
        text-align: center;
        display: flex;
        gap: 12px;
        justify-content: center;
      "
    >
      <el-button type="primary" @click="replay">{{ t('replay') }}</el-button>
      <el-button @click="randomize">{{ t('randomValue') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from '@/locales'

const { t } = useI18n()

interface CardState {
  label: string
  start: number
  end: number
  current: number
  suffix: string
  color: string
}
const cards = reactive<CardState[]>([
  { label: '总收入', start: 0, end: 12600, current: 0, suffix: '¥', color: '#409eff' },
  { label: '用户总数', start: 0, end: 3842, current: 0, suffix: '', color: '#67c23a' },
  { label: '订单数', start: 0, end: 1286, current: 0, suffix: '', color: '#e6a23c' },
  { label: '转化率', start: 0, end: 87, current: 0, suffix: '%', color: '#f56c6c' },
])

const duration = 2000
let animFrame = 0

function formatDisplay(val: number): string {
  return cards[0].end >= 1000 ? Math.floor(val).toLocaleString() : Math.floor(val).toString()
}

function animate() {
  const startTime = performance.now()
  function step(now: number) {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    cards.forEach((c) => {
      c.current = c.start + (c.end - c.start) * eased
    })
    if (progress < 1) {
      animFrame = requestAnimationFrame(step)
    }
  }
  cancelAnimationFrame(animFrame)
  animFrame = requestAnimationFrame(step)
}

function replay() {
  cards.forEach((c) => {
    c.start = 0
    c.current = 0
  })
  animate()
}

function randomize() {
  cards.forEach((c) => {
    c.start = 0
    c.current = 0
    c.end = Math.floor(Math.random() * 20000) + 100
  })
  animate()
}

animate()
</script>

<style scoped>
.count-card {
  text-align: center;
  padding: 24px 0;
}
.count-label {
  font-size: 14px;
  color: var(--text-secondary, #909399);
  margin-bottom: 8px;
}
.count-value {
  font-size: 36px;
  font-weight: 700;
  line-height: 1.3;
}
.count-suffix {
  font-size: 13px;
  color: var(--text-secondary, #909399);
  margin-top: 4px;
}
</style>
