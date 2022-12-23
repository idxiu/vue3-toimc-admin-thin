<template>
  <div
    class="layout-tabs flex justify-between items-center px-20px h-50px"
    :style="{ width: layout === 'top' ? '92%' : '', margin: layout === 'top' ? '0 auto' : '' }"
  >
    <el-tabs
      v-model="tabActive"
      type="card"
      class="tabs-content flex-1 w-0"
      :class="'tabs-' + tabsClass"
      @tab-click="handleTabClick"
      @tab-remove="handleTabRemove"
    >
      <el-tab-pane
        v-for="item in visitedRoutes"
        :key="item.path"
        :label="$t(item.meta.title)"
        :name="item.path"
        :closable="!isAffix(item)"
      ></el-tab-pane>
    </el-tabs>

    <el-dropdown class="flex justify-center items-center w-40px" @command="handleCommand">
      <span style="cursor: pointer">
        <Icon icon="mdi:view-grid" size="18px" />
      </span>
      <template #dropdown>
        <el-dropdown-menu class="tabs-more">
          <el-dropdown-item command="closeOtherstabs">
            <Icon icon="ep:close" />
            关闭其他
          </el-dropdown-item>
          <el-dropdown-item command="closeLefttabs">
            <Icon icon="line-md:arrow-close-left" />
            关闭左侧
          </el-dropdown-item>
          <el-dropdown-item command="closeRighttabs">
            <Icon icon="line-md:arrow-close-right" />
            关闭右侧
          </el-dropdown-item>
          <el-dropdown-item command="closeAlltabs">
            <Icon icon="codicon:close-all" />
            关闭全部
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts">
  import path from 'path'
  import { storeToRefs } from 'pinia'
  import { defineComponent } from 'vue'
  import { useTabsStore } from '@/store/modules/tabsbar'
  import { useStore } from '@/store/modules/menu'
  import { useSettingsStore } from '@/store/modules/settings'
  import { useRoute, useRouter } from 'vue-router'
  import { AppRouteRecordRaw } from '@/router/types'

  export default defineComponent({
    name: 'MultiTabs',
    setup() {
      const settingStore = useSettingsStore()
      const { layout } = storeToRefs(settingStore)
      const store = useTabsStore()
      const menuStore = useStore()
      let tabActive = ref('')
      const route = useRoute()
      const router = useRouter()
      const tabsClass = ref('card')

      const isAffix = (tag) => {
        return tag.meta && tag.meta.affix
      }

      const visitedRoutes = computed(() => store.visitedRoutes)

      const filterAffixtabs = (routes, basePath = '/') => {
        let tabs: any = []
        routes.forEach((route) => {
          if (route.meta && route.meta.affix) {
            const tagPath = path.resolve(basePath, route.path)
            tabs.push({
              fullPath: tagPath,
              path: tagPath,
              name: route.name,
              meta: { ...route.meta }
            })
          }
          if (route.children) {
            const temptabs = filterAffixtabs(route.children, route.path)
            if (temptabs.length >= 1) {
              tabs = [...tabs, ...temptabs]
            }
          }
        })
        return tabs
      }

      const handleTabClick = (tab) => {
        const r = visitedRoutes.value.filter((item, index) => {
          if (tab.index == index) return item
        })[0]
        if (route.path !== r.path) {
          router.push({
            path: r.path
            // query: route.query,
            // fullPath: route.fullPath
          })
        } else {
          return false
        }
      }

      const handleTabRemove = (tabActive) => {
        let view = {} as AppRouteRecordRaw
        visitedRoutes.value.forEach((item) => {
          if (tabActive == item.path) {
            view = item
          }
        })
        store.delVisitedRoute(view)
        if (view.path === route.path) {
          const latestView = visitedRoutes.value.slice(-1)[0]
          if (latestView) {
            router.push(latestView)
          } else {
            router.push('/')
          }
        }
      }

      const toThisTag = computed(() => {
        const view = visitedRoutes.value.filter((item) => {
          if (item.path === route.fullPath) {
            return item
          }
        })[0]
        if (route.path !== view.path) router.push(view)
        return view
      })

      const toLastTag = (visitedRoutes) => {
        const latestView = visitedRoutes.value.slice(-1)[0]
        if (latestView) {
          router.push(latestView)
        } else {
          router.push('/')
        }
      }

      const handleCommand = (command) => {
        switch (command) {
          case 'closeOtherstabs':
            store.delOthersVisitedRoute(toThisTag.value)
            break
          case 'closeLefttabs':
            store.delLeftVisitedRoute(toThisTag.value)
            break
          case 'closeRighttabs':
            store.delRightVisitedRoute(toThisTag.value)
            break
          case 'closeAlltabs':
            store.delAllVisitedRoutes()
            toLastTag(visitedRoutes)
            break
        }
      }

      watch(
        () => route.path,
        () => {
          // TODO 这里需要优化
          if (route.path.indexOf('login') !== -1) return
          const affixtabs = filterAffixtabs(menuStore.menus)
          for (const tag of affixtabs) {
            if (tag.name) {
              store.addVisitedRoute(tag)
            }
          }
          if (route.name) {
            store.addVisitedRoute(route)
          }
          store.visitedRoutes.forEach((item) => {
            if (item.path === route.path) {
              tabActive.value = item.path
            }
          })
        },
        {
          immediate: true
        }
      )

      return {
        layout,
        visitedRoutes,
        tabActive,
        tabsClass,
        isAffix,
        handleTabClick,
        handleTabRemove,
        handleCommand
      }
    }
  })
</script>

<style lang="scss" scoped>
  :deep(.el-tabs__header) {
    margin-bottom: 0;
    border-bottom: 0;

    .el-tabs__nav {
      border: 0;
    }

    .el-tabs__nav-next,
    .el-tabs__nav-prev {
      line-height: 34px;
    }

    .el-tabs__item {
      height: 34px;
      margin-right: 5px;
      line-height: 34px;
      border: 1px solid var(--el-border-color) !important;
      border-radius: 4px;
      box-sizing: border-box;
      transition: padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) !important;

      &.is-active {
        color: var(--el-color-primary) !important;
        background: var(--el-color-primary-light-9) !important;
        border: 1px solid var(--el-color-primary) !important;
      }
    }
  }
</style>
