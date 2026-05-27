<template>
  <div class="dashboard">
    <!-- 权限演示 -->
    <el-alert type="info" :closable="false" style="margin-bottom: 16px" show-icon>
      <template #title>
        <span
          >🔐 RBAC Demo — Current Role: <b>{{ userStore.roles[0] }}</b></span
        >
        <span style="margin-left: 16px">
          <el-tag v-if="hasRole('admin')" size="small" type="danger" style="margin: 2px"
            >Admin Only</el-tag
          >
          <el-tag v-if="hasRole('editor')" size="small" type="warning" style="margin: 2px"
            >Editor+</el-tag
          >
          <el-tag v-if="hasRole('guest')" size="small" type="info" style="margin: 2px"
            >Guest+</el-tag
          >
          <span style="margin-left: 8px; font-size: 12px; color: #909399"
            >← buttons visible by role</span
          >
        </span>
      </template>
    </el-alert>

    <el-row :gutter="16">
      <el-col v-for="card in statsCards" :key="card.key" :xs="24" :sm="12" :lg="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-info">
              <div class="stat-value">{{ card.value }}</div>
              <div class="stat-title">{{ t(card.key) }}</div>
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
      <el-col :xs="24" :lg="16">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <span>{{ t('visitTrend') }}</span>
              <el-radio-group v-model="chartPeriod" size="small" @change="updateLineChart">
                <el-radio-button value="week">{{ t('thisWeek') }}</el-radio-button>
                <el-radio-button value="month">{{ t('thisMonth') }}</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <v-chart :option="lineOption" autoresize />
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="8">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <span>{{ t('sourceDistribution') }}</span>
          </template>
          <v-chart :option="pieOption" autoresize />
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" style="margin-top: 16px">
      <el-col :xs="24" :lg="14">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <span>{{ t('orderTrend') }}</span>
          </template>
          <v-chart :option="barOption" autoresize />
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="10">
        <el-card shadow="hover" class="table-card">
          <template #header>
            <span>{{ t('recentOrders') }}</span>
          </template>
          <el-table :data="recentOrders" size="small">
            <el-table-column prop="orderNo" :label="t('orderNo')" width="100" />
            <el-table-column prop="customer" :label="t('customer')" width="80" />
            <el-table-column prop="amount" :label="t('amount')" width="80" />
            <el-table-column :label="t('orderStatus')" width="80">
              <template #default="{ row }">
                <el-tag :type="row.statusType" size="small">{{ t(row.statusKey) }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" style="margin-top: 16px">
      <el-col :xs="24" :lg="12">
        <el-card shadow="hover" class="table-card">
          <template #header>
            <span>{{ t('popularProducts') }}</span>
          </template>
          <el-table :data="popularProducts" size="small">
            <el-table-column type="index" width="50" />
            <el-table-column prop="name" :label="t('productName')" />
            <el-table-column prop="sales" :label="t('salesCount')" width="80" align="right" />
            <el-table-column :label="t('growth')" width="80" align="right">
              <template #default="{ row }">
                <span :style="{ color: row.growth > 0 ? '#67c23a' : '#f56c6c' }">
                  {{ row.growth > 0 ? '+' : '' }}{{ row.growth }}%
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="12">
        <el-card shadow="hover" class="table-card">
          <template #header>
            <span>{{ t('latestNews') }}</span>
          </template>
          <el-timeline>
            <el-timeline-item
              v-for="(item, i) in timeline"
              :key="i"
              :timestamp="item.time"
              placement="top"
              :color="item.color"
            >
              {{ t(item.key) }}
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart, PieChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import {
  User,
  ShoppingCart,
  DataAnalysis,
  Tickets,
  CaretTop,
  CaretBottom,
} from '@element-plus/icons-vue'
import { useI18n } from '@/locales'
import { useUserStore } from '@/stores'
const { t } = useI18n()
const userStore = useUserStore()
function hasRole(role: string) {
  return userStore.roles.includes(role)
}

use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
])

const chartPeriod = ref('week')

const statsCards = [
  { key: 'totalUsers', value: '12,680', icon: User, color: '#409eff', trend: 12 },
  { key: 'totalOrders', value: '3,452', icon: ShoppingCart, color: '#67c23a', trend: -3 },
  { key: 'totalVisits', value: '89,234', icon: DataAnalysis, color: '#e6a23c', trend: 28 },
  { key: 'totalMessages', value: '256', icon: Tickets, color: '#f56c6c', trend: 8 },
]

const weekData = {
  xAxis: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  visits: [820, 932, 901, 1290, 1330, 1020, 980],
  orders: [120, 145, 132, 188, 201, 160, 155],
}
const monthData = {
  xAxis: ['W1', 'W2', 'W3', 'W4'],
  visits: [3850, 4200, 5100, 4680],
  orders: [550, 620, 780, 690],
}

const lineOption = reactive({
  tooltip: { trigger: 'axis' },
  legend: { data: ['Visits', 'Orders'] },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'category', boundaryGap: false, data: weekData.xAxis },
  yAxis: { type: 'value' },
  series: [
    {
      name: 'Visits',
      type: 'line',
      data: weekData.visits,
      smooth: true,
      itemStyle: { color: '#409eff' },
      areaStyle: { color: 'rgba(64,158,255,0.1)' },
    },
    {
      name: 'Orders',
      type: 'line',
      data: weekData.orders,
      smooth: true,
      itemStyle: { color: '#67c23a' },
      areaStyle: { color: 'rgba(103,194,58,0.1)' },
    },
  ],
})

function updateLineChart() {
  const d = chartPeriod.value === 'week' ? weekData : monthData
  lineOption.xAxis = { type: 'category', boundaryGap: false, data: d.xAxis }
  lineOption.series[0].data = d.visits
  lineOption.series[1].data = d.orders
}

const pieOption = {
  tooltip: { trigger: 'item' },
  legend: { orient: 'vertical', left: 'left' },
  series: [
    {
      type: 'pie',
      radius: ['45%', '75%'],
      center: ['55%', '50%'],
      itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      emphasis: { label: { show: true, fontSize: 16, fontWeight: 'bold' } },
      data: [
        { value: 1048, name: 'Search' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Social' },
        { value: 484, name: 'Email' },
        { value: 300, name: 'Ads' },
      ],
    },
  ],
}

const barOption = {
  tooltip: { trigger: 'axis' },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'category', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
  yAxis: { type: 'value' },
  series: [
    {
      type: 'bar',
      data: [320, 450, 380, 520, 480, 610],
      itemStyle: { color: '#409eff', borderRadius: [4, 4, 0, 0] },
      barWidth: '50%',
    },
  ],
}

const recentOrders = [
  {
    orderNo: 'ORD-001',
    customer: '张三',
    amount: '¥299',
    statusType: 'success',
    statusKey: 'paid',
  },
  {
    orderNo: 'ORD-002',
    customer: '李四',
    amount: '¥580',
    statusType: 'success',
    statusKey: 'shipped',
  },
  {
    orderNo: 'ORD-003',
    customer: '王五',
    amount: '¥128',
    statusType: 'warning',
    statusKey: 'pending',
  },
  {
    orderNo: 'ORD-004',
    customer: '赵六',
    amount: '¥960',
    statusType: 'success',
    statusKey: 'paid',
  },
  {
    orderNo: 'ORD-005',
    customer: '孙七',
    amount: '¥450',
    statusType: 'danger',
    statusKey: 'refunded',
  },
]

const popularProducts = [
  { name: 'iPhone 16 Pro', sales: 2340, growth: 12.5 },
  { name: 'MacBook Air M4', sales: 1890, growth: 8.3 },
  { name: 'AirPods Pro 3', sales: 1560, growth: -2.1 },
  { name: 'iPad Mini 7', sales: 1230, growth: 15.8 },
  { name: 'Apple Watch X', sales: 980, growth: 5.6 },
]

const timeline = [
  { time: '2026-05-26', key: 'timeline1', color: '#409eff' },
  { time: '2026-05-20', key: 'timeline2', color: '#67c23a' },
  { time: '2026-05-15', key: 'timeline3', color: '#e6a23c' },
  { time: '2026-05-08', key: 'timeline4', color: '#f56c6c' },
  { time: '2026-05-01', key: 'timeline5', color: '#909399' },
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
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
