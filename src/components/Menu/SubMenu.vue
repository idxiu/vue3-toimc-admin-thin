<template>
  <menu-item v-if="!menuHasChildren(item)" :item="item"></menu-item>
  <el-sub-menu v-else :index="getIndex(item)">
    <template #title>
      <icon v-if="item.meta.icon" :type="getIcons(item)" />
      <span v-if="!collapse">{{ $t(item.meta.title) }}</span>
    </template>

    <template v-for="child in item.children" :key="child.path">
      <sub-menu :item="child"></sub-menu>
    </template>
  </el-sub-menu>
</template>

<script lang="ts">
  import type { AppRouteRecordRaw } from '@/router/types'
  import type { PropType } from 'vue'

  import { useNav } from './useNav'

  export default defineComponent({
    name: 'SubMenu',
    props: {
      collapse: {
        type: Boolean,
        default: false
      },
      item: {
        type: Object as PropType<AppRouteRecordRaw>,
        default: () => ({})
      }
    },
    emits: ['menuClick'],
    setup() {
      const { menuHasChildren, getIndex, getIcons } = useNav()

      return {
        menuHasChildren,
        getIndex,
        getIcons
      }
    }
  })
</script>

<style scoped></style>
