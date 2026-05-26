<template>
  <div class="role-page">
    <el-card shadow="hover">
      <div class="search-bar">
        <el-input v-model="search" :placeholder="t('search')" clearable style="width: 240px" />
        <el-button type="primary" style="margin-left: 12px" @click="openDialog()">{{ t('addRole') }}</el-button>
      </div>

      <el-table :data="filteredData" border stripe style="width: 100%; margin-top: 16px">
        <el-table-column type="index" width="55" />
        <el-table-column prop="name" :label="t('roleName')" width="140" />
        <el-table-column prop="code" :label="t('roleCode')" width="140" />
        <el-table-column prop="desc" :label="t('roleDesc')" min-width="200" show-overflow-tooltip />
        <el-table-column prop="userCount" :label="t('userCount')" width="80" align="center" />
        <el-table-column :label="t('permissions')" min-width="300">
          <template #default="{ row }">
            <el-tag v-for="p in row.permissions" :key="p" size="small" style="margin: 2px">{{ p }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="t('actions')" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="openDialog(row)">{{ t('edit') }}</el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">{{ t('delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="isEdit ? t('editRole') : t('addRole')" width="560px" destroy-on-close>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item :label="t('roleName')" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item :label="t('roleCode')" prop="code">
          <el-input v-model="form.code" />
        </el-form-item>
        <el-form-item :label="t('roleDesc')">
          <el-input v-model="form.desc" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item :label="t('assignPermission')">
          <el-tree
            ref="treeRef" :data="permissionTree" show-checkbox
            node-key="id" :default-checked-keys="form.permissionIds" default-expand-all
          />
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
import { ref, reactive, computed } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from '@/locales'
const { t } = useI18n()

interface Role { id?: number; name: string; code: string; desc: string; userCount: number; permissions: string[]; permissionIds: number[] }

const search = ref('')
const dialogVisible = ref(false); const isEdit = ref(false)
const formRef = ref<FormInstance>(); const treeRef = ref()
const form = reactive<Role>({ name: '', code: '', desc: '', userCount: 0, permissions: [], permissionIds: [] })
const rules: FormRules = {
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入角色编码', trigger: 'blur' }],
}

const permissionTree = [
  { id: 1, label: '仪表盘', children: [{ id: 11, label: '查看' }] },
  { id: 2, label: '用户管理', children: [{ id: 21, label: '查看' }, { id: 22, label: '新增' }, { id: 23, label: '编辑' }, { id: 24, label: '删除' }] },
  { id: 3, label: '角色管理', children: [{ id: 31, label: '查看' }, { id: 32, label: '新增' }, { id: 33, label: '编辑' }, { id: 34, label: '删除' }] },
  { id: 4, label: '系统设置', children: [{ id: 41, label: '查看' }, { id: 42, label: '修改' }] },
]

const mockRoles: Role[] = [
  { id: 1, name: '超级管理员', code: 'admin', desc: '拥有系统全部权限', userCount: 2, permissions: ['仪表盘', '用户管理', '角色管理', '系统设置'], permissionIds: [1,11,2,21,22,23,24,3,31,32,33,34,4,41,42] },
  { id: 2, name: '编辑', code: 'editor', desc: '可编辑内容', userCount: 5, permissions: ['仪表盘', '内容管理'], permissionIds: [1,11] },
  { id: 3, name: '访客', code: 'guest', desc: '只读权限', userCount: 12, permissions: ['仪表盘'], permissionIds: [1,11] },
]

const filteredData = computed(() => {
  if (!search.value) return mockRoles
  return mockRoles.filter((r) => r.name.includes(search.value) || r.code.includes(search.value))
})

function openDialog(row?: Role) {
  isEdit.value = !!row
  Object.assign(form, row ? JSON.parse(JSON.stringify(row)) : { name: '', code: '', desc: '', userCount: 0, permissions: [], permissionIds: [] })
  dialogVisible.value = true
}

function handleSubmit() {
  formRef.value?.validate((valid) => {
    if (valid) {
      if (isEdit.value) {
        const idx = mockRoles.findIndex((r) => r.id === form.id)
        if (idx !== -1) Object.assign(mockRoles[idx], JSON.parse(JSON.stringify(form)))
      } else {
        mockRoles.push({ ...JSON.parse(JSON.stringify(form)), id: Date.now() })
      }
      dialogVisible.value = false
    }
  })
}

function handleDelete(row: Role) {
  ElMessageBox.confirm(t('deleteRoleConfirm', { name: row.name }), t('confirm'), { type: 'warning' }).then(() => {
    const idx = mockRoles.findIndex((r) => r.id === row.id)
    if (idx !== -1) mockRoles.splice(idx, 1)
  })
}
</script>

<style scoped lang="scss">
.search-bar { display: flex; align-items: center; }
</style>
