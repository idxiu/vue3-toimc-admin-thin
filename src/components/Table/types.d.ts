export interface ColumnOptions {
  // 列名
  label: string
  // 数据对应的key
  prop?: string
  width?: string | number
  height?: string | number
  align?: 'left' | 'right' | 'center'
  showOverflowTooltip?: boolean
  // 插槽名
  slot?: string
  fixed?: boolean | 'left' | 'right'
  // 操作列 -> 可以支持icon与button
  actionItems?: ActionType[]
  type?: ColumnTypes
  // 数据格式化
  format?: (value: any, row: any) => any
  // 额外属性
  attrs?: any
}

export type ColumnTypes =
  | ''
  | 'index'
  | 'tag'
  | 'progress'
  | 'avatar'
  | 'rate'
  | 'link'
  | 'image'
  | 'expand'

export interface ActionType {
  type?: 'button' | 'icon'
  attrs?: any
  text?: string
  class?: string
  icon?: string
  click: (scope: any) => void
}

export interface LoadingProps {
  text?: string
  spinner?: string
  svg?: string
  background?: string
  viewBox?: string
}

export type LayoutEnum = 'sizes' | 'prev' | 'pager' | 'next' | 'jumper' | 'total' | 'slot' | '->'

export interface PaginationProps {
  position?: string
  small?: boolean
  background?: boolean
  disabled?: boolean
  hideOnSinglePage?: boolean
  total?: number
  pageSize?: number
  // 总页数，与total，只用设置一个，推荐使用total
  pageCount?: number
  defaultPageSize?: number
  // 同page-sizes
  pageSizeOptions?: number[]
  pagerCount?: number
  currentPage?: number
  defaultCurrentPage?: number
  prevText?: string
  nextText?: string
  popperClass?: string
  layout?: LayoutEnum[]
  events?: {
    [key: string]: any
  }
}
