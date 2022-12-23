export interface MenuProps {
  collapse?: boolean
  mode?: 'horizontal' | 'vertical'
  showIcons?: boolean
  width?: number | string
  menus?: Array<AppRouteRecordRaw>
}
