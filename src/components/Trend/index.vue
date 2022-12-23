<template>
  <component :is="wrapper" :class="['inline-flex items-center', cls]">
    <div v-if="text" class="text-sm mr-1" :style="{ color: getTextColor() || 'auto' }">
      <slot>{{ text }}</slot>
    </div>
    <template v-if="icon">
      <icon :type="icon" :color="getIconColor()" />
    </template>
    <template v-else>
      <icon
        v-if="type === TrendDirection.Up"
        :type="bold ? 'ArrowUpBold' : 'ArrowUp'"
        :color="trendsColors[0] ? trendsColors[0] : 'red'"
      />
      <icon
        v-else-if="type === TrendDirection.Down"
        :type="bold ? 'ArrowDownBold' : 'ArrowDown'"
        :color="trendsColors[2] ? trendsColors[2] : 'green'"
      />
      <icon
        v-else-if="type === TrendDirection.Equal"
        :type="bold ? 'SemiSelect' : 'Minus'"
        :color="trendsColors[1] ? trendsColors[1] : 'gray'"
      />
    </template>
  </component>
</template>

<script lang="ts">
  import type { PropType } from 'vue'
  import type { IconTypes } from '../Icon/types'
  import type { TrendTypes } from './types'

  enum TrendDirection {
    Up = 'up',
    Down = 'down',
    Equal = 'equal'
  }

  const defaultColors = ['#f43f5e', '#333', '#10b981']

  export default defineComponent({
    name: 'Trend',
    props: {
      wrapper: {
        type: String,
        default: 'div'
      },
      cls: {
        type: String,
        default: ''
      },
      type: {
        type: String as PropType<TrendTypes>,
        default: TrendDirection.Equal
      },
      text: {
        type: String,
        default: ''
      },
      bold: {
        type: Boolean,
        default: false
      },
      reverse: {
        type: Boolean,
        default: false
      },
      colors: {
        type: Array as PropType<string[]>,
        default: () => [...defaultColors]
      },
      sync: {
        type: Boolean,
        default: false
      },
      textColors: {
        type: Array as PropType<string[]>,
        default: () => []
      },
      icon: {
        type: String as PropType<IconTypes>,
        default: ''
      }
    },
    setup(props) {
      const { reverse, type, colors, sync, textColors } = toRefs(props)

      function getTextColor() {
        let clrs
        if (sync.value) {
          clrs = reverse.value ? [...defaultColors].reverse() : colors.value
        } else {
          clrs = textColors.value
        }
        if (type.value === TrendDirection.Up) {
          return clrs[0]
        } else if (type.value === TrendDirection.Down) {
          return clrs[2]
        } else {
          return clrs[1]
        }
      }

      function getIconColor() {
        let clrs
        if (sync.value) {
          clrs = reverse.value ? [...defaultColors].reverse() : colors.value
        } else {
          clrs = colors.value
        }
        if (type.value === TrendDirection.Up) {
          return clrs[0]
        } else if (type.value === TrendDirection.Down) {
          return clrs[2]
        } else {
          return clrs[1]
        }
      }

      return {
        TrendDirection,
        getTextColor,
        getIconColor,
        trendsColors: computed(() => {
          return reverse.value ? [...defaultColors].reverse() : colors.value
        })
      }
    }
  })
</script>

<style scoped></style>
