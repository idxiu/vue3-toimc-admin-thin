import { t } from '@/hooks/useI18n'
import LayoutsDefault from '@/layouts/default.vue'
import type { AppRouteRecordRaw } from '../types'

const systemRoutes: Array<AppRouteRecordRaw> = [
  {
    name: 'System',
    meta: {
      title: t('menu.system.title'),
      order: 200,
      icon: 'Setting'
    },
    path: '/system',
    component: LayoutsDefault,
    redirect: '/system/user',
    children: [
      {
        name: 'UsersPage',
        path: 'user',
        meta: {
          title: t('menu.system.user')
        },
        component: () => import('@/views/system/user/index.vue')
      },
      {
        name: 'RolesPage',
        path: 'role',
        meta: {
          title: t('menu.system.role')
        },
        component: () => import('@/views/system/role/index.vue')
      },
      {
        name: 'MenusPage',
        path: 'menu',
        meta: {
          title: t('menu.system.menu')
        },
        component: () => import('@/views/system/menu/index.vue')
      },
      {
        name: 'DepartmentPage',
        path: 'department',
        meta: {
          title: t('menu.system.department')
        },
        component: () => import('@/views/system/depart/index.vue')
      },
      {
        name: 'DictPage',
        path: 'dict',
        meta: {
          title: t('menu.system.dict')
        },
        component: () => import('@/views/system/dict/index.vue')
      },
      {
        name: 'LogsPage',
        path: 'logs',
        meta: {
          title: t('menu.system.logs')
        },
        component: () => import('@/views/system/system-logs/index.vue')
      }
    ]
  }
]

export default systemRoutes
