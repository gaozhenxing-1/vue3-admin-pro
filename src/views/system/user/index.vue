<template>
  <div class="user-page">
    <el-card shadow="hover">
      <div class="search-bar">
        <el-input
          v-model="query.keyword"
          :placeholder="t('searchUsername')"
          clearable
          style="width: 240px"
          @clear="fetchData"
          @keyup.enter="fetchData"
        />
        <el-select
          v-model="query.status"
          :placeholder="t('allStatus')"
          clearable
          style="width: 130px; margin-left: 12px"
          @change="fetchData"
        >
          <el-option :label="t('enabled')" :value="true" />
          <el-option :label="t('disabled')" :value="false" />
        </el-select>
        <el-button
          v-permission="['admin']"
          type="primary"
          style="margin-left: 12px"
          @click="openDialog()"
        >
          <el-icon><Plus /></el-icon>{{ t('addUser') }}
        </el-button>
      </div>

      <el-table
        v-loading="loading"
        :data="tableData"
        border
        stripe
        style="width: 100%; margin-top: 16px"
      >
        <el-table-column type="index" :label="'#'" width="55" />
        <el-table-column prop="username" :label="t('username')" width="120" />
        <el-table-column prop="nickname" :label="t('nickname')" width="120" />
        <el-table-column prop="email" :label="t('email')" min-width="180" />
        <el-table-column :label="t('role')" width="100">
          <template #default="{ row }">
            <el-tag :type="row.role === 'admin' ? 'danger' : 'info'" size="small">
              {{ row.role === 'admin' ? t('admin') : t('normalUser') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="t('status')" width="80">
          <template #default="{ row }">
            <el-switch v-model="row.status" size="small" @change="toggleStatus(row)" />
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" :label="t('createdTime')" width="170" />
        <el-table-column :label="t('actions')" width="180" fixed="right">
          <template #default="{ row }">
            <el-button
              v-permission="['admin']"
              type="primary"
              link
              size="small"
              @click="openDialog(row)"
            >
              {{ t('edit') }}
            </el-button>
            <el-button
              v-permission="['admin']"
              type="danger"
              link
              size="small"
              @click="handleDelete(row)"
            >
              {{ t('delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="query.page"
          v-model:page-size="query.pageSize"
          :total="total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          background
          @change="fetchData"
        />
      </div>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? t('editUser') : t('addUser')"
      width="520px"
      destroy-on-close
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item :label="t('username')" prop="username">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item :label="t('nickname')" prop="nickname">
          <el-input v-model="form.nickname" />
        </el-form-item>
        <el-form-item :label="t('email')" prop="email">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item :label="t('role')" prop="role">
          <el-select v-model="form.role" style="width: 100%">
            <el-option :label="t('admin')" value="admin" />
            <el-option :label="t('normalUser')" value="user" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('status')">
          <el-switch v-model="form.status" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">{{ t('cancel') }}</el-button>
        <el-button type="primary" @click="handleSubmit">{{ t('confirm') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useI18n } from '@/locales'
const { t } = useI18n()

interface User {
  id?: number
  username: string
  nickname: string
  email: string
  role: string
  status: boolean
  createdAt?: string
}

const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()
const tableData = ref<User[]>([])
const total = ref(0)

const query = reactive({
  keyword: '',
  status: undefined as boolean | undefined,
  page: 1,
  pageSize: 10,
})
const form = reactive<User>({ username: '', nickname: '', email: '', role: 'user', status: true })
const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [{ type: 'email', message: '邮箱格式不正确', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
}

const mockUsers: User[] = Array.from({ length: 36 }, (_, i) => ({
  id: i + 1,
  username: `user_${i + 1}`,
  nickname: `用户${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: i < 2 ? 'admin' : 'user',
  status: i % 5 !== 0,
  createdAt: `2026-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')} 10:00`,
}))

function fetchData() {
  loading.value = true
  setTimeout(() => {
    let data = [...mockUsers]
    if (query.keyword)
      data = data.filter(
        (u) => u.username.includes(query.keyword!) || u.email.includes(query.keyword!),
      )
    if (query.status !== undefined) data = data.filter((u) => u.status === query.status)
    total.value = data.length
    const start = (query.page - 1) * query.pageSize
    tableData.value = data.slice(start, start + query.pageSize)
    loading.value = false
  }, 300)
}

function openDialog(row?: User) {
  isEdit.value = !!row
  Object.assign(
    form,
    row ? { ...row } : { username: '', nickname: '', email: '', role: 'user', status: true },
  )
  dialogVisible.value = true
}

function handleSubmit() {
  formRef.value?.validate((valid) => {
    if (valid) {
      if (isEdit.value) {
        const idx = mockUsers.findIndex((u) => u.id === form.id)
        if (idx !== -1) Object.assign(mockUsers[idx], form)
      } else {
        mockUsers.unshift({ ...form, id: Date.now(), createdAt: new Date().toLocaleString() })
      }
      dialogVisible.value = false
      fetchData()
    }
  })
}

function handleDelete(row: User) {
  ElMessageBox.confirm(t('deleteUserConfirm', { name: row.username }), t('confirm'), {
    type: 'warning',
  }).then(() => {
    const idx = mockUsers.findIndex((u) => u.id === row.id)
    if (idx !== -1) mockUsers.splice(idx, 1)
    fetchData()
  })
}

function toggleStatus(row: User) {
  ElMessage.success(
    row.status
      ? t('userEnabled', { name: row.username })
      : t('userDisabled', { name: row.username }),
  )
}

onMounted(fetchData)
</script>

<style scoped lang="scss">
.search-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
