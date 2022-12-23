import { resultSuccess, resultError, baseUrl } from '../_util'

import { MockMethod } from 'vite-plugin-mock'

const deptList = (() => {
  const result: any[] = []

  // departName: '',//部门名称
  //parentId: '',//上级部门
  // orgCategory: '1',//组织类型 1公司 2部门 3 岗位
  // departOrder: '',//部门排序
  //   mobile: ''//手机号
  // address: '',//地址
  // memo: ''//备注

  for (let index = 0; index < 3; index++) {
    result.push({
      id: `${index}`,
      departName: ['华东分部', '华南分部', '西北分部'][index],
      departOrder: index + 1,
      orgCategory: '1',
      createTime: '@datetime',
      parentId: '0',
      mobile: '',
      address: '@city()',
      memo: '@cword(10,20)',
      children: (() => {
        const children: any[] = []
        for (let j = 0; j < 4; j++) {
          children.push({
            id: index + 1 + `${index}00${j}`,
            departName: ['研发部', '市场部', '商务部', '财务部'][j],
            parentId: `${index}`, //父级id
            'orgCategory|1': ['2', '3'], //组织类型 1公司 2部门 3 岗位
            departOrder: j + 1,
            createTime: '@datetime',
            mobile: '',
            address: '@city()',
            memo: '@cword(10,20)',
            children: undefined
          })
        }
        return children
      })()
    })
  }
  return result
})()

export default [
  {
    url: `${baseUrl}/sys/depart/queryTreeList`,
    timeout: 4000,
    method: 'get',
    response: () => {
      return resultSuccess(deptList)
    }
  },
  {
    url: `${baseUrl}/sys/sysDepart/add`,
    timeout: 1000,
    method: 'post',
    response: () => {
      return resultError('没有权限，请联系管理员授权')
    }
  },
  {
    url: `${baseUrl}/sys/sysDepart/edit`,
    timeout: 1000,
    method: 'put',
    response: () => {
      return resultError('没有权限，请联系管理员授权')
    }
  },
  {
    url: `${baseUrl}/sys/sysDepart/delete`,
    timeout: 1000,
    method: 'delete',
    response: () => {
      return resultError('没有权限，请联系管理员授权')
    }
  },
  {
    url: `${baseUrl}/sys/sysDepart/deleteBatch`,
    timeout: 1000,
    method: 'delete',
    response: () => {
      return resultError('没有权限，请联系管理员授权')
    }
  },
  {
    url: `${baseUrl}/sys/permission/queryDepartPermission`,
    timeout: 1000,
    method: 'get',
    response: () => {
      const obj = ['d7d6e2e4e2934f2c9385a623fd98c6f3', '1438108176814825473', '1214376304951664642']
      return resultSuccess([...obj])
    }
  },
  {
    url: `${baseUrl}/sys/permission/saveDepartPermission`,
    timeout: 1000,
    method: 'post',
    response: () => {
      return resultError('没有权限，请联系管理员授权')
    }
  }
] as MockMethod[]
