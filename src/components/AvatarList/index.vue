<template>
  <ul :class="wrapperClass">
    <li
      v-for="(item, index) in newImages"
      :key="index"
      class="rounded-full flex border-white"
      :style="{
        ...styles,
        borderColor,
        borderWidth,
        zIndex: reverse ? newImages.length - index : index
      }"
    >
      <slot name="item" :item="item">
        <el-avatar
          :src="typeof item !== 'string' ? item.src : item"
          :size="size"
          @click="() => handleClick(item, index)"
        ></el-avatar>
      </slot>
    </li>
    <li v-if="num && showMore" class="more" :style="moreStyle">...</li>
  </ul>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  interface ImageType {
    src: string
    [key: string]: any
  }

  export default defineComponent({
    props: {
      // 数据源
      images: {
        type: Array as PropType<string[] | ImageType[]>,
        default: () => []
      },
      // 最多显示5个
      num: {
        type: Number,
        default: 5
      },
      // 头像大小
      size: {
        type: Number,
        default: 32
      },
      direction: {
        type: String as PropType<'vertical' | 'horizontal'>,
        default: 'horizontal'
      },
      // 叠加的偏移量，默认是margin-left: 0
      gutter: {
        type: Number,
        default: 0
      },
      // 边框颜色
      borderColor: {
        type: String,
        default: 'white'
      },
      // 边框宽度
      borderWidth: {
        type: String,
        default: '3px'
      },
      showMore: {
        type: Boolean,
        default: true
      },
      // 显示层级
      reverse: {
        type: Boolean,
        default: true
      },
      // 是否是行内显示
      inline: {
        type: Boolean,
        default: false
      }
    },
    emits: ['click'],
    setup(props, { emit }) {
      const handleClick = (item: string | ImageType, index: number) => {
        emit('click', { item, index })
      }

      const wrapperClass = computed(() => {
        let cls = [] as string[]
        // 方向
        if (props.direction === 'vertical') {
          cls = [...cls, 'flex-col', 'justify-center']
        } else {
          cls = [...cls, 'flex-row', 'items-center']
        }
        // 是否行内显示
        if (props.inline) {
          cls = ['inline', ...cls]
        } else {
          cls = ['flex', ...cls]
        }
        return cls
      })

      // 根据方向，设置单个头像的gutter的重叠值
      const styles = computed(() => {
        if (props.direction === 'horizontal') {
          return {
            marginRight: -props.gutter + 'px'
          }
        } else {
          return {
            marginBottom: -props.gutter + 'px'
          }
        }
      })

      // 省略符的样式
      const moreStyle = computed(() => {
        if (props.direction === 'horizontal') {
          return { marginLeft: props.gutter + 3 + 'px' }
        }
        return { marginTop: props.gutter - 5 + 'px' }
      })

      return {
        newImages: computed(() => (props.num ? props.images.slice(0, props.num) : props.images)),
        handleClick,
        wrapperClass,
        styles,
        moreStyle
      }
    }
  })
</script>

<style scoped lang="scss">
  .inline {
    @apply inline-flex;

    li {
      @apply inline-flex;
    }

    .more {
      @apply self-center relative left-[-2px];

      position: relative;
    }
  }
</style>
