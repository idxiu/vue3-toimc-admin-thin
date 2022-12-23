export interface DictItem {
  id: string //主键id
  dictCode?: string //字典编码
  dictName?: string //字典名称
  description?: string //描述
  createBy?: string //创建人
  createTime?: string //创建时间
  updateBy?: string //修改人
  updateTime?: string //修改时间
}

export interface DictItems {
  id: string //主键id
  dictId?: string
  itemText?: string //字典项名称
  itemValue?: string //字典项值
  description?: string //描述
  sortOrder?: number //排序
  status?: number //状态
  status_dictText?: string //状态名称
  createBy?: string //创建人
  createTime?: string //创建时间
  updateBy?: string //修改人
  updateTime?: string //修改时间
}

/**
 * @description: Get Role return value
 */
export type getDictListResultModel = DictItem[]
