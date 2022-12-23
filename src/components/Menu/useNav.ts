import type { IconTypes } from '@/components/Icon/types'
import type { AppRouteRecordRaw } from '@/router/types'

import { asyncRoutes } from '@/router/index'
import { useRoute } from 'vue-router'

export function useNav() {
  // 给树形菜单添加key
  function genMenuKeys(menus: Array<AppRouteRecordRaw>, level = '0') {
    // 过滤隐藏菜单
    menus = menus.filter((item) => !item.meta?.hideMenu)
    menus.forEach((item, index) => {
      const key = level.indexOf('-') !== -1 ? `${level}${index}` : index + ''
      item.meta = {
        ...item.meta,
        key
      }
      if (item.children) {
        return (item.children = genMenuKeys(item.children, key + '-'))
      }
    })
    return menus
  }

  // 判断是否有子菜单
  function menuHasChildren(menu: AppRouteRecordRaw): boolean {
    return (
      !menu.meta?.hideMenu &&
      !!menu.children &&
      Reflect.has(menu, 'children') &&
      // 判断是否有子菜单，如果只有一个，直接显示父级菜单
      menu.children.length > 0 &&
      // 如果设置alone为true，则必须设置redirect属性
      !menu.meta?.alone
    )
  }

  // 获取菜单key
  function getIndex(item: AppRouteRecordRaw): string {
    return item.meta?.key as string
  }

  // 获取图标
  function getIcons(item) {
    return item.meta?.icon as IconTypes
  }

  // 获取所有菜单
  function getAllMenu() {
    return computed(() => asyncRoutes)
  }

  // 获取顶级菜单
  function getTopMenu() {
    return computed(() => {
      return asyncRoutes.map((item) => {
        const topMenuItem = {}
        Object.keys(item).forEach((key) => {
          if (key !== 'children') {
            topMenuItem[key] = item[key]
          }
        })
        return topMenuItem
      })
    })
  }

  // 获取子菜单
  function getSubMenu() {
    const route = useRoute()
    const curRoutePath = computed(() => route.path)
    return computed(() => {
      return (
        asyncRoutes.find((item) =>
          [item.path, item.redirect].includes('/' + curRoutePath.value.split('/')[1])
        )?.children || []
      )
    })
  }

  return {
    genMenuKeys,
    menuHasChildren,
    getIndex,
    getIcons,
    getAllMenu,
    getTopMenu,
    getSubMenu
  }
}
