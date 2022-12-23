<template>
  <!-- header -->
  <el-header class="nav flex justify-between items-center">
    <!-- fix no menu -->
    <div v-show="layout === 'top'" class="fix-no-menu-block"></div>
    <!-- Expand Btn -->
    <el-row v-show="layout !== 'top'">
      <div class="items" @click="() => handleClick(collapse)">
        <icon :type="collapse ? 'Expand' : 'Fold'" size="24px" />
      </div>
      <Breadcrumb />
    </el-row>
    <!-- Menu -->
    <el-row class="flex-1">
      <Menu v-if="['top', 'mix'].includes(layout)" :menus="showMenu" mode="horizontal">
        <img v-if="layout === 'top'" style="height: 30px" src="@/assets/images/logo.png" />
      </Menu>
    </el-row>
    <!-- Actions -->
    <el-row class="items-center flex-shrink-0">
      <!-- <span class="items">
        <icon type="HomeFilled" size="20px" />
      </span>
      <span class="items">
        <icon type="Bell" size="20px" />
      </span> -->
      <span class="items" @click="handleShowThemeSetting">
        <icon collection="ri" type="brush-2-line" size="20px" />
      </span>
      <change-dark class="items"></change-dark>
      <change-locale class="items"></change-locale>
      <full-screen class="items"></full-screen>
      <repo-badge class="items"></repo-badge>
      <el-divider direction="vertical"></el-divider>
      <!-- <el-avatar :size="20" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
      <span class="text-sm mr-4">{{ username }}</span>
      <el-divider direction="vertical"></el-divider>
      <span class="text-sm pr-1">{{ $t('Header.CustomHeader.quit') }}</span>
      <icon type="SwitchButton" size="20px" /> -->
      <el-dropdown class="items" :hide-on-click="false">
        <div class="flex">
          <el-avatar :size="24" :src="avatar" />
          <span class="text-base">{{ username }}</span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <el-button text type="primary" @click="handleClickQuit">{{
                $t('Header.CustomHeader.quit')
              }}</el-button>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-row>
  </el-header>
</template>

<script lang="ts">
  import { useStore } from '@/store/modules/menu'
  import { useSettingsStore } from '@/store/modules/settings'
  import { useTabsStore } from '@/store/modules/tabsbar'
  import { useUserStore } from '@/store/modules/user'
  import _ from 'lodash-es'
  import { storeToRefs } from 'pinia'
  import { FullScreen, ChangeLocale, RepoBadge, ChangeDark, Breadcrumb } from './components'

  export default defineComponent({
    name: 'CustomHeader',
    components: {
      FullScreen,
      ChangeLocale,
      RepoBadge,
      ChangeDark,
      Breadcrumb
    },
    props: {
      collapse: {
        type: Boolean,
        default: false
      },
      showThemeSetting: {
        type: Boolean,
        default: false
      },
      layout: {
        type: String,
        default: 'sidebar'
      }
    },
    emits: ['update:collapse', 'show-theme-setting'],
    setup(props, { emit }) {
      const router = useRouter()
      const { layout } = toRefs(props)
      const menuStore = useStore()
      const allMenu = computed(() => menuStore.menus)
      const topMenu = computed(() => {
        return _.cloneDeep(allMenu.value)?.map((item) => {
          delete item.children
          return item
        })
      })
      const store = useTabsStore()
      // 用户信息
      const userStore = useUserStore()
      const { username, avatar } = userStore.getUserInfo

      const showMenu = computed(() => (layout.value === 'top' ? allMenu.value : topMenu.value))
      const settingsStore = useSettingsStore()
      const { darkMode, primaryColor } = storeToRefs(settingsStore)

      function handleClick(flag: boolean) {
        emit('update:collapse', !flag)
      }

      function handleShowThemeSetting() {
        emit('show-theme-setting')
      }

      // quit
      function handleClickQuit() {
        userStore.clearUserInfo()
        store.visitedRoutes = []
        router.replace('/login/pwd')
      }

      watch(
        [darkMode, primaryColor],
        ([newValue]) => {
          const themeColor = settingsStore.getThemeColors()
          document.getElementById('custom-theme')?.remove()
          let currentTheme = themeColor[newValue ? 'dark' : 'light']
          let styleEl = document.createElement('style')
          styleEl.setAttribute('id', 'custom-theme')
          currentTheme['color-scheme'] = newValue
          styleEl.innerHTML =
            ':root' +
            JSON.stringify(currentTheme)
              .replace(/\"\,\"/g, '";"')
              .replace(/\"/g, '')
          document.head.append(styleEl)
          document
            .getElementsByTagName('html')[0]
            .setAttribute('data-theme', newValue ? 'dark' : 'light')
        },
        {
          immediate: true
        }
      )

      return {
        showMenu,
        handleClick,
        handleShowThemeSetting,
        username,
        avatar,
        handleClickQuit
      }
    }
  })
</script>

<style lang="scss" scoped>
  .nav {
    color: var(--el-text-color-primary);
    background-color: var(--el-bg-color);
  }

  .items {
    @apply flex items-center cursor-pointer mr-4;
  }

  .badge {
    --el-badge-padding: 4px;
    --el-badge-size: 16px;

    :deep(.el-badge__content) {
      line-height: 13px;
    }
  }
</style>
