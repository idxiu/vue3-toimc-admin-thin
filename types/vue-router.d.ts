export {}

declare module 'vue-router' {
  interface RouteMeta extends Record<string | number | symbol, unknown> {
    order?: number
    // title
    title: string
    // Hide submenu
    hideChildrenInMenu?: boolean
    // 是否独立展示
    alone?: boolean
    // Whether to ignore permissions
    ignoreAuth?: boolean
    // role info
    roles?: RoleEnum[]
    // Whether not to cache
    ignoreKeepAlive?: boolean
    // icon on tab
    icon?: string
    // 链接
    frameSrc?: string
    // Never show in menu
    hideMenu?: boolean
    // Whether the route has been dynamically added
    hideBreadcrumb?: boolean
  }
}
