export interface RoleItem {
  id: string //主键id
  roleCode?: string //角色编码
  roleName?: string //角色名称
  createTime?: string //创建时间
  description?: string //描述
  createBy?: string //创建人
  updateBy?: string //修改人
  updateTime?: string //修改时间
}

/**
 * @description: Get Role return value
 */
export type getRoleListResultModel = RoleItem[]
