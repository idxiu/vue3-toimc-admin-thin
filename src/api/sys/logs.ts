import axios from 'axios'
enum Api {
  list = '/api/sys/log/list'
}

/**
 * @description: 日志列表
 */

export const getLogList = (params) => {
  return new Promise((resolve) => {
    const headers = {
      authorization: 'Bearer ' + localStorage.getItem('token')
    }
    axios.get(Api.list, { params, headers }).then((res) => {
      resolve(res.data)
    })
  })
}
