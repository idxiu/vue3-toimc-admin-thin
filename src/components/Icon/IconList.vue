<template>
  <ul class="flex flex-wrap">
    <li
      v-for="(item, index) in items"
      :key="index"
      :class="[
        'border flex flex-col justify-center items-center cursor-pointer ',
        hoverClass,
        classes,
        isActive(choose, item, index) && activeClass
      ]"
      @click="handleCopy(item)"
    >
      <icon v-if="showIcon" :type="item" :size="size" :color="color" />
      <span v-if="showText" class="pt-4">{{ item }}</span>
    </li>
  </ul>
</template>

<script lang="ts">
  import type { IconTypes } from '@/components/Icon/types'
  import type { PropType } from 'vue'

  export default defineComponent({
    name: 'IconList',
    props: {
      choose: {
        type: [String, Number],
        default: () => {}
      },
      items: {
        type: Array as PropType<IconTypes[]>,
        default: () => []
      },
      classes: {
        type: String,
        default: 'w-1/8 py-6'
      },
      hoverClass: {
        type: String,
        default: 'hover:text-blue-400'
      },
      activeClass: {
        type: String,
        default: 'text-blue-400'
      },
      showIcon: {
        type: Boolean,
        default: true
      },
      showText: {
        type: Boolean,
        default: true
      },
      size: {
        type: String,
        default: '20px'
      },
      color: {
        type: String,
        default: 'auto'
      }
    },
    emits: ['click'],
    setup(_props, { emit }) {
      function handleCopy(item: string) {
        emit('click', item)
      }

      function isActive(flag: string | number, item: string, index: number): boolean {
        if (typeof flag === 'string') {
          return flag === item
        } else {
          return flag === index
        }
      }

      return {
        handleCopy,
        isActive
      }
    }
  })
</script>

<style scoped></style>
