import { createApp } from 'vue'
import App from './App.vue'

// 全局样式
import '@/assets/style/index.scss'

// svg sprite setup
import 'virtual:svg-icons-register'

// 全局Element样式引入
import 'element-plus/dist/index.css'

// 导入所有的插件 -> 一般是全局注册的组件，比如icons
import * as plugins from './plugins/index'

import { setupStore } from '@/store'
import { setupRouter } from '@/router'
import { setupPlugins } from './utils/index'
import { setupDirectives } from './directive'
import { setupI18n } from './locales/setupI18n'

import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'

async function bootstrap() {
  const app = createApp(App)
  app.use(VXETable)

  // Configure store
  setupStore(app)

  // Multilingual configuration
  // Asynchronous case: language files may be obtained from the server side
  await setupI18n(app)
  // app.use(i18n)

  // Configure routing
  setupRouter(app)

  // todo
  // router-guard
  // Register global directive
  setupDirectives(app)
  // Configure global error handling

  // 全局插件注册
  // Register global components
  setupPlugins(app, plugins)

  app.mount('#app')
}

bootstrap()
