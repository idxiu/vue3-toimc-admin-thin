import axios from 'axios'
enum Api {
  roleQueryTreeList = '/api/sys/depart/queryTreeList',
  save = '/api/sys/sysDepart/add',
  edit = '/api/sys/sysDepart/edit',
  delete = '/api/sys/sysDepart/delete',
  deleteBatch = '/api/sys/sysDepart/deleteBatch',
  getDepartPermission = '/api/sys/permission/queryDepartPermission',
  saveDepartPermission = '/api/sys/permission/saveDepartPermission'
}

const headers = {
  authorization: 'Bearer ' + localStorage.getItem('token')
}
/**
 *  获取权限树列表
 */
export const queryRoleTreeList = () => {
  return new Promise((resolve) => {
    axios.get(Api.roleQueryTreeList, { headers }).then((res) => {
      resolve(res.data)
    })
  })
}
/**
 * 删除部门
 */
export const deleteDepart = (data) => {
  return new Promise((resolve) => {
    axios.delete(Api.delete, { data, headers }).then((res) => {
      resolve(res.data)
    })
  })
}
/**
 * 批量删除部门
 */
export const deleteBatchDepart = (data) => {
  return new Promise((resolve) => {
    axios.delete(Api.deleteBatch, { data, headers }).then((res) => {
      resolve(res.data)
    })
  })
}
/**
 * 保存或者更新部门
 */
export const saveOrUpdateDepart = (params, isUpdate) => {
  if (isUpdate) {
    return new Promise((resolve) => {
      axios.put(Api.edit, params, { headers }).then((res) => {
        resolve(res.data)
      })
    })
  } else {
    return new Promise((resolve) => {
      axios.post(Api.save, params, { headers }).then((res) => {
        resolve(res.data)
      })
    })
  }
}
//查询部门权限
export const queryDepartPermission = (params) => {
  return new Promise((resolve) => {
    axios.get(Api.getDepartPermission, { params, headers }).then((res) => {
      resolve(res.data)
    })
  })
}
//保存更新部门权限
export const saveOrUpdateDepartPermission = (data) => {
  return new Promise((resolve) => {
    axios.post(Api.saveDepartPermission, data, { headers }).then((res) => {
      resolve(res.data)
    })
  })
}
