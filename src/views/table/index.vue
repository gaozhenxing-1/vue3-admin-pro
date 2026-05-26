<template>
  <div class="adv-table">
    <el-card shadow="hover">
      <div class="filter-bar">
        <el-input
          v-model="filters.name"
          :placeholder="t('nickname')"
          clearable
          style="width:160px"
          @change="fetchData"
        />
        <el-select
          v-model="filters.role"
          :placeholder="t('role')"
          clearable
          style="width:140px"
          @change="fetchData"
        >
          <el-option :label="t('admin')" value="admin" /><el-option
            :label="t('normalUser')"
            value="user"
          /><el-option :label="t('editor')" value="editor" />
        </el-select>
        <el-select
          v-model="filters.status"
          :placeholder="t('status')"
          clearable
          style="width:120px"
          @change="fetchData"
        >
          <el-option :label="t('enabled')" value="active" /><el-option
            :label="t('disabled')"
            value="inactive"
          />
        </el-select>
        <el-button type="primary" @click="fetchData">{{ t('search') }}</el-button>
        <el-button @click="resetFilters">{{ t('reset') }}</el-button>
      </div>
      <div class="action-bar">
        <div class="action-left">
          <el-popover placement="bottom-start" :width="200" trigger="click">
            <template #reference
              ><el-button size="small"
                >{{ t('columnFilter') }} <el-icon><ArrowDown /></el-icon></el-button
            ></template>
            <el-checkbox-group
              v-model="visibleCols"
              style="display:flex;flex-direction:column;gap:6px"
            >
              <el-checkbox v-for="col in allColumns" :key="col.key" :label="col.key">{{
                col.label
              }}</el-checkbox>
            </el-checkbox-group>
          </el-popover>
          <span
            v-if="selectedRows.length"
            style="margin-left:12px;font-size:13px;color:var(--text-secondary,#909399)"
          >
            {{
              lang === 'zh-cn'
                ? `已选 ${selectedRows.length} 项`
                : `${selectedRows.length} selected`
            }}
          </span>
        </div>
        <div class="action-right">
          <el-button
            size="small"
            type="danger"
            plain
            :disabled="!selectedRows.length"
            @click="batchDelete"
            >{{ t('batchDelete') }}</el-button
          >
          <el-button size="small" @click="exportExcel">{{ t('export') }} Excel</el-button>
          <el-button size="small" @click="importExcel">{{ t('import') }} Excel</el-button>
        </div>
      </div>
      <el-table
        ref="tableRef"
        :data="tableData"
        border
        stripe
        row-key="id"
        style="width:100%;margin-top:12px"
        @selection-change="(rows: any[]) => selectedRows = rows"
      >
        <el-table-column type="selection" width="45" fixed="left" />
        <el-table-column type="index" :label="'#'" width="55" />
        <el-table-column
          v-if="visibleCols.includes('name')"
          prop="name"
          :label="t('nickname')"
          width="130"
        />
        <el-table-column
          v-if="visibleCols.includes('email')"
          prop="email"
          :label="t('email')"
          min-width="200"
        />
        <el-table-column v-if="visibleCols.includes('role')" :label="t('role')" width="100">
          <template #default="{ row }">
            <el-tag
              :type="row.role === 'admin' ? 'danger' : row.role === 'editor' ? 'warning' : 'info'"
              size="small"
            >
              {{
                row.role === 'admin'
                  ? t('admin')
                  : row.role === 'editor'
                  ? t('editor')
                  : t('normalUser')
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          v-if="visibleCols.includes('status')"
          :label="t('status')"
          width="80"
          align="center"
        >
          <template #default="{ row }"><el-switch v-model="row.status" size="small"/></template>
        </el-table-column>
        <el-table-column
          v-if="visibleCols.includes('phone')"
          prop="phone"
          label="Phone"
          width="140"
        />
        <el-table-column
          v-if="visibleCols.includes('created')"
          prop="created"
          :label="t('createdTime')"
          width="170"
          sortable
        />
        <el-table-column :label="t('actions')" width="120" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              link
              size="small"
              @click="ElMessage.info('编辑 ' + row.name)"
              >{{ t('edit') }}</el-button
            >
            <el-button type="danger" link size="small" @click="deleteRow(row)">{{
              t('delete')
            }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          background
          @change="fetchData"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { exportExcel as exportExcelUtil, importExcel as importExcelUtil } from '@/utils/excel'
import { useI18n } from '@/locales'
const { t, locale } = useI18n()
const lang = computed(() => locale.value)

interface Row {
  id: number
  name: string
  email: string
  role: string
  status: boolean
  phone: string
  created: string
}

const tableRef = ref()
const tableData = ref<Row[]>([])
const selectedRows = ref<Row[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const filters = reactive({ name: '', role: '', status: '' })
const allColumns = [
  { key: 'name', label: '昵称' },
  { key: 'email', label: '邮箱' },
  { key: 'role', label: '角色' },
  { key: 'status', label: '状态' },
  { key: 'phone', label: 'Phone' },
  { key: 'created', label: '创建时间' },
]
const visibleCols = ref(allColumns.map((c) => c.key))
const allData: Row[] = Array.from({ length: 55 }, (_, i) => ({
  id: i + 1,
  name: [
    '张三',
    '李四',
    '王五',
    '赵六',
    '孙七',
    '周八',
    '吴九',
    '郑十',
    'Alex',
    'Emma',
    'Liam',
    'Olivia',
    'Noah',
    'Sophia',
    'James',
  ][i % 15],
  email: `user${i + 1}@example.com`,
  role: i < 3 ? 'admin' : i < 7 ? 'editor' : 'user',
  status: i % 7 !== 0,
  phone: `138${String((Math.random() * 100000000) | 0).padStart(8, '0')}`,
  created: `2026-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')} 10:00`,
}))

function fetchData() {
  let data = [...allData]
  if (filters.name)
    data = data.filter((r) => r.name.toLowerCase().includes(filters.name.toLowerCase()))
  if (filters.role) data = data.filter((r) => r.role === filters.role)
  if (filters.status)
    data = data.filter((r) => (filters.status === 'active' ? r.status : !r.status))
  total.value = data.length
  tableData.value = data.slice((page.value - 1) * pageSize.value, page.value * pageSize.value)
}
function resetFilters() {
  Object.assign(filters, { name: '', role: '', status: '' })
  page.value = 1
  fetchData()
}
function deleteRow(row: Row) {
  ElMessageBox.confirm(`删除 ${row.name}？`, t('confirm'), { type: 'warning' }).then(() => {
    const idx = allData.findIndex((r) => r.id === row.id)
    if (idx !== -1) allData.splice(idx, 1)
    fetchData()
  })
}
function batchDelete() {
  ElMessageBox.confirm(`确认删除选中的 ${selectedRows.value.length} 项？`, t('confirm'), {
    type: 'warning',
  }).then(() => {
    selectedRows.value.forEach((r) => {
      const idx = allData.findIndex((d) => d.id === r.id)
      if (idx !== -1) allData.splice(idx, 1)
    })
    selectedRows.value = []
    fetchData()
  })
}
function exportCSV() {
  const cols = visibleCols.value
  const rows = tableData.value.map((r) =>
    cols
      .map((c) => {
        const v = (r as any)[c]
        return typeof v === 'boolean' ? (v ? 'Y' : 'N') : v
      })
      .join(','),
  )
  const csv = ['\uFEFF' + cols.join(','), ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `export-${Date.now()}.csv`
  a.click()
  URL.revokeObjectURL(a.href)
  ElMessage.success('导出成功')
}
onMounted(fetchData)
</script>

<style scoped>
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}
.action-left,
.action-right {
  display: flex;
  align-items: center;
  gap: 8px;
}
.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
