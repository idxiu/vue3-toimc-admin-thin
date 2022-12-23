import { App, Directive } from 'vue'

const modules = import.meta.glob('./modules/**/*.ts', {
  import: 'default',
  eager: true
})

const directives = {
  install: function (app: App<Element>) {
    Object.keys(modules).forEach((key) => {
      const mod = key.replace('./modules/', '').replace('.ts', '')
      app.directive(mod, modules[key] as Directive)
    })
  }
}

export function setupDirectives(app: App) {
  app.use(directives)
}
