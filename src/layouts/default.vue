<template>
  <div class="layout-wrap w-full h-screen overflow-hidden">
    <div :class="['layout-' + layout, 'layout-mode-' + layoutMode, 'h-full']">
      <sider-bar v-if="layoutMode === 'row'" :collapse="isCollapse"></sider-bar>
      <div
        class="layout-main-wrap relative flex-1 h-full"
        :class="[
          fixHeader !== true ? 'overflow-auto' : 'overflow-hidden',
          { 'w-0': layout !== 'top' }
        ]"
      >
        <div class="layout-header">
          <div class="nav">
            <custom-header
              v-model:collapse="isCollapse"
              class="layout-main"
              :layout="layout"
              @show-theme-setting="handleShowThemeSetting"
            ></custom-header>
          </div>
          <div v-if="tabPage" class="tabs">
            <multi-tabs></multi-tabs>
          </div>
        </div>
        <div :class="['layout-main', { 'fixed-header-main': fixHeader === true }]">
          <el-scrollbar class="custom-scroll">
            <r-view></r-view>
          </el-scrollbar>
        </div>
      </div>
      <theme-setting v-model:show="isShowThemeSetting"></theme-setting>
    </div>
  </div>
</template>

<script lang="ts">
  import { storeToRefs } from 'pinia'
  import { asyncRoutes } from '@/router/index'
  import { useSettingsStore } from '@/store/modules/settings'
  import SiderBar from './sider/SiderBar.vue'
  import CustomHeader from './header/CustomHeader.vue'
  import MultiTabs from './tabs/MultiTabs.vue'

  export default defineComponent({
    components: {
      CustomHeader,
      SiderBar,
      MultiTabs
    },
    setup() {
      const store = useSettingsStore()
      const { layout, fixHeader, tabPage } = storeToRefs(store)
      const isCollapse = ref(false)
      const isShowThemeSetting = ref(false)

      const layoutMode = computed(() => (layout.value === 'top' ? 'column' : 'row'))
      const headerHeight = computed(() => (tabPage.value ? '110px' : '60px'))

      function handleShowThemeSetting() {
        isShowThemeSetting.value = true
      }

      return {
        layout,
        layoutMode,
        fixHeader,
        asyncRoutes,
        isCollapse,
        isShowThemeSetting,
        tabPage,
        headerHeight,
        handleShowThemeSetting
      }
    }
  })
</script>

<style lang="scss" scoped>
  .layout-wrap {
    background-color: var(--el-bg-page);
  }

  .layout-main-wrap > .layout-main {
    margin-top: v-bind(headerHeight);

    &.fixed-header-main {
      height: calc(100% - (v-bind(headerHeight)));
    }
  }

  .layout-header {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    background-color: var(--el-bg-color);
    box-shadow: var(--el-box-shadow-light);
  }

  .tabs {
    background-color: var(--el-bg-color);
    border-top: 1px solid var(--el-border-color);
    user-select: none;
  }

  :deep(.el-menu) {
    border: none;
  }

  .layout-mode-row {
    display: flex;
    flex-direction: row;
    height: 100%;
  }

  .layout-mode-column {
    .layout-main {
      width: 92%;
      margin-right: auto;
      margin-left: auto;
    }
  }

  .custom-scroll {
    :deep(.el-scrollbar__view) {
      height: 100%;
    }
  }
</style>
