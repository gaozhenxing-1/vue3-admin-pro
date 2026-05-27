<template>
  <div class="saas-dashboard">
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
          <template #header><span>MRR 增长趋势（6个月）</span></template>
          <v-chart :option="mrrAreaOption" autoresize />
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="10">
        <el-card shadow="hover" class="chart-card">
          <template #header><span>新用户 vs 流失用户（12个月）</span></template>
          <v-chart :option="userChurnOption" autoresize />
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" style="margin-top: 16px">
      <el-col :xs="24" :lg="10">
        <el-card shadow="hover" class="chart-card">
          <template #header><span>套餐分布</span></template>
          <v-chart :option="planBarOption" autoresize />
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="14">
        <el-card shadow="hover" class="table-card">
          <template #header><span>最近注册用户 Top 8</span></template>
          <el-table :data="recentUsers" size="small">
            <el-table-column type="index" width="50" label="#" />
            <el-table-column prop="name" label="用户名" />
            <el-table-column prop="email" label="邮箱" />
            <el-table-column prop="plan" label="套餐" width="100" align="center">
              <template #default="{ row }">
                <el-tag :type="row.planType" size="small">{{ row.plan }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="date" label="注册时间" width="110" align="right" />
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
import { Money, User, Warning, TrophyBase, CaretTop, CaretBottom } from '@element-plus/icons-vue'

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
  { key: 'mrr', label: 'MRR', value: '$12,450', icon: Money, color: '#409eff', trend: 22 },
  { key: 'dau', label: '活跃用户', value: '3,842', icon: User, color: '#67c23a', trend: 15 },
  { key: 'churn', label: '流失率', value: '2.1%', icon: Warning, color: '#e6a23c', trend: -1.2 },
  { key: 'ltv', label: 'LTV', value: '$680', icon: TrophyBase, color: '#f56c6c', trend: 8 },
]

const mrrMonths = ['1月', '2月', '3月', '4月', '5月', '6月']
const mrrData = [8200, 9100, 9800, 10500, 11400, 12450]

const mrrAreaOption = {
  tooltip: { trigger: 'axis' },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'category', boundaryGap: false, data: mrrMonths },
  yAxis: { type: 'value', axisLabel: { formatter: '${value}' } },
  series: [
    {
      type: 'line',
      data: mrrData,
      smooth: true,
      itemStyle: { color: '#409eff' },
      areaStyle: { color: 'rgba(64,158,255,0.2)' },
    },
  ],
}

const userMonths = [
  '1月',
  '2月',
  '3月',
  '4月',
  '5月',
  '6月',
  '7月',
  '8月',
  '9月',
  '10月',
  '11月',
  '12月',
]
const newUsers = [180, 210, 240, 230, 260, 290, 310, 280, 300, 320, 340, 350]
const churnedUsers = [30, 35, 40, 38, 45, 42, 48, 44, 50, 46, 52, 48]

const userChurnOption = {
  tooltip: { trigger: 'axis' },
  legend: { data: ['新用户', '流失用户'] },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'category', data: userMonths },
  yAxis: { type: 'value' },
  series: [
    {
      name: '新用户',
      type: 'bar',
      data: newUsers,
      itemStyle: { color: '#67c23a', borderRadius: [4, 4, 0, 0] },
      barWidth: '45%',
    },
    {
      name: '流失用户',
      type: 'bar',
      data: churnedUsers,
      itemStyle: { color: '#f56c6c', borderRadius: [4, 4, 0, 0] },
      barWidth: '45%',
    },
  ],
}

const planBarOption = {
  tooltip: { trigger: 'axis' },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'value', axisLabel: { formatter: '{value}%' }, max: 50 },
  yAxis: { type: 'category', data: ['Enterprise', 'Pro', 'Free'] },
  series: [
    {
      type: 'bar',
      data: [
        { value: 25, itemStyle: { color: '#f56c6c' } },
        { value: 35, itemStyle: { color: '#e6a23c' } },
        { value: 40, itemStyle: { color: '#409eff' } },
      ],
      barWidth: '50%',
      itemStyle: { borderRadius: [0, 4, 4, 0] },
      label: { show: true, position: 'right', formatter: '{c}%' },
    },
  ],
}

const recentUsers = [
  {
    name: 'Alice Chen',
    email: 'alice@example.com',
    plan: 'Pro',
    planType: 'warning',
    date: '2026-05-25',
  },
  {
    name: 'Bob Wang',
    email: 'bob@example.com',
    plan: 'Enterprise',
    planType: 'danger',
    date: '2026-05-24',
  },
  {
    name: 'Carol Li',
    email: 'carol@example.com',
    plan: 'Free',
    planType: 'info',
    date: '2026-05-23',
  },
  {
    name: 'David Zhang',
    email: 'david@example.com',
    plan: 'Pro',
    planType: 'warning',
    date: '2026-05-22',
  },
  { name: 'Eve Liu', email: 'eve@example.com', plan: 'Free', planType: 'info', date: '2026-05-21' },
  {
    name: 'Frank Wu',
    email: 'frank@example.com',
    plan: 'Enterprise',
    planType: 'danger',
    date: '2026-05-20',
  },
  {
    name: 'Grace Zhao',
    email: 'grace@example.com',
    plan: 'Pro',
    planType: 'warning',
    date: '2026-05-19',
  },
  {
    name: 'Henry Sun',
    email: 'henry@example.com',
    plan: 'Free',
    planType: 'info',
    date: '2026-05-18',
  },
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
