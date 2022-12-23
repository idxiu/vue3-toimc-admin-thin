import { getCurrentInstance, onBeforeUnmount, ref, Ref, shallowRef, unref } from 'vue'
import { useRafThrottle } from '@/utils/domUtils'
import { isDef } from '@/utils/is'
import { removeResizeListener, addResizeListener } from '@/utils/event'

const GAP_MAP = {
  small: [50, 25],
  default: [100, 50],
  large: [200, 100]
}

export function useWatermark(
  appendEl: Ref<HTMLElement | null> = ref(document.body) as Ref<HTMLElement>
) {
  const func = useRafThrottle(function () {
    const el = unref(appendEl)
    if (!el) return
    const { clientHeight: height, clientWidth: width } = el
    updateWatermark({ height, width })
  })
  const watermarkEl = shallowRef<HTMLElement>()

  const clear = () => {
    const domId = unref(watermarkEl)
    watermarkEl.value = undefined
    const el = unref(appendEl)
    if (!el) return
    domId && el.removeChild(domId)
    removeResizeListener(el, func)
    if (isDef(el.dataset.__position)) {
      el.style.position = el.dataset.__position
    }
  }

  function text2base64(str: string, fontSize = 20, gap = 'small') {
    const can = document.createElement('canvas')
    // const width = 300
    // const height = 240
    // Object.assign(can, { width, height })
    can.width = 3000
    can.height = 3000

    const ctx = can.getContext('2d')
    if (ctx) {
      ctx.font = `${fontSize}px Vedana`
      // 基于文字内容计算文字宽度推算图片高度
      const size = ctx.measureText(str)
      const rotate = (-20 * Math.PI) / 120
      const width = size.width
      const height = size.width * -Math.sin(rotate) + fontSize

      // 画布放大 留间距
      can.width = width + GAP_MAP[gap][0] + fontSize
      can.height = height + GAP_MAP[gap][1]

      ctx.font = `${fontSize}px Vedana`
      ctx.rotate(rotate)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'
      ctx.fillText(str, 0, can.height)
    }
    return can.toDataURL('image/png')
  }

  interface WatermarkOptions {
    width?: number
    height?: number
    str?: string
    fontSize?: number
    imgUrl?: string
    gap?: string // ['small', 'default', 'large']
  }
  function updateWatermark(options: WatermarkOptions = {}) {
    const el = unref(watermarkEl)
    if (!el) return
    if (isDef(options.width)) {
      el.style.width = `${options.width}px`
    }
    if (isDef(options.height)) {
      el.style.height = `${options.height}px`
    }

    if (isDef(options.imgUrl)) {
      el.style.background = `url(${options.imgUrl}) left top repeat`
    } else if (isDef(options.str)) {
      el.style.background = `url(${text2base64(
        options.str,
        options.fontSize,
        options.gap
      )}) left top repeat`
    }
  }

  const createWatermark = (str: string | WatermarkOptions) => {
    const options = typeof str === 'string' ? { str } : str
    if (unref(watermarkEl)) {
      updateWatermark(options)
      return
    }
    const div = document.createElement('div')
    watermarkEl.value = div
    // div.id = id
    div.style.pointerEvents = 'none'
    div.style.top = '0px'
    div.style.left = '0px'
    div.style.position = 'absolute'
    div.style.zIndex = '100000'
    const el = unref(appendEl)
    if (!el) return
    const { clientHeight: height, clientWidth: width } = el
    updateWatermark({ ...options, width, height })
    el.appendChild(div)
    return
  }

  function setWatermark(str: string | WatermarkOptions) {
    createWatermark(str)
    const el = unref(appendEl)
    if (el) {
      const position = el.style.position
      if (!['relative', 'absolute', 'fixed'].includes(position)) {
        el.dataset.__position = position
        el.style.position = 'relative'
      }
      addResizeListener(el, func)
    } else {
    }
    const instance = getCurrentInstance()
    if (instance) {
      onBeforeUnmount(() => {
        clear()
      })
    }
  }

  return { setWatermark, clear }
}
