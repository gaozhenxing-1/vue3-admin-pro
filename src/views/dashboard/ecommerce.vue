<template>
  <div class="ecommerce-dashboard">
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
          <template #header><span>过去12个月销售额</span></template>
          <v-chart :option="salesBarOption" autoresize />
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="10">
        <el-card shadow="hover" class="chart-card">
          <template #header><span>订单转化漏斗</span></template>
          <v-chart :option="funnelOption" autoresize />
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" style="margin-top: 16px">
      <el-col :xs="24" :lg="14">
        <el-card shadow="hover" class="table-card">
          <template #header><span>热销商品 Top 8</span></template>
          <el-table :data="topProducts" size="small">
            <el-table-column type="index" width="50" label="#" />
            <el-table-column prop="name" label="商品名" />
            <el-table-column prop="sales" label="销量" width="100" align="right" sortable />
            <el-table-column prop="revenue" label="销售额" width="120" align="right" sortable />
            <el-table-column prop="stock" label="库存" width="80" align="right" />
          </el-table>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="10">
        <el-card shadow="hover" class="chart-card">
          <template #header><span>商品类目销售额占比</span></template>
          <v-chart :option="categoryDonutOption" autoresize />
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
  Money,
  ShoppingCart,
  ShoppingBag,
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
  { key: 'revenue', label: '总销售额', value: '$48,290', icon: Money, color: '#409eff', trend: 18 },
  {
    key: 'orders',
    label: '订单数',
    value: '1,286',
    icon: ShoppingCart,
    color: '#67c23a',
    trend: 12,
  },
  { key: 'aov', label: '客单价', value: '$37.55', icon: ShoppingBag, color: '#e6a23c', trend: 6 },
  { key: 'cvr', label: '转化率', value: '3.24%', icon: TrendCharts, color: '#f56c6c', trend: 0.8 },
]

const months = [
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
const salesData = [3200, 2800, 3600, 4200, 3800, 4500, 5100, 4800, 5200, 5800, 6200, 6800]
const lastYearData = [2900, 2600, 3200, 3800, 3500, 4100, 4600, 4300, 4700, 5200, 5500, 6000]

const salesBarOption = {
  tooltip: { trigger: 'axis' },
  legend: { data: ['今年', '去年'] },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'category', data: months },
  yAxis: { type: 'value', axisLabel: { formatter: '${value}' } },
  series: [
    {
      name: '今年',
      type: 'bar',
      data: salesData,
      itemStyle: { color: '#409eff', borderRadius: [4, 4, 0, 0] },
      barWidth: '45%',
    },
    {
      name: '去年',
      type: 'bar',
      data: lastYearData,
      itemStyle: { color: '#c0c4cc', borderRadius: [4, 4, 0, 0] },
      barWidth: '45%',
    },
  ],
}

const funnelOption = {
  tooltip: { trigger: 'item' },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'category', data: ['浏览', '加购', '下单', '支付'] },
  yAxis: { type: 'value' },
  series: [
    {
      type: 'bar',
      data: [
        { value: 10000, itemStyle: { color: '#409eff' } },
        { value: 4200, itemStyle: { color: '#67c23a' } },
        { value: 1800, itemStyle: { color: '#e6a23c' } },
        { value: 1286, itemStyle: { color: '#f56c6c' } },
      ],
      barWidth: '55%',
      itemStyle: { borderRadius: [4, 4, 0, 0] },
      label: { show: true, position: 'top', formatter: '{c}' },
    },
  ],
}

const topProducts = [
  { name: 'iPhone 16 Pro Max', sales: 520, revenue: '$62,400', stock: 128 },
  { name: 'MacBook Air M4', sales: 380, revenue: '$45,600', stock: 85 },
  { name: 'AirPods Pro 3', sales: 620, revenue: '$15,500', stock: 340 },
  { name: 'Apple Watch Ultra 3', sales: 290, revenue: '$23,200', stock: 56 },
  { name: 'iPad Pro M4', sales: 210, revenue: '$23,100', stock: 92 },
  { name: 'Magic Keyboard', sales: 450, revenue: '$11,250', stock: 180 },
  { name: 'Studio Display', sales: 85, revenue: '$13,600', stock: 42 },
  { name: 'Mac Mini M4', sales: 310, revenue: '$18,600', stock: 67 },
]

const categoryDonutOption = {
  tooltip: { trigger: 'item', formatter: '{b}: ${c}' },
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
        { value: 18500, name: '手机' },
        { value: 13200, name: '电脑' },
        { value: 8900, name: '配件' },
        { value: 6200, name: '平板' },
        { value: 4200, name: '穿戴' },
        { value: 2800, name: '其他' },
      ],
    },
  ],
}
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
