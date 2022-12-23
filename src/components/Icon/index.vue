<template>
  <el-icon :color="color" :size="size" :class="classes" @click="handleClick">
    <IconifyVueIcon :icon="iconName" v-bind="$attrs"></IconifyVueIcon>
  </el-icon>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  // import type { IconTypes } from './types'
  import { Icon as IconifyVueIcon } from '@iconify/vue'
  import { toLine } from '@/utils'

  export default defineComponent({
    name: 'Icon',
    components: {
      IconifyVueIcon
    },
    props: {
      // 图标集
      collection: {
        type: String,
        default: 'ep'
      },
      // 颜色
      color: {
        type: String,
        default: 'auto'
      },
      // 大小，支持字符串，如22px
      size: {
        type: [String, Number],
        default: ''
      },
      // 类型，配合collection进行使用
      type: {
        type: String,
        default: ''
      },
      // 额外设置样式
      classes: {
        type: String,
        default: ''
      },
      // 直接设置icon名称，设置后会覆盖collection的type
      icon: {
        type: String,
        default: ''
      }
    },
    emits: ['click'],
    setup(props, { emit }) {
      const { collection, type, icon } = toRefs(props)
      const handleClick = () => {
        emit('click')
      }

      return {
        iconName: computed(() => icon.value || `${collection.value}:${toLine(type.value)}`),
        handleClick
      }
    }
  })
</script>

<style lang="scss" scoped></style>
