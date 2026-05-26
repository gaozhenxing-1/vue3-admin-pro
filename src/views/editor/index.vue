<template>
  <div class="editor-page">
    <el-card shadow="hover">
      <template #header>
        <span>{{ t('richTextEditor') }}</span>
        <div style="float:right">
          <el-button size="small" @click="showHtml = !showHtml">{{ showHtml ? 'Preview' : 'HTML' }}</el-button>
          <el-button size="small" type="primary" @click="handleSave">Save</el-button>
        </div>
      </template>

      <!-- 工具栏 + 编辑区 -->
      <div v-if="editor" class="editor-wrapper">
        <div class="toolbar">
          <button @click="editor.chain().focus().toggleBold().run()" :class="{ active: editor.isActive('bold') }"><b>B</b></button>
          <button @click="editor.chain().focus().toggleItalic().run()" :class="{ active: editor.isActive('italic') }"><i>I</i></button>
          <button @click="editor.chain().focus().toggleUnderline().run()" :class="{ active: editor.isActive('underline') }"><u>U</u></button>
          <button @click="editor.chain().focus().toggleStrike().run()" :class="{ active: editor.isActive('strike') }"><s>S</s></button>
          <span class="sep" />
          <button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ active: editor.isActive('heading', { level: 1 }) }">H1</button>
          <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ active: editor.isActive('heading', { level: 2 }) }">H2</button>
          <button @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ active: editor.isActive('heading', { level: 3 }) }">H3</button>
          <span class="sep" />
          <button @click="editor.chain().focus().toggleBulletList().run()" :class="{ active: editor.isActive('bulletList') }">• List</button>
          <button @click="editor.chain().focus().toggleOrderedList().run()" :class="{ active: editor.isActive('orderedList') }">1. List</button>
          <button @click="editor.chain().focus().toggleBlockquote().run()" :class="{ active: editor.isActive('blockquote') }">❝</button>
          <button @click="editor.chain().focus().toggleCodeBlock().run()" :class="{ active: editor.isActive('codeBlock') }">&lt;/&gt;</button>
          <span class="sep" />
          <button @click="editor.chain().focus().setTextAlign('left').run()" :class="{ active: editor.isActive({ textAlign: 'left' }) }">≡</button>
          <button @click="editor.chain().focus().setTextAlign('center').run()" :class="{ active: editor.isActive({ textAlign: 'center' }) }">≡</button>
          <button @click="editor.chain().focus().setTextAlign('right').run()" :class="{ active: editor.isActive({ textAlign: 'right' }) }">≡</button>
          <span class="sep" />
          <button @click="addImage">🖼</button>
          <button @click="setLink">🔗</button>
          <button @click="editor.chain().focus().undo().run()">↩</button>
          <button @click="editor.chain().focus().redo().run()">↪</button>
        </div>
        <editor-content :editor="editor" class="editor-content" />
      </div>

      <!-- HTML 预览 -->
      <div v-if="showHtml" class="html-preview">
        <pre>{{ editor?.getHTML() }}</pre>
      </div>

      <!-- 上传预览区 -->
      <el-divider />
      <h4 style="margin-bottom:12px">{{ t('imageUpload') }}</h4>
      <el-upload
        action="#"
        list-type="picture-card"
        :auto-upload="false"
        :on-change="handleImageChange"
        :file-list="uploadFiles"
        :on-preview="previewImage"
        :on-remove="removeImage"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>
      <el-dialog v-model="previewVisible">
        <img :src="previewUrl" style="width:100%" />
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useI18n } from '@/locales'
const { t } = useI18n()

const showHtml = ref(false)
const previewVisible = ref(false)
const previewUrl = ref('')
const uploadFiles = ref<any[]>([])

const editor = useEditor({
  content: '<h2>Welcome to Admin Pro Editor</h2><p>Start typing here... This is a <strong>TipTap</strong> rich text editor with full formatting support.</p><ul><li>Bold, italic, underline, strikethrough</li><li>Headings, lists, blockquote, code</li><li>Text alignment</li><li>Image and link insertion</li></ul>',
  extensions: [
    StarterKit,
    Image,
    Underline,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Link.configure({ openOnClick: false }),
    Placeholder.configure({ placeholder: 'Write something...' }),
  ],
})

function addImage() {
  const url = window.prompt('Image URL:')
  if (url) editor.value?.chain().focus().setImage({ src: url }).run()
}

function setLink() {
  const url = window.prompt('Link URL:')
  if (url) editor.value?.chain().focus().setLink({ href: url }).run()
}

function handleSave() {
  const html = editor.value?.getHTML()
  console.log('Saved:', html)
  ElMessage.success('Content saved!')
}

function handleImageChange(file: any) {
  uploadFiles.value.push(file)
}

function previewImage(file: any) {
  previewUrl.value = file.url
  previewVisible.value = true
}

function removeImage() {
  // handled by el-upload
}

onBeforeUnmount(() => editor.value?.destroy())
</script>

<style scoped>
.editor-wrapper { border: 1px solid var(--border-light, #ebeef5); border-radius: 8px; overflow: hidden; }
.toolbar { display: flex; flex-wrap: wrap; gap: 2px; padding: 8px 10px; background: var(--fill-light, #f5f7fa); border-bottom: 1px solid var(--border-light, #ebeef5); }
.toolbar button { width: 32px; height: 32px; border: none; background: transparent; border-radius: 4px; cursor: pointer; font-size: 14px; color: var(--text-regular, #606266); display: flex; align-items: center; justify-content: center; }
.toolbar button:hover { background: var(--el-color-primary-light-9); color: var(--el-color-primary); }
.toolbar button.active { background: var(--el-color-primary); color: #fff; }
.sep { width: 1px; background: #dcdfe6; margin: 0 4px; }
.editor-content { padding: 16px 20px; min-height: 300px; max-height: 500px; overflow-y: auto; }
.editor-content :deep(.ProseMirror) { outline: none; min-height: 280px; }
.editor-content :deep(.ProseMirror p.is-editor-empty:first-child::before) { content: attr(data-placeholder); color: #c0c4cc; float: left; pointer-events: none; height: 0; }
.editor-content :deep(h1) { font-size: 24px; margin: 12px 0; }
.editor-content :deep(h2) { font-size: 20px; margin: 10px 0; }
.editor-content :deep(h3) { font-size: 16px; margin: 8px 0; }
.editor-content :deep(ul), .editor-content :deep(ol) { padding-left: 20px; }
.editor-content :deep(blockquote) { border-left: 3px solid var(--el-color-primary); padding-left: 12px; color: #888; margin: 8px 0; }
.editor-content :deep(pre) { background: #1e1e1e; color: #d4d4d4; padding: 12px; border-radius: 6px; font-size: 13px; }
.editor-content :deep(img) { max-width: 100%; border-radius: 4px; }
.html-preview { margin-top: 12px; padding: 12px; background: var(--fill-light, #f5f7fa); border-radius: 6px; max-height: 200px; overflow: auto; }
.html-preview pre { font-size: 12px; white-space: pre-wrap; word-break: break-all; }
</style>
