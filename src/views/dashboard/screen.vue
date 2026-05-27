<template>
  <div class="screen">
    <canvas ref="starCanvas" class="star-bg" />
    <div class="screen-header">
      <div class="header-left">
        <div class="header-glow" />
        <span class="header-title">{{ t('screenTitle') }}</span>
      </div>
      <div class="header-center">
        <span class="header-time">{{ now }}</span>
      </div>
      <div class="header-right">
        <span class="header-info">{{ t('screenRefresh') }} {{ refreshCount }}s</span>
        <el-button size="small" text class="back-btn" @click="$router.push('/dashboard')">
          {{ t('backToDash') }}
        </el-button>
      </div>
    </div>

    <div class="screen-body">
      <div class="top-row">
        <div
          v-for="card in topCards"
          :key="card.key"
          class="kpi-card"
          :style="{ '--glow': card.color }"
        >
          <div class="kpi-icon"><span v-html="card.icon" /></div>
          <div class="kpi-info">
            <div class="kpi-value"><AniNumber :to="card.value" /></div>
            <div class="kpi-title">{{ t(card.key) }}</div>
          </div>
          <div class="kpi-trend" :class="card.trend > 0 ? 'up' : 'down'">
            {{ card.trend > 0 ? '↑' : '↓' }}{{ Math.abs(card.trend) }}%
          </div>
        </div>
      </div>

      <div class="mid-row">
        <div class="panel panel-6">
          <div class="panel-head"><span class="dot dot-blue" />{{ t('realtimeTrend') }}</div>
          <v-chart :option="realtimeOption" autoresize />
        </div>
        <div class="panel panel-3">
          <div class="panel-head"><span class="dot dot-green" />转化率</div>
          <v-chart :option="gaugeOption" autoresize />
        </div>
        <div class="panel panel-3">
          <div class="panel-head"><span class="dot dot-orange" />实时订单</div>
          <v-chart :option="gaugeOption2" autoresize />
        </div>
      </div>

      <div class="bottom-row">
        <div class="panel panel-5">
          <div class="panel-head"><span class="dot dot-purple" />{{ t('regionSales') }}</div>
          <v-chart :option="bar3DOption" autoresize />
        </div>
        <div class="panel panel-5">
          <div class="panel-head"><span class="dot dot-red" />{{ t('salesRank') }}</div>
          <div class="rank-list">
            <div v-for="(item, i) in rankList" :key="i" class="rank-item">
              <span class="rank-num" :class="'top' + (i + 1)">{{ i + 1 }}</span>
              <span class="rank-name">{{ item.name }}</span>
              <span class="rank-val">{{ item.value.toLocaleString() }}</span>
              <div class="rank-bar-wrap">
                <div
                  class="rank-bar"
                  :style="{
                    width: (item.value / rankList[0].value) * 100 + '%',
                    background: item.color,
                    boxShadow: '0 0 8px ' + item.color,
                  }"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="panel panel-4">
          <div class="panel-head"><span class="dot dot-blue" />{{ t('userPortrait') }}</div>
          <v-chart :option="radarOption" autoresize />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart, RadarChart, GaugeChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  RadarComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'
import { useI18n } from '@/locales'
const { t, locale } = useI18n()

use([
  CanvasRenderer,
  LineChart,
  BarChart,
  RadarChart,
  GaugeChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  RadarComponent,
])

const starCanvas = ref<HTMLCanvasElement>()
const now = ref('')
const refreshCount = ref(0)
let timer: any = null

const AniNumber = {
  props: { to: Number },
  setup(props: { to: number }) {
    const val = ref(0)
    onMounted(() => {
      const s = performance.now()
      function tick(ts: number) {
        const p = Math.min((ts - s) / 1200, 1)
        val.value = Math.round(props.to * (1 - Math.pow(2, -10 * (p === 1 ? 1 : p))))
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    })
    return () => val.value.toLocaleString()
  },
}

let starTimer: any = null
function initStars() {
  const cvs = starCanvas.value
  if (!cvs) return
  const ctx = cvs.getContext('2d')!
  const w = (cvs.width = window.innerWidth)
  const h = (cvs.height = window.innerHeight)
  const stars: { x: number; y: number; r: number; v: number; a: number }[] = []
  for (let i = 0; i < 120; i++)
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.5 + 0.5,
      v: Math.random() * 0.4 + 0.1,
      a: Math.random(),
    })
  starTimer = setInterval(() => {
    ctx.clearRect(0, 0, w, h)
    stars.forEach((s) => {
      s.a += 0.01
      ctx.beginPath()
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(120,180,255,${0.3 + Math.sin(s.a) * 0.3})`
      ctx.fill()
      s.y -= s.v
      if (s.y < -5) {
        s.y = h + 5
        s.x = Math.random() * w
      }
    })
  }, 40)
}

function updateTime() {
  now.value = new Date().toLocaleString(locale.value === 'zh-cn' ? 'zh-CN' : 'en-US', {
    hour12: false,
  })
  refreshCount.value++
}
onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
  initStars()
})
onUnmounted(() => {
  clearInterval(timer)
  clearInterval(starTimer)
})

const topCards = [
  { key: 'totalVisits', value: 128456, icon: '👥', trend: 18.2, color: '#409eff' },
  { key: 'totalUsers', value: 36892, icon: '👤', trend: 12.5, color: '#67c23a' },
  { key: 'totalOrders', value: 9856, icon: '📦', trend: -3.8, color: '#e6a23c' },
  { key: 'totalRevenue', value: 2860000, icon: '💰', trend: 24.3, color: '#f56c6c' },
]

const glow = (c: string) => ({ shadowBlur: 10, shadowColor: c, shadowOffsetX: 0, shadowOffsetY: 0 })

const realtimeOption = {
  tooltip: { trigger: 'axis' },
  legend: { data: ['PV', 'UV', 'Orders'], textStyle: { color: '#8899bb' }, top: 5 },
  grid: { left: '3%', right: '4%', top: '45', bottom: '10' },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: [
      '00:00',
      '02:00',
      '04:00',
      '06:00',
      '08:00',
      '10:00',
      '12:00',
      '14:00',
      '16:00',
      '18:00',
      '20:00',
      '22:00',
    ],
    axisLabel: { color: '#556677' },
    axisLine: { lineStyle: { color: '#1a2a4a' } },
  },
  yAxis: {
    type: 'value',
    axisLabel: { color: '#556677' },
    splitLine: { lineStyle: { color: 'rgba(64,158,255,0.06)' } },
  },
  series: [
    {
      name: 'PV',
      type: 'line',
      data: [120, 200, 150, 300, 800, 1200, 1500, 1300, 1400, 1100, 900, 500],
      smooth: true,
      symbol: 'none',
      lineStyle: { ...glow('#409eff'), width: 2, color: '#409eff' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(64,158,255,0.2)' },
            { offset: 1, color: 'rgba(64,158,255,0)' },
          ],
        },
      },
    },
    {
      name: 'UV',
      type: 'line',
      data: [80, 120, 100, 200, 500, 800, 900, 850, 950, 700, 600, 350],
      smooth: true,
      symbol: 'none',
      lineStyle: { ...glow('#67c23a'), width: 2, color: '#67c23a' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(103,194,58,0.2)' },
            { offset: 1, color: 'rgba(103,194,58,0)' },
          ],
        },
      },
    },
    {
      name: 'Orders',
      type: 'line',
      data: [10, 15, 12, 25, 60, 90, 110, 100, 120, 85, 70, 40],
      smooth: true,
      symbol: 'none',
      lineStyle: { ...glow('#e6a23c'), width: 2, color: '#e6a23c' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(230,162,60,0.2)' },
            { offset: 1, color: 'rgba(230,162,60,0)' },
          ],
        },
      },
    },
  ],
}

const gaugeOption = {
  series: [
    {
      type: 'gauge',
      center: ['50%', '55%'],
      radius: '80%',
      startAngle: 210,
      endAngle: -30,
      min: 0,
      max: 100,
      axisLine: {
        lineStyle: {
          width: 18,
          color: [
            [0.3, '#67c23a'],
            [0.7, '#409eff'],
            [1, '#f56c6c'],
          ],
        },
      },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      pointer: { length: '65%', width: 5, itemStyle: { color: '#409eff' } },
      detail: {
        valueAnimation: true,
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        offsetCenter: [0, '60%'],
        formatter: '{value}%',
      },
      title: { offsetCenter: [0, '90%'], fontSize: 13, color: '#8899bb' },
      data: [{ value: 78.5, name: '转化率' }],
    },
  ],
}

const gaugeOption2 = {
  series: [
    {
      type: 'gauge',
      center: ['50%', '55%'],
      radius: '80%',
      startAngle: 210,
      endAngle: -30,
      min: 0,
      max: 2000,
      axisLine: {
        lineStyle: {
          width: 18,
          color: [
            [0.3, '#e6a23c'],
            [0.7, '#409eff'],
            [1, '#67c23a'],
          ],
        },
      },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      pointer: { length: '65%', width: 5, itemStyle: { color: '#67c23a' } },
      detail: {
        valueAnimation: true,
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        offsetCenter: [0, '60%'],
        formatter: '{value}',
      },
      title: { offsetCenter: [0, '90%'], fontSize: 13, color: '#8899bb' },
      data: [{ value: 1456, name: '实时订单' }],
    },
  ],
}

const bar3DOption = {
  tooltip: { trigger: 'axis' },
  legend: { data: ['Q1', 'Q2'], textStyle: { color: '#8899bb' }, top: 0, right: 10 },
  grid: { left: '3%', right: '8%', top: '30', bottom: '5', containLabel: true },
  xAxis: {
    type: 'value',
    axisLabel: { color: '#556677' },
    splitLine: { lineStyle: { color: 'rgba(64,158,255,0.06)' } },
  },
  yAxis: {
    type: 'category',
    data: ['北京', '上海', '广州', '深圳', '杭州', '成都'],
    axisLabel: { color: '#8899bb', fontSize: 11 },
    axisLine: { lineStyle: { color: '#1a2a4a' } },
  },
  series: [
    {
      name: 'Q1',
      type: 'bar',
      data: [860, 720, 650, 590, 480, 410],
      barGap: '30%',
      barWidth: 14,
      itemStyle: { color: '#409eff', borderRadius: [0, 4, 4, 0] },
      emphasis: { itemStyle: { ...glow('#409eff') } },
    },
    {
      name: 'Q2',
      type: 'bar',
      data: [780, 690, 590, 510, 420, 380],
      barWidth: 14,
      itemStyle: { color: '#67c23a', borderRadius: [0, 4, 4, 0] },
      emphasis: { itemStyle: { ...glow('#67c23a') } },
    },
  ],
}

const radarOption = {
  tooltip: {},
  radar: {
    center: ['50%', '55%'],
    radius: '62%',
    indicator: [
      { name: '消费力', max: 100 },
      { name: '活跃度', max: 100 },
      { name: '忠诚度', max: 100 },
      { name: '传播力', max: 100 },
      { name: '复购率', max: 100 },
    ],
    axisName: { color: '#556677' },
    splitArea: { areaStyle: { color: ['rgba(64,158,255,0.02)', 'rgba(64,158,255,0.05)'] } },
    splitLine: { lineStyle: { color: 'rgba(64,158,255,0.1)' } },
    axisLine: { lineStyle: { color: 'rgba(64,158,255,0.15)' } },
  },
  series: [
    {
      type: 'radar',
      symbol: 'circle',
      symbolSize: 4,
      data: [
        {
          value: [82, 75, 90, 68, 85],
          name: '核心用户',
          areaStyle: { color: 'rgba(64,158,255,0.25)' },
        },
      ],
      lineStyle: { ...glow('#409eff'), color: '#409eff', width: 2 },
      itemStyle: { ...glow('#409eff'), color: '#409eff' },
    },
  ],
}

const rankList = [
  { name: 'iPhone 16 Pro Max', value: 2340, color: '#f56c6c' },
  { name: 'MacBook Air M4', value: 1890, color: '#e6a23c' },
  { name: 'AirPods Pro 3', value: 1560, color: '#409eff' },
  { name: 'iPad Mini 7', value: 1230, color: '#67c23a' },
  { name: 'Apple Watch Ultra', value: 980, color: '#7C3AED' },
  { name: 'Mac Studio M4', value: 750, color: '#06B6D4' },
  { name: 'Vision Pro 2', value: 520, color: '#F59E0B' },
]
</script>

<style scoped>
.screen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  background: radial-gradient(ellipse at 20% 50%, #0d1b2a 0%, #060d18 40%, #020610 100%);
  color: #fff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.star-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}
.screen-header {
  position: relative;
  z-index: 2;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: linear-gradient(180deg, rgba(20, 40, 80, 0.5) 0%, transparent 100%);
  border-bottom: 1px solid rgba(64, 158, 255, 0.1);
  flex-shrink: 0;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.header-glow {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #409eff;
  box-shadow:
    0 0 12px #409eff,
    0 0 24px #409eff;
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%,
  100% {
    box-shadow:
      0 0 8px #409eff,
      0 0 16px #409eff;
  }
  50% {
    box-shadow:
      0 0 16px #409eff,
      0 0 32px #409eff;
  }
}
.header-title {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 6px;
  text-shadow: 0 0 20px rgba(64, 158, 255, 0.5);
}
.header-time {
  font-size: 15px;
  font-family: 'Courier New', monospace;
  color: #7eb8ff;
  letter-spacing: 1px;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}
.header-info {
  font-size: 11px;
  color: #3a5a7a;
}
.back-btn {
  color: #5a7a9a !important;
}
.screen-body {
  position: relative;
  z-index: 1;
  flex: 1;
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: hidden;
}
.top-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  flex-shrink: 0;
}
.kpi-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.01));
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.3s;
}
.kpi-card::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 10%;
  width: 80%;
  height: 2px;
  background: var(--glow);
  box-shadow: 0 0 8px var(--glow);
  animation: glow-line 3s infinite alternate;
}
@keyframes glow-line {
  from {
    opacity: 0.3;
  }
  to {
    opacity: 1;
  }
}
.kpi-card:hover {
  transform: translateY(-3px);
  border-color: var(--glow);
}
.kpi-icon {
  font-size: 32px;
  flex-shrink: 0;
}
.kpi-info {
  flex: 1;
  min-width: 0;
}
.kpi-value {
  font-size: 26px;
  font-weight: 800;
  font-family: 'Courier New', monospace;
  letter-spacing: 1px;
}
.kpi-title {
  font-size: 12px;
  color: #4a6a8a;
  margin-top: 2px;
}
.kpi-trend {
  font-size: 13px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 12px;
}
.kpi-trend.up {
  color: #67c23a;
  background: rgba(103, 194, 58, 0.1);
}
.kpi-trend.down {
  color: #f56c6c;
  background: rgba(245, 108, 108, 0.1);
}

.panel {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.015), rgba(255, 255, 255, 0.005));
  border: 1px solid rgba(64, 158, 255, 0.06);
  border-radius: 10px;
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
}
.panel-6 {
  flex: 6;
  min-width: 0;
}
.panel-5 {
  flex: 5;
  min-width: 0;
}
.panel-4 {
  flex: 4;
  min-width: 0;
}
.panel-3 {
  flex: 3;
  min-width: 0;
}
.panel-5 {
  flex: 5;
  min-width: 0;
}
.panel-head {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 1px;
  color: #7eb8ff;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}
.dot-blue {
  background: #409eff;
  box-shadow: 0 0 6px #409eff;
}
.dot-green {
  background: #67c23a;
  box-shadow: 0 0 6px #67c23a;
}
.dot-orange {
  background: #e6a23c;
  box-shadow: 0 0 6px #e6a23c;
}
.dot-red {
  background: #f56c6c;
  box-shadow: 0 0 6px #f56c6c;
}
.dot-purple {
  background: #7c3aed;
  box-shadow: 0 0 6px #7c3aed;
}
.mid-row,
.bottom-row {
  display: flex;
  gap: 10px;
  flex: 1;
  min-height: 0;
}
.mid-row > *,
.bottom-row > * {
  min-height: 0;
  overflow: hidden;
}

.rank-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.rank-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
}
.rank-num {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 11px;
  background: rgba(255, 255, 255, 0.03);
  color: #5a7a9a;
  flex-shrink: 0;
}
.rank-num.top1 {
  background: #f56c6c;
  color: #fff;
  box-shadow: 0 0 8px rgba(245, 108, 108, 0.5);
}
.rank-num.top2 {
  background: #e6a23c;
  color: #fff;
  box-shadow: 0 0 8px rgba(230, 162, 60, 0.5);
}
.rank-num.top3 {
  background: #409eff;
  color: #fff;
  box-shadow: 0 0 8px rgba(64, 158, 255, 0.5);
}
.rank-name {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #8899bb;
}
.rank-val {
  color: #7eb8ff;
  font-weight: 700;
  min-width: 55px;
  text-align: right;
  font-family: 'Courier New', monospace;
}
.rank-bar-wrap {
  flex: 2;
  height: 5px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 3px;
  overflow: hidden;
}
.rank-bar {
  height: 100%;
  border-radius: 3px;
  transition: width 1s ease-out;
}
.rank-list::-webkit-scrollbar {
  width: 2px;
}
.rank-list::-webkit-scrollbar-thumb {
  background: rgba(64, 158, 255, 0.15);
  border-radius: 1px;
}
</style>
