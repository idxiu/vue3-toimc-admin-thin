<template>
  <div>
    <component :is="tag" ref="wrapRef" />
  </div>
</template>

<script lang="ts">
  import type { QRCodeRenderersOptions, LogoType, QrcodeDoneEventParams } from './types'
  import { toDataURL } from 'qrcode'

  import { toCanvas } from './utils'
  import { downloadByUrl } from '@/utils/file/download'

  export default defineComponent({
    props: {
      value: {
        type: [String, Array] as PropType<string | any[]>,
        default: null
      },
      // 参数
      options: {
        type: Object as PropType<QRCodeRenderersOptions>,
        default: null
      },
      // 宽度
      width: {
        type: Number as PropType<number>,
        default: 200
      },
      // 中间logo图标
      logo: {
        type: [String, Object] as PropType<Partial<LogoType> | string>,
        default: ''
      },
      // img 不支持内嵌logo
      tag: {
        type: String as PropType<'canvas' | 'img'>,
        default: 'canvas',
        validator: (v: string) => ['canvas', 'img'].includes(v)
      },
      auto: {
        type: Boolean,
        default: true
      }
    },
    emits: { done: (data: QrcodeDoneEventParams) => !!data, error: (error: any) => !!error },
    setup(props, { emit, expose }) {
      const wrapRef = ref<HTMLCanvasElement | HTMLImageElement | null>(null)
      async function createQrcode() {
        try {
          const { tag, value, options = {}, width, logo } = props
          const renderValue = String(value)
          const wrapEl = unref(wrapRef)

          if (!wrapEl) return

          if (tag === 'canvas') {
            const url: string = await toCanvas({
              canvas: wrapEl,
              width,
              logo: logo as any,
              content: renderValue,
              options: options || {}
            })
            emit('done', { url, ctx: (wrapEl as HTMLCanvasElement).getContext('2d') })
            return
          }

          if (tag === 'img') {
            const url = await toDataURL(renderValue, {
              errorCorrectionLevel: 'H',
              width,
              ...options
            })
            ;(unref(wrapRef) as HTMLImageElement).src = url
            emit('done', { url })
          }
        } catch (error) {
          emit('error', error)
        }
      }

      /**
       * 文件下载
       */
      function download(fileName?: string) {
        let url = ''
        const wrapEl = unref(wrapRef)
        if (wrapEl instanceof HTMLCanvasElement) {
          url = wrapEl.toDataURL()
        } else if (wrapEl instanceof HTMLImageElement) {
          url = wrapEl.src
        }
        if (!url) return
        downloadByUrl({
          url,
          fileName
        })
      }

      onMounted(createQrcode)

      // 监听参数变化重新生成二维码
      watch(
        props,
        () => {
          props.auto && createQrcode()
        },
        {
          deep: true
        }
      )

      expose({
        update: createQrcode,
        download
      })

      return { wrapRef, download }
    }
  })
</script>

<style scoped></style>
