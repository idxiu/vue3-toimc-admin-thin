<template>
  <ul ref="waterfallWrapper" class="waterfall-list" :style="{ height: `${wrapperHeight}px` }">
    <li
      v-for="(item, index) in newLists"
      :key="getKey(item, index)"
      :ref="(val) => (item.ref = val)"
      class="waterfall-item"
      :style="item.style"
    >
      <div :class="['waterfall-card', item?.cls]">
        <slot name="item" :item="item" :index="index">
          <div
            class="bg-gray-900 rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-linear hover:shadow-lg hover:shadow-gray-600 group"
          >
            <div class="overflow-hidden">
              <lazy-img
                :url="item.src"
                class="cursor-pointer transition-all duration-300 ease-linear group-hover:scale-105"
                @loaded="handleLoaded"
              />
            </div>
          </div>
        </slot>
        <slot name="default"></slot>
      </div>
    </li>
  </ul>
</template>

<script lang="ts">
  import 'animate.css'
  import type { PropType } from 'vue'
  import type { ViewCard } from './types/waterfall'
  import { defineComponent, provide, watch } from 'vue'

  import { useDebounceFn } from '@vueuse/core'

  import { useCalculateCols } from './utils/calculate'
  import Lazy from './utils/Lazy'

  import { getValue } from './utils/util'
  import { LoadedEmitParams } from './types/lazy'

  export default defineComponent({
    props: {
      list: {
        type: Array as PropType<ViewCard[]>,
        default: () => []
      },
      rowKey: {
        type: String,
        default: 'id'
      },
      imgSelector: {
        type: String,
        default: 'src'
      },
      width: {
        type: Number,
        default: 200
      },
      breakpoints: {
        type: Object,
        default: () => ({
          1200: {
            // when wrapper width < 1200
            rowPerView: 3
          },
          800: {
            // when wrapper width < 800
            rowPerView: 2
          },
          500: {
            // when wrapper width < 500
            rowPerView: 1
          }
        })
      },
      gutter: {
        type: Number,
        default: 10
      },
      hasAroundGutter: {
        type: Boolean,
        default: true
      },
      animationPrefix: {
        type: String,
        default: 'animate__animated'
      },
      animationEffect: {
        type: String,
        default: 'fade-in'
      },
      animationDuration: {
        type: Number,
        default: 1000
      },
      animationDelay: {
        type: Number,
        default: 300
      },
      backgroundColor: {
        type: String,
        default: '#fff'
      },
      lazyload: {
        type: Boolean,
        default: true
      },
      loadProps: {
        type: Object,
        default: () => {}
      },
      delay: {
        type: Number,
        default: 300
      }
    },

    setup(props) {
      const newLists = ref<ViewCard[]>(
        props.list.map((o) => ({
          ...o,
          ref: ref(null)
        }))
      )

      const wrapperHeight = ref(0)

      // ???????????????
      const { waterfallWrapper, wrapperWidth, colWidth, cols, offsetX } = useCalculateCols(props)
      // const posY = ref<number[]>([])
      const posY = ref<number[]>([])

      // ????????????????????????

      const lazy = new Lazy(props.lazyload, props.loadProps, {
        colWidth: colWidth.value
      })
      provide('lazy', lazy)

      // 1s????????????????????????????????????????????????
      const renderer = useDebounceFn(async () => {
        // wrapperHeight.value = 0
        posY.value = new Array(cols.value).fill(props.hasAroundGutter ? props.gutter : 0)
        newLists.value.forEach((item) => {
          layoutHandle(item)
        })
        wrapperHeight.value = Math.max.apply(null, posY.value)
      }, props.delay)

      // ????????????????????????????????????
      watch(
        () => [wrapperWidth, colWidth],
        () => {
          // posY.value = new Array(cols.value).fill(props.hasAroundGutter ? props.gutter : 0)
          renderer()
        },
        { deep: true }
      )

      watch(
        () => props.list,
        () => {
          const ids = newLists.value.map((o) => getKey(o))
          const newIds = props.list.map((o) => getKey(o))
          // ????????????items????????????ref??????
          const newArr = props.list.filter((o) => !ids.includes(o.src))
          newLists.value.push(
            ...newArr.map((o) => ({
              ...o,
              ref: ref(null)
            }))
          )
          // ??????newLists???src?????????props.list???item
          newLists.value = newLists.value.filter((o) => newIds.includes(o.src))
          renderer()
        },
        { deep: true }
      )

      // ????????????y?????????x??????
      const getX = (index: number): number => {
        const count = props.hasAroundGutter ? index + 1 : index
        return props.gutter * count + colWidth.value * index + offsetX.value
      }

      const layoutHandle = async (item) => {
        // ?????????y???
        const minY = Math.min.apply(null, posY.value)
        // ??????y?????????
        const minYIndex = posY.value.indexOf(minY)
        // ?????????????????????x
        const curX = getX(minYIndex)

        // ??????x,y,width
        // const style = curItem.style as CssStyleObject

        // ????????????
        item.style = {
          ...item.style,
          transform: `translate3d(${curX}px,${minY}px, 0)`,
          width: `${colWidth.value}px`
        }
        const width = item.width || item.ref?.clientWidth
        const height = item.height || item.ref?.clientHeight

        // ????????????index???y???
        const domHeight = (colWidth.value / width) * height || 0
        posY.value[minYIndex] += domHeight + props.gutter

        // ??????????????????
        addAnimation(item, () => {
          // ??????????????????
          item.style = { ...item.style, transition: '.3s' }
        })
      }

      // ?????????????????????????????????
      const getRenderURL = (item: ViewCard): string => {
        const res = getValue(item, props.imgSelector)[0]
        return res
      }

      // ???????????????
      const getKey = (item: ViewCard, index?: number): string => {
        return item[props.rowKey] || item['src'] || index || item
      }

      // ??????
      function addAnimation(item, callback?: () => void) {
        const durationSec = `${props.animationDuration / 1000}s`
        const delaySec = `${props.animationDelay / 1000}s`
        item.style = {
          ...item.style,
          visibility: 'visible',
          duration: durationSec,
          delay: delaySec,
          fillMode: 'both'
        }
        item.cls = `${props.animationPrefix} ${props.animationEffect}`

        if (callback) {
          setTimeout(() => {
            callback()
          }, props.animationDuration + props.animationDelay)
        }
      }

      // ???????????????????????????
      const handleLoaded = (params: LoadedEmitParams) => {
        const { dom, src, width, height } = params
        for (let i = 0; i < newLists.value.length; i++) {
          const item = newLists.value[i]
          if (item.src === src) {
            item.dom = dom
            item.width = width
            item.height = height
            // layoutHandle(item)
            break
          }
        }
        renderer()
      }

      return {
        waterfallWrapper,
        wrapperHeight,
        getRenderURL,
        getKey,
        handleLoaded,
        newLists
      }
    }
  })
</script>

<style scoped>
  /* ????????????????????? */
  @keyframes fade-in {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  .waterfall-list {
    position: relative;
    width: 100%;
    overflow: hidden;
    background-color: v-bind(backgroundColor);
  }

  .waterfall-item {
    position: absolute;
    top: 0;
    left: 0;
    visibility: hidden;

    /* transition: .3s; */

    /* ????????????????????????????????????????????????????????? */
    transform: translate3d(0, 3000px, 0);
  }

  .fade-in {
    animation-name: fade-in;
  }
</style>
