import { t } from '@/hooks/useI18n'
import LayoutsDefault from '@/layouts/default.vue'
import type { AppRouteRecordRaw } from '../types'

const chartsRoutes: Array<AppRouteRecordRaw> = [
  {
    name: 'Charts',
    meta: {
      title: t('menu.charts.title'),
      order: 50,
      icon: 'Histogram'
    },
    path: '/charts',
    component: LayoutsDefault,
    redirect: '/charts/baidu',
    children: [
      {
        name: 'BaiduCharts',
        path: 'baidu',
        meta: {
          title: t('menu.charts.baidu')
        },
        component: () => import('@/views/charts/baidu.vue')
      },
      {
        name: 'AmapCharts',
        path: 'amap',
        meta: {
          title: t('menu.charts.amap')
        },
        component: () => import('@/views/charts/amap.vue')
      },
      // todo
      // {
      //   name: '腾讯地图',
      //   path: 'tencent',
      //   meta: {
      //     title: t('menu.charts.tencent')
      //   },
      //   component: () => import('@/views/charts/tencent.vue')
      // },
      // 国内无法访问
      // {
      //   name: '谷歌地图',
      //   path: 'google',
      //   meta: {
      //     title: t('menu.charts.google')
      //   },
      //   component: () => import('@/views/charts/google.vue')
      // },
      {
        name: 'Echarts',
        path: 'echarts',
        meta: {
          title: t('menu.charts.echarts')
        },
        component: () => import('@/views/charts/echarts.vue')
      }
    ]
  }
]

export default chartsRoutes
