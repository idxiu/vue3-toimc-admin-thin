import { ColumnOptions } from '@/components/Table/types'
export const loginColumns = [
  // {
  //   type: 'selection',
  //   align: 'center'
  // },

  {
    label: '日志内容',
    prop: 'logContent',
    showOverflowTooltip: true,
    align: 'left'
  },
  {
    label: '操作人ID',
    prop: 'userid',
    align: 'center',
    width: 120
  },
  {
    label: '操作人',
    prop: 'username',
    align: 'center',
    width: 180
  },
  {
    label: 'IP',
    prop: 'ip',
    align: 'center',
    width: 150
  },
  {
    label: '耗时(毫秒)',
    prop: 'costTime',
    align: 'center',
    width: 100
  },
  {
    label: '创建时间',
    prop: 'createTime',
    align: 'center',
    width: 180,
    attrs: {
      sortable: true
    }
  },
  {
    label: '日志类型',
    prop: 'logType_dictText',
    align: 'center',
    width: 120
  }
] as ColumnOptions[]

export const actionColumns = [
  {
    type: 'expand',
    align: 'left',
    slot: 'expand'
  },
  ...loginColumns,
  {
    label: '操作',
    slot: 'action',
    align: 'center',
    width: 120
  }
] as ColumnOptions[]
