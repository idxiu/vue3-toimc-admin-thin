<template>
  <el-badge :value="value" :is-dot="isDot" :type="type || 'danger'" :max="max">
    <icon :type="icon" :size="size"></icon>
  </el-badge>
</template>

<script lang="ts">
  import { PropType } from 'vue'
  import { IconTypes } from '@/components/Icon/types'
  import { BadgeTypes } from './types'

  export default defineComponent({
    name: 'Notification',
    props: {
      value: {
        type: [String, Number],
        default: ''
      },
      max: {
        type: Number,
        default: Infinity
      },
      isDot: {
        type: Boolean,
        default: false
      },
      type: {
        type: String as PropType<BadgeTypes>,
        default: 'danger'
      },
      size: {
        type: String,
        default: '28px'
      },
      icon: {
        type: String as PropType<IconTypes>,
        default: 'Bell'
      }
    },
    setup() {
      return {}
    }
  })
</script>

<style lang="scss" scoped></style>
