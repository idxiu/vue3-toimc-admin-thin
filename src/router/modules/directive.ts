import { t } from '@/hooks/useI18n'
import LayoutsDefault from '@/layouts/default.vue'
import type { AppRouteRecordRaw } from '../types'

const directiveRoutes: Array<AppRouteRecordRaw> = [
  {
    name: 'Directive',
    meta: {
      title: t('menu.directive.directive'),
      order: 41,
      icon: 'Paperclip'
    },
    path: '/directive',
    component: LayoutsDefault,
    redirect: '/directive/copy',
    children: [
      {
        name: 'copyDirective',
        path: 'copy',
        component: () => import('@/views/directives/copy/index.vue'),
        meta: {
          title: t('menu.directive.copyDirective')
        }
      },
      {
        name: 'debounceDirective',
        path: 'debounce',
        component: () => import('@/views/directives/debounce/index.vue'),
        meta: {
          title: t('menu.directive.debounceDirective')
        }
      },
      {
        name: 'throttleDirective',
        path: 'throttle',
        component: () => import('@/views/directives/throttle/index.vue'),
        meta: {
          title: t('menu.directive.throttleDirective')
        }
      },
      {
        name: 'draggableDirective',
        path: 'draggable',
        component: () => import('@/views/directives/draggable/index.vue'),
        meta: {
          title: t('menu.directive.draggableDirective')
        }
      },
      {
        name: 'longPressDirective',
        path: 'longPress',
        component: () => import('@/views/directives/longpress/index.vue'),
        meta: {
          title: t('menu.directive.longPressDirective')
        }
      },
      {
        name: 'waterMarkDirective',
        path: 'waterMark',
        component: () => import('@/views/directives/watermark/index.vue'),
        meta: {
          title: t('menu.directive.waterMarkDirective')
        }
      }
    ]
  }
]

export default directiveRoutes
