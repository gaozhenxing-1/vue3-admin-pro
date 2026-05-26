<template>
  <div class="files-page">
    <el-card shadow="hover">
      <div class="toolbar">
        <div class="toolbar-left">
          <el-button type="primary" @click="handleNewFolder">{{ t('newFolder') }}</el-button>
          <el-upload action="#" :show-file-list="false" :auto-upload="false" style="display: inline-block; margin-left: 8px">
            <el-button>{{ t('upload') }}</el-button>
          </el-upload>
        </div>
        <div class="toolbar-right">
          <el-input v-model="search" :placeholder="t('search')" clearable style="width: 220px" />
        </div>
      </div>

      <!-- 面包屑导航 -->
      <div class="path-nav" style="margin-top: 12px">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item @click="currentPath = ''">
            <el-icon><FolderOpened /></el-icon> {{ t('home') }}
          </el-breadcrumb-item>
          <el-breadcrumb-item v-for="(p, i) in pathParts" :key="i" @click="currentPath = pathParts.slice(0, i + 1).join('/')">
            {{ p }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <!-- 文件列表 -->
      <div class="file-grid" style="margin-top: 16px">
        <div v-for="item in filteredFiles" :key="item.name" class="file-card" @dblclick="item.isDir ? currentPath = item.path : null">
          <el-icon :size="36" :color="item.isDir ? '#e6a23c' : '#409eff'">
            <Folder v-if="item.isDir" />
            <Document v-else />
          </el-icon>
          <div class="file-name">{{ item.name }}</div>
          <div v-if="!item.isDir" class="file-meta">{{ item.size }}</div>
          <div class="file-actions">
            <el-button link size="small" @click.stop="ElMessage.info('预览 ' + item.name)">{{ t('preview') }}</el-button>
            <el-button link size="small" @click.stop="ElMessage.info('下载 ' + item.name)">{{ t('download') }}</el-button>
            <el-dropdown trigger="click" @command="(cmd: string) => ElMessage.info(cmd + ' ' + item.name)">
              <el-button link size="small">{{ t('more') }}<el-icon><ArrowDown /></el-icon></el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="rename">{{ t('rename') }}</el-dropdown-item>
                  <el-dropdown-item command="move">{{ t('move') }}</el-dropdown-item>
                  <el-dropdown-item command="delete" divided style="color: var(--el-color-danger)">{{ t('delete') }}</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Folder, Document, FolderOpened, ArrowDown } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useI18n } from '@/locales'
const { t } = useI18n()

const search = ref('')
const currentPath = ref('')

interface FileItem { name: string; isDir: boolean; size?: string; path: string }

const files: FileItem[] = [
  { name: 'documents', isDir: true, path: 'documents' },
  { name: 'images', isDir: true, path: 'images' },
  { name: 'videos', isDir: true, path: 'videos' },
  { name: 'project-plan.pdf', isDir: false, size: '2.4 MB', path: 'project-plan.pdf' },
  { name: 'api-doc.md', isDir: false, size: '156 KB', path: 'api-doc.md' },
  { name: 'screenshot-2026.png', isDir: false, size: '890 KB', path: 'screenshot-2026.png' },
  { name: 'database-backup.sql', isDir: false, size: '12.8 MB', path: 'database-backup.sql' },
  { name: 'readme.txt', isDir: false, size: '4 KB', path: 'readme.txt' },
  { name: 'logo.svg', isDir: false, size: '8 KB', path: 'logo.svg' },
  { name: 'presentation.pptx', isDir: false, size: '5.1 MB', path: 'presentation.pptx' },
]

const pathParts = computed(() => currentPath.value ? currentPath.value.split('/') : [])

const filteredFiles = computed(() => {
  let list = files
  if (currentPath.value) {
    list = files.filter((f) => f.path.startsWith(currentPath.value + '/'))
  }
  if (search.value) {
    list = list.filter((f) => f.name.toLowerCase().includes(search.value.toLowerCase()))
  }
  return list
})

function handleNewFolder() {
  ElMessage.success('新建文件夹功能')
}
</script>

<style scoped lang="scss">
.toolbar { display: flex; justify-content: space-between; align-items: center; }
.path-nav { cursor: pointer; }
.file-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; }
.file-card {
  display: flex; flex-direction: column; align-items: center; padding: 16px 8px;
  border: 1px solid var(--border-light, #ebeef5); border-radius: 8px; cursor: pointer;
  transition: all 0.2s;
  &:hover { border-color: var(--el-color-primary); box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
}
.file-name { margin-top: 8px; font-size: 13px; text-align: center; word-break: break-all; color: var(--text-primary, #303133); }
.file-meta { font-size: 12px; color: var(--text-secondary, #909399); margin-top: 2px; }
.file-actions { display: flex; gap: 2px; margin-top: 6px; opacity: 0; transition: opacity 0.2s; }
.file-card:hover .file-actions { opacity: 1; }
</style>
