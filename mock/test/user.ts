export default [
  {
    url: '/api/getUserInfo',
    method: 'get',
    timeout: 2000,
    response: () => {
      return {
        code: 200,
        message: '',
        data: {
          'id|10000-11000': 0,
          username: '@cname',
          email: '@email',
          phone: /^1[385][1-9]\d{8}/
        }
      }
    }
  }
]