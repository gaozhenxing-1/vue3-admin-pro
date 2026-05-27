<template>
  <div class="drag-sort-page">
    <el-card>
      <template #header>
        <span>{{ t('dragSort') }}</span>
      </template>
      <p style="color: var(--text-secondary, #909399); margin-bottom: 16px">
        拖拽每行左侧手柄重新排序
      </p>
      <VueDraggable v-model="list" handle=".drag-handle" :animation="200" tag="div">
        <div v-for="item in list" :key="item.id" class="drag-item">
          <el-icon class="drag-handle" :size="18"><Rank /></el-icon>
          <el-tag
            type="info"
            size="small"
            style="margin-right: 12px; min-width: 40px; text-align: center"
          >
            {{ item.order }}
          </el-tag>
          <span style="flex: 1; font-weight: 500">{{ item.name }}</span>
          <span style="color: var(--text-secondary, #909399); font-size: 13px">{{
            item.desc
          }}</span>
        </div>
      </VueDraggable>
    </el-card>
    <el-card style="margin-top: 16px">
      <template #header>
        <span>{{ t('sortResult') }}</span>
      </template>
      <pre
        style="
          background: var(--fill-light, #f5f5f5);
          padding: 12px;
          border-radius: 6px;
          font-size: 13px;
          overflow-x: auto;
        "
        >{{
          JSON.stringify(
            list.map((l, i) => ({ ...l, order: i + 1 })),
            null,
            2,
          )
        }}</pre
      >
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { Rank } from '@element-plus/icons-vue'
import { useI18n } from '@/locales'

const { t } = useI18n()

const list = ref([
  { id: 1, name: '张三', order: 1, desc: '前端工程师' },
  { id: 2, name: '李四', order: 2, desc: '后端工程师' },
  { id: 3, name: '王五', order: 3, desc: 'UI设计师' },
  { id: 4, name: '赵六', order: 4, desc: '产品经理' },
  { id: 5, name: '孙七', order: 5, desc: '测试工程师' },
  { id: 6, name: '周八', order: 6, desc: '运维工程师' },
  { id: 7, name: '吴九', order: 7, desc: '数据分析师' },
  { id: 8, name: '郑十', order: 8, desc: '架构师' },
  { id: 9, name: '冯十一', order: 9, desc: '安全工程师' },
  { id: 10, name: '陈十二', order: 10, desc: 'DevOps工程师' },
])
</script>

<style scoped>
.drag-item {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  margin-bottom: 6px;
  background: var(--bg-main, #fafafa);
  border: 1px solid var(--border-light, #ebeef5);
  border-radius: 6px;
  transition: box-shadow 0.2s;
}
.drag-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.drag-handle {
  cursor: grab;
  color: var(--text-secondary, #909399);
  margin-right: 10px;
  flex-shrink: 0;
}
.drag-handle:active {
  cursor: grabbing;
}
</style>
