import LayoutsDefault from '@/layouts/default.vue'
import type { AppRouteRecordRaw } from '../types'
import { t } from '@/hooks/useI18n'

const homeRoutes: Array<AppRouteRecordRaw> = [
  {
    name: 'Home',
    meta: {
      title: t('menu.home'),
      order: 10,
      icon: 'House'
    },
    path: '/home',
    component: LayoutsDefault,
    redirect: '/home/dashboard',
    children: [
      {
        name: 'Welcome',
        path: 'welcome',
        component: () => import('@/views/dashboard/welcome/index.vue'),
        meta: {
          title: t('menu.overview'),
          affix: true
        }
      },
      {
        name: 'DashBoard',
        path: 'dashboard',
        component: () => import('@/views/dashboard/dashboard/index.vue'),
        meta: {
          title: t('menu.dashboard'),
          // 是否在侧边栏保留
          affix: false,
          keepAlive: true
        }
      }
    ]
  }
]

export default homeRoutes
