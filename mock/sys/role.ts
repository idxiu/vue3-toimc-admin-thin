import { resultSuccess, resultError, resultPageSuccess, baseUrl } from '../_util'
import { MockMethod } from 'vite-plugin-mock'

const treeList = (() => {
  const result: any[] = []
  for (let index = 0; index < 3; index++) {
    result.push({
      id: `${index}`,
      parentId: index + 1,
      name: ['首页', '表单', '系统管理'][index],
      children: (() => {
        const children: any[] = []
        if (index === 0) {
          for (let j = 0; j < 4; j++) {
            children.push({
              id: [
                '1111111111',
                '2222222222',
                '3333333333',
                '4444444444',
                '5555555555',
                '6666666666',
                '7777777777',
                '8888888888',
                '9999999999'
              ][j],
              parentId: index + 1,
              name: ['用户管理', '菜单管理', '角色管理', '部门管理'][j],
              children: undefined
            })
          }
        }

        return children
      })()
    })
  }
  return result
})()

const roleList = (() => {
  const result: any[] = []

  //  createBy: 'admin' //创建人
  //  createTime: '2021-11-04 15:45:26' //创建时间
  //  description: null //描述
  //  id: '1456165677820301314' //主键id
  //  roleCode: 'vue3' //角色编码
  //  roleName: 'VUE3角色' //角色名称
  //  updateBy: 'admin' //修改人
  //  updateTime: '2021-11-15 17:21:36' //修改时间

  for (let index = 0; index < 3; index++) {
    result.push({
      // id: /^1[000][1-9]\d{4}/,
      id: '1000' + index,
      roleCode: ['third_role', 'hr', 'admin', 'test'][index],
      roleName: ['第三方登录角色', '人力资源角色', '管理员', '临时角色'][index],
      createTime: '@datetime',
      description: '@cword(10,20)',
      createBy: 'admin',
      updateBy: 'admin',
      updateTime: '@datetime'
    })
  }
  return result
})()

export default [
  {
    url: `${baseUrl}/sys/role/queryTreeList`,
    timeout: 4000,
    method: 'get',
    response: () => {
      return resultSuccess(treeList)
    }
  },
  {
    url: `${baseUrl}/sys/role/list`,
    timeout: 4000,
    method: 'get',
    response: () => {
      return resultPageSuccess(1, 10, roleList)
    }
  },
  {
    url: `${baseUrl}/sys/role/queryAll`,
    timeout: 4000,
    method: 'get',
    response: () => {
      return resultPageSuccess(1, 10000, roleList)
    }
  },

  {
    url: `${baseUrl}/sys/permission/queryRolePermission`,
    timeout: 4000,
    method: 'get',
    response: () => {
      return resultSuccess([
        '1111111111',
        '2222222222',
        '3333333333',
        '4444444444',
        '5555555555',
        '6666666666',
        '7777777777',
        '8888888888',
        '9999999999'
      ])
    }
  },

  {
    url: `${baseUrl}/sys/permission/saveRolePermission`,
    timeout: 1000,
    method: 'post',
    response: () => {
      return resultError('没有权限，请联系管理员授权')
    }
  },
  {
    url: `${baseUrl}/sys/role/add`,
    timeout: 1000,
    method: 'post',
    response: () => {
      return resultError('没有权限，请联系管理员授权')
    }
  },
  {
    url: `${baseUrl}/sys/role/edit`,
    timeout: 1000,
    method: 'put',
    response: () => {
      return resultError('没有权限，请联系管理员授权')
    }
  },
  {
    url: `${baseUrl}/sys/role/delete`,
    timeout: 1000,
    method: 'delete',
    response: () => {
      return resultError('没有权限，请联系管理员授权')
    }
  },
  {
    url: `${baseUrl}/sys/role/deleteBatch`,
    timeout: 1000,
    method: 'delete',
    response: () => {
      return resultError('没有权限，请联系管理员授权')
    }
  }
] as MockMethod[]
