import type { App } from 'vue'
import type { AppRouteRecordRaw } from './types'

import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

import { sortMenu } from '@/utils'
import { USER_INFO_KEY } from '@/enums/cacheEnum'

const modules = import.meta.glob('./modules/**/*.ts', {
  import: 'default',
  eager: true
})

const routeModuleList: AppRouteRecordRaw[] = []

Object.keys(modules).forEach((key) => {
  const mod = modules[key] || {}
  const modList = Array.isArray(mod) ? [...mod] : [mod]
  routeModuleList.push(...modList)
})

// 公共路由
const publicRoutes = [
  {
    name: 'default',
    path: '/',
    redirect: '/login',
    meta: {
      title: '',
      hideMenu: true
    }
  },
  {
    name: 'RegisterLoginsPages',
    path: '/login',
    redirect: '/login/pwd',
    component: () => import('@/views/pages/login/index.vue'),
    meta: {
      hideMenu: true,
      title: '注册登录'
    },
    children: [
      {
        name: 'LoginPages',
        path: 'pwd',
        component: () => import('@/views/pages/login/login.vue'),
        meta: {
          title: '密码登录'
        }
      },
      {
        name: 'ScanPages',
        path: 'scan',
        component: () => import('@/views/pages/login/scan.vue'),
        meta: {
          title: '扫码登录'
        }
      },
      {
        name: 'RegPages',
        path: 'reg',
        component: () => import('@/views/pages/login/reg.vue'),
        meta: {
          title: '注册'
        }
      },
      {
        name: 'ForgetPages',
        path: 'forget',
        component: () => import('@/views/pages/login/forget.vue'),
        meta: {
          title: '忘记密码'
        }
      }
    ]
  }
]

export const asyncRoutes = sortMenu([...publicRoutes, ...routeModuleList])

const isHash = import.meta.env?.VITE_APP_ROUTE_MODE === 'hash'

const router = createRouter({
  history: isHash ? createWebHashHistory() : createWebHistory(),
  routes: asyncRoutes as unknown as RouteRecordRaw[],
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 })
})

router.beforeEach((to, _, next) => {
  const userInfoStr = localStorage.getItem(USER_INFO_KEY)
  const data = userInfoStr ? JSON.parse(userInfoStr) : {}

  // todo 后期需要加入鉴权逻辑
  const isAuth = data?.userInfo?.token ? true : false

  if (isAuth) {
    if (to.path.startsWith('/login')) {
      next({ path: '/home' })
    } else {
      next()
    }
  } else {
    if (to.path.startsWith('/login')) {
      next()
    } else {
      next({ path: '/login' })
    }
  }
})

// config router
export function setupRouter(app: App<Element>) {
  app.use(router)
}
