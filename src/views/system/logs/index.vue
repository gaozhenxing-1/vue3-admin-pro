<template>
  <div class="logs-page">
    <el-card shadow="hover">
      <div class="toolbar">
        <div class="toolbar-left">
          <el-select v-model="query.type" style="width: 140px" @change="fetchData">
            <el-option :label="t('loginLog')" value="login" />
            <el-option :label="t('operationLog')" value="operation" />
            <el-option :label="t('systemLogType')" value="system" />
          </el-select>
          <el-select v-model="query.level" style="width: 120px; margin-left: 12px" @change="fetchData">
            <el-option :label="t('info')" value="info" />
            <el-option :label="t('warning')" value="warn" />
            <el-option :label="t('error')" value="error" />
          </el-select>
          <el-date-picker
            v-model="query.date"
            type="daterange"
            :start-placeholder="t('activityTime')"
            :end-placeholder="t('activityTime')"
            style="margin-left: 12px; width: 260px"
            @change="fetchData"
          />
        </div>
        <div class="toolbar-right">
          <el-button @click="fetchData">{{ t('refresh') }}</el-button>
          <el-button type="danger" plain @click="handleClear">{{ t('clearLog') }}</el-button>
        </div>
      </div>

      <el-table v-loading="loading" :data="tableData" border stripe style="width: 100%; margin-top: 16px" max-height="520">
        <el-table-column type="index" width="55" />
        <el-table-column :label="t('logType')" width="110">
          <template #default="{ row }">
            <el-tag :type="row.type === 'login' ? 'success' : row.type === 'operation' ? '' : 'info'" size="small">
              {{ row.type === 'login' ? t('loginLog') : row.type === 'operation' ? t('operationLog') : t('systemLogType') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="t('logLevel')" width="80">
          <template #default="{ row }">
            <el-tag :type="row.level === 'error' ? 'danger' : row.level === 'warn' ? 'warning' : 'info'" size="small">
              {{ row.level === 'error' ? t('error') : row.level === 'warn' ? t('warning') : t('info') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="content" :label="t('logContent')" min-width="280" show-overflow-tooltip />
        <el-table-column prop="operator" :label="t('logOperator')" width="100" />
        <el-table-column prop="ip" :label="t('logIP')" width="140" />
        <el-table-column prop="time" :label="t('logTime')" width="170" sortable />
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="query.page" v-model:page-size="query.pageSize"
          :total="total" :page-sizes="[10,20,50]"
          layout="total, sizes, prev, pager, next" background @change="fetchData"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from '@/locales'
const { t } = useI18n()

const loading = ref(false)
const tableData = ref<any[]>([])
const total = ref(0)

const query = reactive({
  type: '' as string, level: '' as string, date: null as any, page: 1, pageSize: 10,
})

const mockLogs = Array.from({ length: 42 }, (_, i) => ({
  type: ['login', 'operation', 'system'][i % 3],
  level: ['info', 'info', 'warn', 'error'][i % 4],
  content: [
    '用户 admin 登录系统', '修改了用户 user_5 的信息', '删除了过期日志文件',
    '系统内存使用率达到 85%', '新增角色「编辑」', '导出用户列表',
    '用户 root 登录失败（密码错误）', '修改了系统设置中的主题色',
    '数据库连接超时，已自动重连', '批量导入 50 条用户数据',
  ][i % 10],
  operator: ['admin', 'system', 'root', 'editor'][i % 4],
  ip: `192.168.1.${(i % 254) + 1}`,
  time: `2026-0${(i % 5) + 1}-${String((i % 28) + 1).padStart(2, '0')} ${String(i % 24).padStart(2, '0')}:${String(i % 60).padStart(2, '0')}:00`,
}))

function fetchData() {
  loading.value = true
  setTimeout(() => {
    let data = [...mockLogs]
    if (query.type) data = data.filter((l) => l.type === query.type)
    if (query.level) data = data.filter((l) => l.level === query.level)
    total.value = data.length
    const start = (query.page - 1) * query.pageSize
    tableData.value = data.slice(start, start + query.pageSize)
    loading.value = false
  }, 200)
}

function handleClear() {
  ElMessageBox.confirm('确认清空所有日志？', t('confirm'), { type: 'warning' }).then(() => {
    ElMessage.success('日志已清空')
    total.value = 0
    tableData.value = []
  })
}

onMounted(fetchData)
</script>

<style scoped lang="scss">
.toolbar { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
.toolbar-left { display: flex; align-items: center; flex-wrap: wrap; gap: 4px; }
.pagination-wrapper { display: flex; justify-content: flex-end; margin-top: 16px; }
</style>
