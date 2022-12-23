export interface DepartItem {
  id: string //主键id
  departName: string //部门名称
  parentId: string //上级部门
  orgCategory: string //组织类型 1公司 2部门 3 岗位
  departOrder: string //部门排序
  mobile: string //手机号
  address: string //地址
  memo: string //备注
}
export type getDepartListModel = DepartItem[]
