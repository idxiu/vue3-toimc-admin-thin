import { defineStore } from 'pinia'
import { MenuProps } from '@/components/Menu/types'
import { useNav } from '@/components/Menu/useNav'
import { asyncRoutes } from '@/router/index'
const { genMenuKeys } = useNav()

export const useStore = defineStore('menu', {
  state: (): MenuProps => ({
    collapse: false,
    mode: 'vertical',
    menus: genMenuKeys(asyncRoutes)
  }),
  actions: {
    setCollapse(flag: boolean) {
      this.collapse = flag
    }
  }
})
