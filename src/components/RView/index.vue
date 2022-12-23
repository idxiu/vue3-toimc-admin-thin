<template>
  <router-view v-slot="{ Component, route }">
    <transition mode="out-in" :name="transitionName">
      <keep-alive :include="keepAliveNameList" :max="20">
        <component :is="Component" :key="route.path" />
      </keep-alive>
    </transition>
  </router-view>
</template>

<script lang="ts">
  import { AppRouteRecordRaw } from '@/router/types'
  import { useSettingsStore } from '@/store/modules/settings'
  import { useTabsStore } from '@/store/modules/tabsbar'

  import { toLine } from '@/utils'

  export default defineComponent({
    setup() {
      const store = useSettingsStore()
      const tabsStore = useTabsStore()

      const keepAliveNameList = ref(['DashBoard'] as string[])
      const visitedRoutes = computed<AppRouteRecordRaw[]>(() => tabsStore.visitedRoutes)

      const updateKeepAliveNameList = (refreshRouteName = null) => {
        keepAliveNameList.value = visitedRoutes.value
          .filter((item) => !item.meta.keepAlive && item.name !== refreshRouteName)
          .flatMap((item) => item.name)
      }

      watchEffect(() => {
        updateKeepAliveNameList()
      })

      return {
        keepAliveNameList,
        transitionName: computed(() => toLine(store.$state.transitionName + 'Transition'))
      }
    }
  })
</script>

<style scoped></style>
