<template>
  <div>
    <el-drawer :model-value="showSetting" title="主题设置" :size="320" @closed="handleClosed">
      <el-form :model="form" label-position="left">
        <el-form-item label="主题色">
          <span :style="{ color: form.theme, 'margin-right': '10px' }">{{ form.theme }}</span>
          <el-color-picker
            v-model="form.theme"
            @change="(val) => handleStoreChange(val, 'primaryColor')"
          />
          <!-- <el-select v-model="form.theme">
            <el-option label="蓝黑" :value="1" />
            <el-option label="蓝白" :value="2" />
            <el-option label="绿黑" :value="3" />
            <el-option label="绿白" :value="4" />
            <el-option label="紫黑" :value="5" />
            <el-option label="紫白" :value="6" />
            <el-option label="红黑" :value="7" />
            <el-option label="红白" :value="8" />
          </el-select> -->
        </el-form-item>
        <el-form-item label="暗黑模式">
          <el-switch
            v-model="form.darkMode"
            @change="(val) => handleStoreChange(val, 'darkMode')"
          />
        </el-form-item>
        <el-form-item label="菜单背景" class="menu-bg-custom">
          <navigation-bg
            :more-func="moreFunc"
            :lists="bglists"
            @change="
              (val) =>
                handleStoreChange(val.type === 'img' ? val?.value || '' : '', 'backgroundImg')
            "
          ></navigation-bg>
        </el-form-item>
        <el-form-item label="导航模式" class="nav-type">
          <navigation-type
            v-model:navigationMode="form.navigationMode"
            @change="(val) => handleStoreChange(val, 'layout')"
          ></navigation-type>
        </el-form-item>
        <el-form-item label="菜单宽度">
          <el-select
            v-model="form.menuWidth"
            @change="(val) => handleStoreChange(val, 'menuWidth')"
          >
            <el-option label="266px" value="266px" />
            <el-option label="277px" value="277px" />
            <el-option label="288px" value="288px" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="菜单可拖拽">
          <el-switch v-model="form.sidebarResize" />
        </el-form-item> -->
        <el-form-item label="头部固定">
          <el-switch
            v-model="form.fixedHead"
            @change="(val) => handleStoreChange(val, 'fixHeader')"
          />
        </el-form-item>
        <el-form-item label="标签页">
          <el-switch v-model="form.tabPage" @change="(val) => handleStoreChange(val, 'tabPage')" />
        </el-form-item>
        <!-- <el-form-item label="标签图标">
          <el-switch v-model="form.tabPageIcon" />
        </el-form-item>
        <el-form-item label="标签风格">
          <el-select v-model="form.tabPageStyle">
            <el-option label="卡片" value="card" />
            <el-option label="灵动" value="normal" />
            <el-option label="圆滑" value="round" />
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="显示面包屑">
          <el-switch v-model="form.showCrumbs" />
        </el-form-item> -->
        <el-form-item label="显示Logo">
          <el-switch v-model="form.showLogo" />
        </el-form-item>
        <el-form-item label="切换动画">
          <el-select
            v-model="form.transitionName"
            @change="(val) => handleStoreChange(val, 'transitionName')"
          >
            <el-option v-for="item in TRANSITION_NAMES" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="加载进度条">
          <el-switch v-model="form.progress" />
        </el-form-item>
        <el-form-item label="切换loading">
          <el-switch v-model="form.changeLoading" />
        </el-form-item>
        <el-form-item label="切换动画">
          <el-switch v-model="form.changeAnimate" />
        </el-form-item> -->
      </el-form>
      <template #footer>
        <el-button type="primary" @click="handleCopySetting">复制配置</el-button>
        <el-button @click="handleRestoreDefault">恢复默认</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts">
  import { ThemeSettingsType, useSettingsStore } from '@/store/modules/settings'
  import { storeToRefs } from 'pinia'
  import { useClipboard } from '@vueuse/core'
  import { ElMessage } from 'element-plus'
  import { TransitionNameEnum, TRANSITION_NAMES } from '@/enums/menuEnum'
  import axios from 'axios'

  export default defineComponent({
    name: 'ThemeSetting',
    props: {
      show: {
        type: Boolean,
        default: false
      }
    },
    emits: ['update:show'],
    setup(props, { emit }) {
      const { copy } = useClipboard()
      const store = useSettingsStore()
      const { layout, fixHeader, darkMode, menuWidth, primaryColor, tabPage } = storeToRefs(store)
      // 背景图片
      const bglists = ref([] as string[])

      let { show } = toRefs(props)
      const showSetting = ref(show)

      let form = reactive({
        theme: primaryColor || '#409eff',
        darkMode: darkMode || false,
        navigationMode: layout,
        menuWidth: menuWidth || '266px',
        sidebarResize: false,
        fixedHead: fixHeader,
        tabPage: tabPage,
        tabPageIcon: false,
        tabPageStyle: 'card',
        showCrumbs: false,
        showLogo: false,
        progress: true,
        changeLoading: false,
        changeAnimate: false,
        transitionName: TransitionNameEnum.Fade
      })

      const handleClosed = () => {
        emit('update:show', false)
      }

      const handleStoreChange = (
        value: string | number | boolean,
        type: keyof ThemeSettingsType
      ) => {
        store.$state[type] = value
      }

      const handleRestoreDefault = () => {
        store.resetSetting()
      }
      const handleCopySetting = () => {
        copy(JSON.stringify(store.$state, null, 2))
        ElMessage({
          message: '复制成功',
          type: 'success'
        })
        emit('update:show', false)
      }

      const moreFunc = async () => {
        const res = await axios.get('/api/public/beauty')
        // console.log('🚀 ~ file: SiderBar.vue ~ line 51 ~ moreFunc ~ res', res)
        if (res.status === 200) {
          const data = res.data
          if (data.code === 200) {
            bglists.value = [...bglists.value, ...data.data]
          }
        }
      }

      return {
        form,
        TRANSITION_NAMES,
        showSetting,
        handleClosed,
        handleRestoreDefault,
        handleCopySetting,
        handleStoreChange,
        moreFunc,
        bglists
      }
    }
  })
</script>

<style lang="scss" scoped>
  .menu-bg-custom {
    display: block !important;
  }

  .nav-type {
    display: block !important;

    :deep(.el-form-item__content) {
      display: block !important;
    }
  }

  :deep(.el-form-item) {
    display: flex;
    align-items: center;
  }

  :deep(.el-form-item__label) {
    flex: 1 1;
    text-align: left;
  }

  :deep(.el-form-item__content) {
    flex: 0 0 auto;
  }

  :deep(.el-form-item .el-input__inner) {
    width: 115px;
  }

  :deep(.el-drawer__header) {
    margin-bottom: 20px;
  }

  :deep(.el-drawer__footer) {
    padding: 10px;
    border-top: 1px solid #dcdfe6;
  }
</style>
