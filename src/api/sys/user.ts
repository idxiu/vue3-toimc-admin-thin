import axios from 'axios'
enum Api {
  userRoleList = '/api/sys/user/userRoleList',
  deleteUserRoleBatch = '/api/sys/user/deleteUserRoleBatch',
  add = '/api/sys/user/add',
  list = '/api/sys/user/list',
  deleteBatch = '/api/sys/user/deleteBatch',
  queryUserRole = '/api/sys/user/queryUserRole',
  edit = '/api/sys/user/edit',
  resetPassword = '/api/sys/user/resetPassword',
  frozenBatch = '/api/sys/user/frozenBatch'
}
//请求头
const headers = {
  authorization: 'Bearer ' + localStorage.getItem('token')
}

/**
 *  获取角色用户列表
 */
export const queryRoleUserList = (params) => {
  return new Promise((resolve) => {
    axios.get(Api.userRoleList, { params, headers }).then((res) => {
      resolve(res.data)
    })
  })
}

/**
 *  根据userId获取用户角色
 */
export const queryUserRole = (params) => {
  return new Promise((resolve) => {
    axios.get(Api.queryUserRole, { params, headers }).then((res) => {
      resolve(res.data)
    })
  })
}

/**
 * 批量删除用户
 */
export const deleteBatch = (data) => {
  return new Promise((resolve) => {
    axios.delete(Api.deleteBatch, { data, headers }).then((res) => {
      resolve(res.data)
    })
  })
}

/**
 * 批量删除角色用户（取消关联）
 */
export const deleteBatchUser = (data) => {
  return new Promise((resolve) => {
    axios.delete(Api.deleteUserRoleBatch, { data, headers }).then((res) => {
      resolve(res.data)
    })
  })
}
/**
 *  编辑用户
 */
export const editUser = (data) => {
  return new Promise((resolve) => {
    axios.put(Api.edit, data, { headers }).then((res) => {
      resolve(res.data)
    })
  })
}
/**
 *  重置用户密码
 */
export const resetPassword = (data) => {
  return new Promise((resolve) => {
    axios.put(Api.resetPassword, data, { headers }).then((res) => {
      resolve(res.data)
    })
  })
}
/**
 *  冻结用户
 */
export const frozenBatch = (data) => {
  return new Promise((resolve) => {
    axios.put(Api.frozenBatch, data, { headers }).then((res) => {
      resolve(res.data)
    })
  })
}

/**
 *  获取用户列表
 *
 */
// column: createTime
// order: desc
// pageNo: 1
// pageSize: 10
// username: *1*
// sex: 1
// realname: 3
// phone: 4
export const queryUserList = (params) => {
  return new Promise((resolve) => {
    axios.get(Api.list, { params, headers }).then((res) => {
      resolve(res.data)
    })
  })
}

/**
 * 添加用户
 */
// confirmPassword: '1234'
// departIds: ''
// password: '1234'
// phone: '13711111111'
// realname: '1234'
// selecteddeparts: '75de38f1ca3f483dbd3b2758993a9c3d,a7d7e77e06c84325a40932163adcdaa6,1e8b94aeeb134a978e6939c7325d77d5'
// selectedroles: '1456165677820301314'
// username: '123'
// workNo: '123'
export const addUser = (data) => {
  return new Promise((resolve) => {
    axios.post(Api.add, data, { headers }).then((res) => {
      resolve(res.data)
    })
  })
}
