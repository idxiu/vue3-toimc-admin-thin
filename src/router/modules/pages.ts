import { t } from '@/hooks/useI18n'
import LayoutsDefault from '@/layouts/default.vue'
import type { AppRouteRecordRaw } from '../types'

const pagesRoutes: Array<AppRouteRecordRaw> = [
  {
    name: 'Pages',
    meta: {
      title: t('menu.pages.title'),
      order: 40,
      icon: 'CopyDocument'
    },
    path: '/page',
    component: LayoutsDefault,
    redirect: '/page/form/default',
    children: [
      {
        name: 'FormPages',
        path: 'form',
        component: () => import('@/layouts/blank.vue'),
        meta: {
          title: t('menu.pages.form.title')
        },
        children: [
          {
            name: 'DefaultFormPages',
            path: 'default',
            component: () => import('@/views/components/forms/basic.vue'),
            meta: {
              title: t('menu.pages.form.default')
            }
          }
        ]
      },
      {
        name: 'DetailPages',
        path: 'detail',
        component: () => import('@/layouts/blank.vue'),
        meta: {
          title: t('menu.pages.detail.title')
        },
        children: [
          {
            name: 'BasicDetailPage',
            path: 'basic',
            component: () => import('@/views/pages/details/basic.vue'),
            meta: {
              title: t('menu.pages.detail.basic')
            }
          },
          {
            name: 'SeniorDetailPage',
            path: 'senior',
            component: () => import('@/views/pages/details/senior.vue'),
            meta: {
              title: t('menu.pages.detail.senior')
            }
          }
        ]
      },
      {
        name: 'ResultPages',
        path: 'result',
        component: () => import('@/layouts/blank.vue'),
        redirect: '/page/result/success',
        meta: {
          title: t('menu.pages.result.title')
        },
        children: [
          {
            name: 'ResultSuccessPage',
            path: 'success',
            component: () => import('@/views/pages/result/success.vue'),
            meta: {
              title: t('menu.pages.result.success')
            }
          },
          {
            name: 'ResultFailPage',
            path: 'fail',
            component: () => import('@/views/pages/result/fail.vue'),
            meta: {
              title: t('menu.pages.result.fail')
            }
          }
        ]
      },
      {
        name: 'UserCenter',
        path: 'center',
        component: () => import('@/layouts/blank.vue'),
        meta: {
          title: t('menu.pages.users.title')
        },
        redirect: '/page/center/users',
        children: [
          {
            name: 'UsersPages',
            path: 'users',
            component: () => import('@/views/pages/user/index.vue'),
            meta: {
              title: t('menu.pages.users.user')
            }
          },
          {
            name: 'SettingsPages',
            path: 'settings',
            component: () => import('@/views/pages/user/setting.vue'),
            meta: {
              title: t('menu.pages.users.settings')
            }
          }
        ]
      },
      {
        name: 'ErrorsPages',
        path: 'errors',
        component: () => import('@/layouts/blank.vue'),
        meta: {
          title: t('menu.pages.errors.title'),
          alone: false
        },
        redirect: '/page/errors/default',
        children: [
          {
            name: 'Default404',
            path: 'default',
            component: () => import('@/views/pages/errors/default.vue'),
            meta: {
              title: t('menu.pages.errors.default')
            }
          }
        ]
      },
      {
        name: 'ListsPages',
        path: 'lists',
        component: () => import('@/layouts/blank.vue'),
        meta: {
          title: t('menu.pages.lists.title')
        },
        children: [
          {
            name: 'basicList',
            path: 'basic',
            component: () => import('@/views/pages/list/index.vue'),
            meta: {
              title: t('menu.pages.list.basic')
            }
          },
          {
            name: 'listCard',
            path: 'card',
            component: () => import('@/views/pages/list/card.vue'),
            meta: {
              title: t('menu.pages.list.card')
            }
          },
          {
            name: 'galleryList',
            path: 'gallery',
            component: () => import('@/views/pages/list/gallery.vue'),
            meta: {
              title: t('menu.pages.list.gallery')
            }
          }
        ]
      },
      {
        name: 'ExcelPages',
        path: 'excel',
        component: () => import('@/views/excel/Index.vue'),
        meta: {
          title: t('menu.pages.excel')
        }
      }
    ]
  }
]

export default pagesRoutes
