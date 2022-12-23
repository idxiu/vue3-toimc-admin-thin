import { t } from '@/hooks/useI18n'
import LayoutsDefault from '@/layouts/default.vue'
import type { AppRouteRecordRaw } from '../types'

const iframeRoutes: Array<AppRouteRecordRaw> = [
  {
    name: 'Iframe',
    meta: {
      title: t('menu.iframe.title'),
      order: 80,
      icon: 'Document'
    },
    path: '/iframe',
    component: LayoutsDefault,
    redirect: '/iframe',
    children: [
      {
        name: 'IframeIndex',
        path: 'iframe',
        component: () => import('@/views/iframe/index.vue'),
        meta: {
          title: t('menu.iframe.iframe'),
          frameSrc: 'https://toimc-team.github.io/notes-page/'
        }
      },
      {
        name: 'External',
        path: 'https://toimc-team.github.io/notes-page/',
        component: () => import('@/views/iframe/blank.vue'),
        meta: {
          title: t('menu.iframe.external')
        }
      }
    ]
  }
]

export default iframeRoutes
