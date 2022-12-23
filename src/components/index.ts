import type { App } from 'vue'
import Icon from './Icon/index.vue'

export { default as Icon } from './Icon/index.vue'

// 注册全局组件
export function registerGlobComp(app: App) {
  app.component('Icon', Icon)
}

// export default {
//   Icon
// }
