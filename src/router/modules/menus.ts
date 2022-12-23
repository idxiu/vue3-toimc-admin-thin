import { t } from '@/hooks/useI18n'
import LayoutsDefault from '@/layouts/default.vue'
import type { AppRouteRecordRaw } from '../types'

const componentsRoutes: Array<AppRouteRecordRaw> = [
  {
    name: 'MenusDemo',
    meta: {
      title: t('menu.nest-menus.title'),
      order: 70,
      icon: 'Guide'
    },
    path: '/menus',
    component: LayoutsDefault,
    redirect: '/menus/menu',
    children: [
      {
        name: 'Menus1',
        path: 'menu',
        meta: {
          title: t('menu.nest-menus.menu1')
        },
        component: () => import('@/views/menus/menu1.vue'),
        children: [
          {
            name: 'Menu1-1',
            path: 'menu1-1',
            component: () => import('@/views/menus/menu1-1.vue'),
            meta: {
              title: t('menu.nest-menus.menu1-1')
            },
            children: [
              {
                name: 'Menu1-1-1',
                path: 'menu1-1-1',
                component: () => import('@/views/menus/menu1-1-1.vue'),
                meta: {
                  title: t('menu.nest-menus.menu1-1-1')
                }
              }
            ]
          },
          {
            name: 'Menus1-2',
            path: 'menu1-2',
            component: () => import('@/views/menus/menu1-2.vue'),
            meta: {
              title: t('menu.nest-menus.menu1-2')
            }
          }
        ]
      },
      {
        name: 'Menus2',
        path: 'menu2',
        meta: {
          title: t('menu.nest-menus.menu2')
        },
        component: () => import('@/views/menus/menu2.vue')
      }
    ]
  }
]

export default componentsRoutes
