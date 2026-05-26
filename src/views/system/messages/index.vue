<template>
  <div class="messages-page">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>{{ t('messageCenter') }}</span>
          <div>
            <el-badge :value="unreadCount" :hidden="unreadCount === 0" class="badge">
              <el-button size="small" @click="markAllRead" :disabled="unreadCount === 0">
                {{ t('markAllRead') }}
              </el-button>
            </el-badge>
          </div>
        </div>
      </template>

      <el-tabs v-model="activeTab">
        <el-tab-pane :label="`${t('allRead')} (${messages.length})`" name="all" />
        <el-tab-pane :label="`${t('unread')} (${unreadCount})`" name="unread" />
      </el-tabs>

      <div v-if="filteredMessages.length === 0" class="empty-state">
        <el-empty :description="t('noMessages')" />
      </div>

      <div v-else class="message-list">
        <div
          v-for="msg in filteredMessages"
          :key="msg.id"
          class="message-item"
          :class="{ unread: !msg.read }"
          @click="readMessage(msg)"
        >
          <div class="msg-avatar">
            <el-avatar :size="40" :style="{ background: msg.color }">
              <el-icon :size="20"><component :is="msg.icon" /></el-icon>
            </el-avatar>
          </div>
          <div class="msg-body">
            <div class="msg-header">
              <span class="msg-title">{{ msg.title }}</span>
              <span class="msg-time">{{ msg.time }}</span>
            </div>
            <div class="msg-content">{{ msg.content }}</div>
          </div>
          <div v-if="!msg.read" class="msg-dot" />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Bell, Warning, InfoFilled, CircleCheck, ChatLineSquare } from '@element-plus/icons-vue'
import { useI18n } from '@/locales'
const { t } = useI18n()

const activeTab = ref('all')

interface Message {
  id: number; title: string; content: string; time: string; read: boolean; color: string; icon: any
}

const messages = ref<Message[]>([
  { id: 1, title: '系统通知', content: '系统 V2.0 版本已成功上线，新增多项功能。', time: '10 分钟前', read: false, color: '#409eff', icon: Bell },
  { id: 2, title: '安全警告', content: '检测到来自 IP 192.168.1.100 的异常登录尝试。', time: '30 分钟前', read: false, color: '#e6a23c', icon: Warning },
  { id: 3, title: '任务完成', content: '数据备份任务已成功完成，共备份 12,580 条记录。', time: '1 小时前', read: false, color: '#67c23a', icon: CircleCheck },
  { id: 4, title: '新消息', content: '用户张三给你发了一条私信。', time: '2 小时前', read: true, color: '#909399', icon: ChatLineSquare },
  { id: 5, title: '系统维护', content: '系统将于今晚 02:00-04:00 进行例行维护。', time: '5 小时前', read: true, color: '#409eff', icon: InfoFilled },
  { id: 6, title: '审批通知', content: '你有一条新的审批待处理：用户权限变更申请。', time: '昨天', read: true, color: '#e6a23c', icon: Bell },
  { id: 7, title: '任务完成', content: '数据导出任务已完成，点击下载导出的文件。', time: '昨天', read: true, color: '#67c23a', icon: CircleCheck },
])

const unreadCount = computed(() => messages.value.filter((m) => !m.read).length)

const filteredMessages = computed(() => {
  return activeTab.value === 'unread' ? messages.value.filter((m) => !m.read) : messages.value
})

function readMessage(msg: Message) {
  msg.read = true
}

function markAllRead() {
  messages.value.forEach((m) => (m.read = true))
}
</script>

<style scoped lang="scss">
.card-header { display: flex; justify-content: space-between; align-items: center; }
.badge { margin-right: 8px; }
.empty-state { padding: 60px 0; }
.message-list { display: flex; flex-direction: column; }
.message-item {
  display: flex; align-items: center; padding: 14px 16px; border-bottom: 1px solid var(--border-light, #ebeef5);
  cursor: pointer; transition: background 0.2s; position: relative;
  &:hover { background: var(--fill-light, #f5f7fa); }
  &.unread { background: var(--el-color-primary-light-9); }
}
.msg-avatar { flex-shrink: 0; margin-right: 14px; }
.msg-body { flex: 1; min-width: 0; }
.msg-header { display: flex; justify-content: space-between; margin-bottom: 4px; }
.msg-title { font-weight: 600; font-size: 14px; color: var(--text-primary, #303133); }
.msg-time { font-size: 12px; color: var(--text-secondary, #909399); }
.msg-content { font-size: 13px; color: var(--text-secondary, #909399); }
.msg-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--el-color-primary); position: absolute; right: 16px; top: 50%; transform: translateY(-50%); }
</style>
