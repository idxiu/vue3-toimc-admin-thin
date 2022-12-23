<template>
  <div
    :class="[
      'transition-all duration-300 bg-center bg-no-repeat bg-cover',
      { transparent: backgroundImg !== '' }
    ]"
    :style="{ width: menuWidth, backgroundImage: 'url(' + backgroundImg + ')' }"
  >
    <div class="logo-wrap flex items-center justify-center py-3 px-3 h-60px">
      <img class="max-h-full" src="@/assets/images/logo.png" />
    </div>
    <div class="flex flex-row h-[calc(100%-60px)]">
      <el-scrollbar class="side-top-menu-wrap">
        <Menu
          v-if="layout === 'mixbar'"
          width="64px"
          :menus="topMenu"
          :collapse="false"
          :default-active="defaultActive"
          :is-top="true"
        ></Menu>
      </el-scrollbar>
      <el-scrollbar :class="menuClassName" :style="{ width: mainMenuWidth }">
        <Menu :menus="mainMenu" :default-active="defaultSubActive" :collapse="collapse"></Menu>
      </el-scrollbar>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { useSettingsStore } from '@/store/modules/settings'
  import { useStore } from '@/store/modules/menu'
  import { useRoute } from 'vue-router'
  import _ from 'lodash-es'

  export default defineComponent({
    name: 'SiderBar',
    props: {
      collapse: {
        type: Boolean,
        default: false
      }
    },
    setup(props) {
      const menuStore = useStore()
      const store = useSettingsStore()
      const layout = computed(() => store.layout)
      const route = useRoute()
      const routeName = computed(() => route.name)
      const curRoutePath = computed(() => route.path)

      const menuWidth = computed(() => {
        if (store.layout !== 'top') {
          if (props.collapse) {
            return '64px'
          } else {
            return store.menuWidth
          }
        } else {
          return ''
        }
      })

      const menuClassName = computed(() => {
        const classList: string[] = []
        if (layout.value === 'siderbar' || layout.value === 'mix') {
          classList.push('side-main-menu-wrap')
        } else if (layout.value === 'mixbar') {
          classList.push('side-sub-menu-wrap')
          classList.push(props.collapse ? 'px-0' : 'px-2')
        }
        return classList
      })

      const mainMenuWidth = computed(() => {
        if (layout.value === 'siderbar' || layout.value === 'mix') {
          return '100%'
        } else if (layout.value === 'mixbar') {
          return parseInt(menuWidth.value) - 64 + 'px'
        }
      })

      const allMenu = computed(() => menuStore.menus)

      const mainMenu = computed(() => {
        if (layout.value === 'siderbar') {
          return allMenu.value
        } else if (layout.value === 'mixbar' || layout.value === 'mix') {
          return (
            menuStore.menus?.find((item) =>
              [item.path, item.redirect].includes('/' + curRoutePath.value.split('/')[1])
            )?.children || []
          )
        }
      })

      const topMenu = computed(() => {
        return _.cloneDeep(allMenu.value)?.map((item) => {
          delete item.children
          return item
        })
      })

      const defaultSubActive = computed(() => {
        if (routeName) {
          let currentKey = ''
          const findActive = function (arr) {
            arr.forEach((item) => {
              if (item.name === routeName.value) {
                currentKey = item.meta.key
                return
              } else if (item.children && item.children.length > 0) {
                findActive(item.children)
              }
            })
          }
          findActive(mainMenu.value)
          return currentKey
        }
      })

      const defaultActive = computed(() => defaultSubActive.value?.split('-')[0])

      return {
        menuWidth,
        mainMenuWidth,
        defaultActive,
        defaultSubActive,
        layout,
        allMenu,
        topMenu,
        mainMenu,
        menuClassName,
        backgroundImg: computed(() => store.$state.backgroundImg)
      }
    }
  })
</script>

<style lang="scss" scoped>
  .logo-wrap {
    background-color: var(--logo-bg-color);
  }

  .side-top-menu-wrap {
    background-color: var(--topside-menu-bg-color);

    :deep(.el-menu) {
      padding: 0 3px;
      color: var(--topside-menu-text-color);
      background-color: var(--topside-menu-bg-color);

      .el-menu-item {
        padding: 0 6px !important;
        font-size: 14px;
        line-height: unset;
        color: var(--topside-menu-text-color);
        border-radius: 4px;
        flex-direction: column;
        justify-content: center;

        .menu-icon {
          margin-right: 0;
          margin-bottom: 1px;
        }

        &:hover {
          color: var(--side-main-menu-text-hover-color);
          background-color: var(--side-main-menu-bg-hover-color);
        }

        &.is-active {
          color: var(--side-main-menu-active-text-color);
          background-color: var(--side-main-menu-active-bg-color);
        }
      }
    }
  }

  .side-main-menu-wrap {
    background-color: var(--side-main-menu-bg-color);

    :deep(.el-menu) {
      color: var(--side-main-menu-text-color);
      background-color: var(--side-main-menu-bg-color);

      .el-menu-item,
      .el-sub-menu__title {
        color: var(--side-main-menu-text-color);
        background-color: var(--side-main-menu-bg-hover-color);

        &:hover {
          color: var(--side-main-menu-text-hover-color);
        }

        &.is-active {
          color: var(--side-main-menu-active-text-color);
          background-color: var(--side-main-menu-active-bg-color);
        }
      }
    }
  }

  .side-sub-menu-wrap {
    background-color: var(--side-sub-menu-bg-color);

    :deep(.el-menu) {
      color: var(--side-sub-menu-text-color);
      background-color: var(--side-sub-menu-bg-color);

      .el-menu-item,
      .el-sub-menu__title {
        color: var(--side-sub-menu-text-color);
        background-color: var(--side-sub-menu-bg-hover-color);

        &:hover {
          color: var(--side-sub-menu-text-hover-color);
        }

        &.is-active {
          min-width: unset;

          // padding: 0;
          color: var(--side-sub-menu-active-text-color);
          background-color: var(--side-sub-menu-active-bg-color);
          border-radius: 5px;
        }
      }
    }
  }

  .transparent {
    .logo-wrap {
      background-color: transparent !important;
    }

    .side-main-menu-wrap {
      background-color: transparent !important;

      :deep(.el-menu) {
        background-color: transparent;

        .el-menu-item,
        .el-sub-menu__title {
          color: #fff;
          text-shadow: 0 5px 8px rgb(0 0 0 / 20%);
          background-color: transparent;

          &.is-active {
            font-weight: bold;

            // padding: 0;
            color: var(--side-sub-menu-active-bg-color);
          }
        }
      }
    }
  }
</style>
