<template>
  <div class="analytics-dashboard">
    <el-row :gutter="16">
      <el-col v-for="card in kpiCards" :key="card.key" :xs="24" :sm="12" :lg="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-info">
              <div class="stat-value">{{ card.value }}</div>
              <div class="stat-title">{{ card.label }}</div>
              <div class="stat-trend" :class="card.trend > 0 ? 'up' : 'down'">
                <el-icon><CaretTop v-if="card.trend > 0" /><CaretBottom v-else /></el-icon>
                {{ Math.abs(card.trend) }}%
              </div>
            </div>
            <div class="stat-icon" :style="{ background: card.color }">
              <el-icon :size="28" color="#fff"><component :is="card.icon" /></el-icon>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" style="margin-top: 16px">
      <el-col :xs="24" :lg="14">
        <el-card shadow="hover" class="chart-card">
          <template #header><span>过去30天访问趋势</span></template>
          <v-chart :option="lineOption" autoresize />
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="10">
        <el-card shadow="hover" class="chart-card">
          <template #header><span>设备分布</span></template>
          <v-chart :option="deviceBarOption" autoresize />
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" style="margin-top: 16px">
      <el-col :xs="24" :lg="10">
        <el-card shadow="hover" class="chart-card">
          <template #header><span>流量来源</span></template>
          <v-chart :option="trafficPieOption" autoresize />
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="14">
        <el-card shadow="hover" class="table-card">
          <template #header><span>Top 10 访问页面</span></template>
          <el-table :data="topPages" size="small">
            <el-table-column type="index" width="50" label="#" />
            <el-table-column prop="page" label="页面路径" />
            <el-table-column prop="pv" label="PV" width="100" align="right" sortable />
            <el-table-column prop="uv" label="UV" width="100" align="right" sortable />
            <el-table-column label="PV/UV" width="80" align="right">
              <template #default="{ row }">{{ (row.pv / row.uv).toFixed(1) }}</template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart, PieChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import {
  View,
  DataAnalysis,
  Timer,
  TrendCharts,
  CaretTop,
  CaretBottom,
} from '@element-plus/icons-vue'

use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
])

const kpiCards = [
  { key: 'pv', label: '页面浏览量 (PV)', value: '12,856', icon: View, color: '#409eff', trend: 12 },
  {
    key: 'uv',
    label: '独立访客 (UV)',
    value: '8,420',
    icon: DataAnalysis,
    color: '#67c23a',
    trend: 8,
  },
  {
    key: 'duration',
    label: '平均停留时长',
    value: '4m 32s',
    icon: Timer,
    color: '#e6a23c',
    trend: -3,
  },
  {
    key: 'bounce',
    label: '跳出率',
    value: '32.5%',
    icon: TrendCharts,
    color: '#f56c6c',
    trend: -5,
  },
]

const days = Array.from({ length: 30 }, (_, i) => `D${i + 1}`)
const pvData = [
  420, 380, 450, 520, 480, 560, 620, 580, 530, 490, 510, 590, 640, 610, 570, 550, 600, 680, 720,
  690, 650, 620, 660, 710, 750, 730, 700, 680, 740, 780,
]
const uvData = pvData.map((v) => Math.round(v * 0.65))

const lineOption = {
  tooltip: { trigger: 'axis' },
  legend: { data: ['PV', 'UV'] },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'category', boundaryGap: false, data: days },
  yAxis: { type: 'value' },
  series: [
    {
      name: 'PV',
      type: 'line',
      data: pvData,
      smooth: true,
      itemStyle: { color: '#409eff' },
      areaStyle: { color: 'rgba(64,158,255,0.1)' },
    },
    {
      name: 'UV',
      type: 'line',
      data: uvData,
      smooth: true,
      itemStyle: { color: '#67c23a' },
      areaStyle: { color: 'rgba(103,194,58,0.1)' },
    },
  ],
}

const deviceBarOption = {
  tooltip: { trigger: 'axis' },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'category', data: ['Desktop', 'Mobile', 'Tablet'] },
  yAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
  series: [
    {
      type: 'bar',
      data: [
        { value: 55, itemStyle: { color: '#409eff' } },
        { value: 35, itemStyle: { color: '#67c23a' } },
        { value: 10, itemStyle: { color: '#e6a23c' } },
      ],
      barWidth: '50%',
      itemStyle: { borderRadius: [4, 4, 0, 0] },
    },
  ],
}

const trafficPieOption = {
  tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
  legend: { orient: 'vertical', left: 'left' },
  series: [
    {
      type: 'pie',
      radius: ['45%', '75%'],
      center: ['55%', '50%'],
      itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold' } },
      data: [
        { value: 40, name: '搜索引擎' },
        { value: 30, name: '直接访问' },
        { value: 15, name: '社交媒体' },
        { value: 10, name: '邮件' },
        { value: 5, name: '广告' },
      ],
    },
  ],
}

const topPages = [
  { page: '/home', pv: 3240, uv: 2180 },
  { page: '/products', pv: 2860, uv: 1920 },
  { page: '/pricing', pv: 2150, uv: 1480 },
  { page: '/blog', pv: 1890, uv: 1350 },
  { page: '/about', pv: 1560, uv: 1120 },
  { page: '/contact', pv: 1320, uv: 980 },
  { page: '/docs', pv: 1180, uv: 860 },
  { page: '/faq', pv: 1050, uv: 790 },
  { page: '/careers', pv: 920, uv: 680 },
  { page: '/partners', pv: 780, uv: 560 },
]
</script>

<style scoped>
.stat-card {
  height: 118px;
  margin-bottom: 16px;
}
.stat-card :deep(.el-card__body) {
  height: 100%;
  display: flex;
  align-items: center;
}
.stat-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary, #303133);
  line-height: 1.2;
}
.stat-title {
  font-size: 14px;
  color: var(--text-secondary, #909399);
  margin-top: 2px;
}
.stat-trend {
  font-size: 12px;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 2px;
}
.stat-trend.up {
  color: #67c23a;
}
.stat-trend.down {
  color: #f56c6c;
}
.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.chart-card {
  height: 390px;
}
.chart-card :deep(.el-card__body) {
  height: calc(100% - 56px);
}
.table-card {
  height: 390px;
}
.table-card :deep(.el-card__body) {
  height: calc(100% - 56px);
  overflow-y: auto;
}
</style>
