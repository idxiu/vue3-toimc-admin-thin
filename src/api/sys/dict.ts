import axios from 'axios'
enum Api {
  list = '/api/sys/dict/list',
  save = '/api/sys/dict/add',
  edit = '/api/sys/dict/edit',
  delete = '/api/sys/dict/delete',
  deleteBatch = '/api/sys/dict/deleteBatch',
  itemList = '/api/sys/dictItem/list',
  deleteConf = '/api/sys/dictItem/delete',
  saveConf = '/api/sys/dictItem/add',
  editConf = '/api/sys/dictItem/edit'
}
//请求头
const headers = {
  authorization: 'Bearer ' + localStorage.getItem('token')
}
/**
 *  获取字典列表
 */
export const queryDictList = (params) => {
  return new Promise((resolve) => {
    axios.get(Api.list, { params, headers }).then((res) => {
      resolve(res.data)
    })
  })
}
/**
 *  获取字典配置列表
 */
export const queryDictItemList = (params) => {
  return new Promise((resolve) => {
    axios.get(Api.itemList, { params, headers }).then((res) => {
      resolve(res.data)
    })
  })
}

/**
 * 保存或者更新字典
 */
export const saveOrUpdateDict = (params, isUpdate) => {
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
/**
 * 保存或者更新字典配置项
 */
export const saveOrUpdateDictItemConf = (params, isUpdate) => {
  if (isUpdate) {
    return new Promise((resolve) => {
      axios.put(Api.editConf, params, { headers }).then((res) => {
        resolve(res.data)
      })
    })
  } else {
    return new Promise((resolve) => {
      axios.post(Api.saveConf, params, { headers }).then((res) => {
        resolve(res.data)
      })
    })
  }
}

/**
 * 删除字典
 */
export const deleteDict = (data) => {
  return new Promise((resolve) => {
    axios.delete(Api.delete, { data, headers }).then((res) => {
      resolve(res.data)
    })
  })
}

/**
 * 删除字典
 */
export const deleteDictItemConf = (data) => {
  return new Promise((resolve) => {
    axios.delete(Api.deleteConf, { data, headers }).then((res) => {
      resolve(res.data)
    })
  })
}

/**
 * 批量删除字典
 */
export const deleteBatchDict = (data) => {
  return new Promise((resolve) => {
    axios.delete(Api.deleteBatch, { data, headers }).then((res) => {
      resolve(res.data)
    })
  })
}
