<template>
  <div class="clipboard-page">
    <el-card>
      <template #header>
        <span>{{ t('clipboard') }}</span>
      </template>
      <div style="display: flex; gap: 12px; margin-bottom: 16px">
        <el-input v-model="text" style="flex: 1" placeholder="输入要复制的内容..." />
        <el-button type="primary" @click="doCopy(text)">{{ t('copyToClipboard') }}</el-button>
      </div>

      <p style="font-size: 13px; color: var(--text-secondary, #909399); margin-bottom: 12px">
        快捷复制预设:
      </p>
      <div v-for="preset in presets" :key="preset.label" class="preset-item">
        <div class="preset-info">
          <el-tag size="small" type="info">{{ preset.label }}</el-tag>
          <code class="preset-code">{{
            preset.content.length > 60 ? preset.content.slice(0, 60) + '...' : preset.content
          }}</code>
        </div>
        <el-button size="small" @click="doCopy(preset.content)">{{ t('copy') }}</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from '@/locales'

const { t } = useI18n()

const text = ref('')

const presets = [
  { label: 'API Key', content: 'sk-pro-admin-8a7b3c2d-4e5f-6a7b-8c9d-0e1f2a3b4c5d' },
  {
    label: 'curl 命令',
    content: `curl -X POST "https://api.example.com/v1/users" \\\n  -H "Authorization: Bearer sk-xxx" \\\n  -H "Content-Type: application/json" \\\n  -d '{"name":"test","email":"test@example.com"}'`,
  },
  {
    label: 'Markdown 代码块',
    content:
      '```vue\n<template>\n  <div class="demo">\n    <h1>{{ title }}</h1>\n    <p>{{ description }}</p>\n  </div>\n</template>\n```',
  },
  {
    label: '配置 JSON',
    content: JSON.stringify(
      {
        name: 'admin-pro',
        version: '1.0.0',
        theme: { primary: '#409eff', mode: 'light' },
        features: ['dashboard', 'table', 'form', 'editor'],
      },
      null,
      2,
    ),
  },
]

async function doCopy(content: string) {
  if (!content) return
  try {
    await navigator.clipboard.writeText(content)
    ElMessage.success(t('copySuccess'))
  } catch {
    ElMessage.error('复制失败')
  }
}
</script>

<style scoped>
.preset-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  margin-bottom: 8px;
  background: var(--bg-main, #fafafa);
  border: 1px solid var(--border-light, #ebeef5);
  border-radius: 6px;
  gap: 12px;
}
.preset-info {
  display: flex;
  align-items: center;
  gap: 10px;
  overflow: hidden;
}
.preset-code {
  font-size: 12px;
  color: var(--text-regular, #606266);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
