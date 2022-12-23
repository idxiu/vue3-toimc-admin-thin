import { t } from '@/hooks/useI18n'
import LayoutsDefault from '@/layouts/default.vue'
import type { AppRouteRecordRaw } from '../types'

const aboutRoutes: Array<AppRouteRecordRaw> = [
  {
    name: 'About',
    meta: {
      title: t('menu.about.title'),
      order: 100000,
      icon: 'InfoFilled',
      hideChildrenInMenu: true,
      alone: true
    },
    path: '/about',
    component: LayoutsDefault,
    redirect: '/about/index',
    children: [
      {
        name: 'AboutPage',
        path: 'index',
        meta: {
          title: t('menu.about.about-us')
        },
        component: () => import('@/views/about/index.vue')
      }
    ]
  }
]

export default aboutRoutes
