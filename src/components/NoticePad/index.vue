<template>
  <el-popover
    placement="bottom"
    :width="width"
    :trigger="trigger"
    popper-class="toimc-custom-popper"
  >
    <template #reference>
      <notification
        :size="size"
        :icon="icon"
        :value="value"
        :max="max"
        :is-dot="isDot"
        :type="type"
      ></notification>
    </template>
    <template #default>
      <slot></slot>
    </template>
  </el-popover>
</template>

<script lang="ts">
  import { PropType } from 'vue'
  import { IconTypes } from '@/components/Icon/types'
  import { BadgeTypes } from '@/components/NoticePad/types'

  export default defineComponent({
    name: 'NoticePad',
    props: {
      size: {
        type: String,
        default: '28px'
      },
      icon: {
        type: String as PropType<IconTypes>,
        default: 'Bell'
      },
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
      width: {
        type: Number,
        default: 300
      },
      trigger: {
        type: String as PropType<'click' | 'hover'>,
        default: 'click'
      }
    },
    setup() {
      return {}
    }
  })
</script>

<style scoped lang="scss"></style>
