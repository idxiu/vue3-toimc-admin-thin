import { Random } from 'mockjs'

export function mixPics() {
  const mockData = [] as string[]
  for (let i = 0; i < 20; i++) {
    const result = Random.pick(['image', 'pic'])
    mockData.push(
      `https://toimc-online.obs.cn-east-3.myhuaweicloud.com/vue-toimc-admin/shotcuts/${result}` +
        (result === 'pic' ? Random.integer(1, 100) : Random.integer(1, 626)) +
        '.jpg'
    )
  }
  return mockData
}

// 图文列表
const listsData = [
  {
    url: '/api/public/lists',
    method: 'get',
    response: () => {
      const mockData = [] as any[]
      for (let i = 0; i < 20; i++) {
        mockData.push({
          id: Random.integer(1, 100),
          origin:
            'https://toimc-online.obs.cn-east-3.myhuaweicloud.com/vue-toimc-admin/shotcuts/pic' +
            Random.integer(1, 100) +
            '.jpg',
          title: Random.csentence(5, 10),
          content: Random.csentence(10, 30),
          createTime: Random.date('yyyy-MM-dd HH:mm:ss')
        })
      }

      return {
        code: 200,
        data: mockData,
        msg: '请求成功'
      }
    }
  },
  // 16:9的横图
  {
    url: '/api/public/images',
    method: 'get',
    response: () => {
      const mockData = [] as string[]
      for (let i = 0; i < 20; i++) {
        mockData.push(
          'https://toimc-online.obs.cn-east-3.myhuaweicloud.com/vue-toimc-admin/shotcuts/pic' +
            Random.integer(1, 100) +
            '.jpg'
        )
      }
      return {
        code: 200,
        data: mockData,
        msg: '请求成功'
      }
    }
  },
  // 美女图片，主要是9:16长的图片
  {
    url: '/api/public/beauty',
    method: 'get',
    response: () => {
      const mockData = [] as string[]
      for (let i = 0; i < 20; i++) {
        mockData.push(
          'https://toimc-online.obs.cn-east-3.myhuaweicloud.com/vue-toimc-admin/shotcuts/image' +
            Random.integer(1, 626) +
            '.jpg'
        )
      }
      return {
        code: 200,
        data: mockData,
        msg: '请求成功'
      }
    }
  },
  // 混合图片
  {
    url: '/api/public/mix',
    method: 'get',
    response: () => {
      const mockData = mixPics()
      return {
        code: 200,
        data: mockData,
        msg: '请求成功'
      }
    }
  }
]

export default listsData
