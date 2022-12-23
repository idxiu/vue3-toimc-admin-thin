import { resultError, resultPageSuccess, baseUrl } from '../_util'
import { MockMethod } from 'vite-plugin-mock'

const dictList = (() => {
  const result: any[] = []
  for (let index = 0; index < 3; index++) {
    result.push({
      // id: /^1[000][1-9]\d{4}/,
      id: '1000' + index,
      dictName: ['会议室规模', '有效无效状态', '菜单类型', '机构类型'][index],
      dictCode: ['meeting_scale', 'valid_status', 'menu_type', 'org_category'][index],
      description: ['', '', '', '机构类型 1公司 2部门 3岗位'][index],

      createTime: '@datetime',
      createBy: 'admin',
      updateBy: 'admin',
      updateTime: '@datetime'
    })
  }
  return result
})()

const dictItemList = (() => {
  const result: any[] = []
  for (let index = 0; index < 4; index++) {
    result.push({
      id: /^1[000][1-9]\d{4}/,
      // id: '151883831037657088' + index,
      description: null,
      dictId: '1518838222442987522',
      itemText: ['test1', 'test2', 'test3', 'test4'][index],
      itemValue: '1',
      sortOrder: 1,
      status: 1,
      status_dictText: '启用',

      createTime: '@datetime',
      createBy: 'admin',
      updateBy: 'admin',
      updateTime: '@datetime'
    })
  }
  return result
})()

export default [
  {
    url: `${baseUrl}/sys/dict/list`,
    timeout: 4000,
    method: 'get',
    response: () => {
      return resultPageSuccess(1, 10, dictList)
    }
  },
  {
    url: `${baseUrl}/sys/dictItem/list`,
    timeout: 4000,
    method: 'get',
    response: () => {
      return resultPageSuccess(1, 10, dictItemList)
    }
  },
  {
    url: `${baseUrl}/sys/dict/add`,
    timeout: 1000,
    method: 'post',
    response: () => {
      return resultError('没有权限，请联系管理员授权')
    }
  },
  {
    url: `${baseUrl}/sys/dict/edit`,
    timeout: 1000,
    method: 'put',
    response: () => {
      return resultError('没有权限，请联系管理员授权')
    }
  },
  {
    url: `${baseUrl}/sys/dictItem/add`,
    timeout: 1000,
    method: 'post',
    response: () => {
      return resultError('没有权限，请联系管理员授权')
    }
  },
  {
    url: `${baseUrl}/sys/dictItem/edit`,
    timeout: 1000,
    method: 'put',
    response: () => {
      return resultError('没有权限，请联系管理员授权')
    }
  },
  {
    url: `${baseUrl}/sys/dict/delete`,
    timeout: 1000,
    method: 'delete',
    response: () => {
      return resultError('没有权限，请联系管理员授权')
    }
  },
  {
    url: `${baseUrl}/sys/dictItem/delete`,
    timeout: 1000,
    method: 'delete',
    response: () => {
      return resultError('没有权限，请联系管理员授权')
    }
  },
  {
    url: `${baseUrl}/sys/dict/deleteBatch`,
    timeout: 1000,
    method: 'delete',
    response: () => {
      return resultError('没有权限，请联系管理员授权')
    }
  }
] as MockMethod[]
