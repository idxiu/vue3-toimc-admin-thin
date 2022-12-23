import { AppRouteRecordRaw } from '@/router/types'
import { defineStore } from 'pinia'
import { TABS_BAR_KEY } from '@/enums/cacheEnum'

export const useTabsStore = defineStore('tabsbar', {
  state: () => ({
    visitedRoutes: [] as AppRouteRecordRaw[]
  }),
  actions: {
    addVisitedRoute(route) {
      const target = this.visitedRoutes.find((item) => item.path === route.path)
      if (target) {
        if (route.fullPath !== target.fullPath) Object.assign(target, route)
        return
      }
      const saveRoute = Object.assign({}, route)
      saveRoute.matched && delete saveRoute.matched
      this.visitedRoutes.push(saveRoute)
    },
    delVisitedRoute(route) {
      this.visitedRoutes.forEach((item, index) => {
        if (item.path === route.path) this.visitedRoutes.splice(index, 1)
      })
    },
    delOthersVisitedRoute(route) {
      this.visitedRoutes = this.visitedRoutes.filter(
        (item) => item.meta.affix || item.path === route.path
      )
    },
    delLeftVisitedRoute(route) {
      let index = this.visitedRoutes.length
      this.visitedRoutes = this.visitedRoutes.filter((item) => {
        if (item.name === route.name) index = this.visitedRoutes.indexOf(item)
        return item.meta.affix || index <= this.visitedRoutes.indexOf(item)
      })
    },
    delRightVisitedRoute(route) {
      let index = this.visitedRoutes.length
      this.visitedRoutes = this.visitedRoutes.filter((item) => {
        if (item.name === route.name) index = this.visitedRoutes.indexOf(item)
        return item.meta.affix || index >= this.visitedRoutes.indexOf(item)
      })
    },
    delAllVisitedRoutes() {
      this.visitedRoutes = this.visitedRoutes.filter((item) => item.meta.affix)
    },
    updateVisitedRoute(route) {
      this.visitedRoutes.forEach((item) => {
        if (item.path === route.path) item = Object.assign(item, route)
      })
    }
  },
  persist: {
    key: TABS_BAR_KEY
  }
})
