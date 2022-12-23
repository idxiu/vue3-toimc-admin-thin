import { resultPageSuccess, baseUrl } from '../_util'
import { MockMethod } from 'vite-plugin-mock'
const logList1 = (() => {
  const result: any[] = []
  for (let index = 0; index < 3; index++) {
    result.push({
      // id: /^1[000][1-9]\d{4}/,
      id: '1000' + index,
      logContent: '用户名: admin,登录成功！',
      userid: '@cword(2,5)',
      username: '@cword(4,10)',
      ip: '171.120.217.7' + index,
      costTime: 196,

      // 这是字典值
      logType: 1, //1 登录日志 2 操作日志
      logType_dictText: '登录日志',

      method: '', //请求方法
      //请求参数
      requestParam: '',
      requestType: '',
      requestUrl: '',

      createTime: '@datetime',
      createBy: 'admin',
      updateBy: 'admin',
      updateTime: '@datetime'
    })
  }
  return result
})()

const logList2 = (() => {
  const result: any[] = []
  for (let index = 0; index < 3; index++) {
    result.push({
      // id: /^1[000][1-9]\d{4}/,
      id: '1000' + index,
      logContent: '移动端编辑用户，id： a75d45a015c44384a04449ee80dc3503	,操作成功',
      userid: '@cword(2,5)',
      username: '@cword(4,10)',
      ip: '171.120.217.7' + index,
      costTime: 196,

      // 这是字典值
      logType: 2, //1 登录日志 2 操作日志
      logType_dictText: '操作日志',

      method: 'org.baidu.modules.user.controller.UserApiController.getUsers()', //请求方法
      //请求参数
      requestParam:
        'code: c981a65b827e4bfabf44df1eb16a7a83  request: org.apache.shiro.web.servlet.ShiroHttpServletRequest@171000c9',
      requestType: '',
      requestUrl: '',

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
    url: `${baseUrl}/sys/log/list`,
    timeout: 4000,
    method: 'get',
    response: ({ query }) => {
      console.log('list', query)
      const { logType } = query
      return logType == 1 ? resultPageSuccess(1, 10, logList1) : resultPageSuccess(1, 10, logList2)
    }
  }
] as MockMethod[]
