import type { RouteMeta } from 'vue-router'
export interface MenuItem {
  menuType: number //菜单类型: 0一级菜单 1子菜单 2按钮/权限
  name?: string //菜单名称/按钮/权限名称
  url?: string //访问路径
  component: any //前端组件
  redirect?: string //默认跳转地址
  icon?: string //菜单图标
  sortNo?: number //排序
  route?: boolean //是否路由菜单
  hidden?: boolean //隐藏路由
  hideTab?: boolean //隐藏Tab
  keepAlive?: boolean //是否缓存路由
  alwaysShow?: boolean //是否聚合路由
  internalOrExternal?: boolean //打开方式：true：外部路由 false:内部路由
  parentId?: string //上级菜单ID
  perms?: string //授权标识
  permsType?: string // 授权策略 1可见/可访问 2可编辑
  status?: string //状态 1 有效/0 无效

  id: string
  key: string
  createBy?: string
  meta: RouteMeta
  children?: MenuItem[]
}

/**
 * @description: Get menu return value
 */
export type getMenuListResultModel = MenuItem[]
