<template>
  <!-- menu -->
  <div
    class="flex"
    :class="['menu-mode-' + mode, mode === 'horizontal' ? 'flex-row flex-1 pr-50px' : 'flex-col']"
  >
    <div class="flex items-center flex-shrink-0">
      <slot></slot>
    </div>
    <el-menu
      v-bind="$attrs"
      :default-active="defaultActive"
      class="flex-1"
      :class="{ 'w-0': mode === 'horizontal' }"
      :mode="mode"
      :collapse="collapse"
      :background-color="backgroundColor"
      :text-color="textColor"
      :active-text-color="activeTextColor"
      :default-openeds="defaultOpeneds"
    >
      <sub-menu v-for="item in menus" :key="item.path" :item="item" :collapse="collapse"></sub-menu>
    </el-menu>
  </div>
</template>

<script lang="ts">
  import type { AppRouteRecordRaw } from '@/router/types'
  import type { PropType } from 'vue'

  export default defineComponent({
    name: 'Menus',
    props: {
      mode: {
        type: String as PropType<'vertical' | 'horizontal'>,
        default: 'vertical'
      },
      menus: {
        type: Array as PropType<AppRouteRecordRaw[]>,
        default: () => []
      },
      collapse: {
        type: Boolean,
        default: false
      },
      width: {
        type: String,
        default: '266px'
      },
      backgroundColor: {
        type: String,
        default: ''
      },
      textColor: {
        type: String,
        default: ''
      },
      activeTextColor: {
        type: String,
        default: ''
      },
      defaultOpeneds: {
        type: Array as PropType<string[]>,
        default: () => []
      },
      defaultActive: {
        type: String,
        default: ''
      }
    },
    emits: ['menuClick'],
    setup() {}
  })
</script>

<style lang="scss" scoped>
  .el-menu {
    --el-menu-item-height: 50px;
  }
</style>
