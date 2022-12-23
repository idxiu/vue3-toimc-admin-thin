/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { MockMethod } from 'vite-plugin-mock'
import { resultSuccess, baseUrl } from '../_util'

export default [
  {
    url: `${baseUrl}/sys/common/upload`,
    timeout: 200,
    method: 'post',
    response: () => {
      const url = 'https://q1.qlogo.cn/g?b=qq&nk=190848757&s=640'
      return resultSuccess(url)
    }
  }
] as MockMethod[]
