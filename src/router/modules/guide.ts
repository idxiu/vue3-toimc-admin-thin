import { t } from '@/hooks/useI18n'
import LayoutsDefault from '@/layouts/default.vue'
import type { AppRouteRecordRaw } from '../types'

const guideRoutes: Array<AppRouteRecordRaw> = [
  {
    name: 'Guide',
    meta: {
      title: t('menu.guide.title'),
      order: 300,
      icon: 'Help',
      hideChildrenInMenu: true,
      alone: true
    },
    path: '/guide',
    component: LayoutsDefault,
    redirect: '/guide/index',
    children: [
      {
        name: 'guidePage',
        path: 'index',
        meta: {
          title: t('menu.guide.guide')
        },
        component: () => import('@/views/guide/index.vue')
      }
    ]
  }
]

export default guideRoutes
