import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import App from './App.vue'
import router from './router'
import { initTheme } from './utils/theme'
import { initMock } from './api'
import { permission } from './directives/permission'
import './styles/index.scss'

// 在挂载前初始化主题，避免闪烁
initTheme()
initMock()

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(ElementPlus, { locale: zhCn })
app.use(router)
app.directive('permission', permission)
app.mount('#app')
