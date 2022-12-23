<template>
  <i
    v-if="isExternal"
    :style="{ height: height || size, width: width || size }"
    :class="[iconClass, className].join(' ')"
  />
  <svg
    v-else
    :class="svgClass"
    aria-hidden="true"
    :style="{ height: height || size, width: width || size }"
  >
    <use :xlink:href="iconName" />
  </svg>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  const customCache = new Set<string>()
  export default defineComponent({
    name: 'SvgIcon',
    props: {
      // 图标类名
      iconClass: {
        type: String,
        required: true,
        default: 'iconfont'
      },
      // svg图标的类名
      className: {
        type: String,
        default: ''
      },
      // iconfont url链接
      url: {
        type: String,
        default: ''
      },
      // 宽度
      width: {
        type: [Number, String],
        default: ''
      },
      // 高度
      height: {
        type: [Number, String],
        default: ''
      },
      // 如果设置了size，可以不用设置width和height
      size: {
        type: [Number, String],
        default: ''
      }
    },
    setup(props) {
      function loadUrl(url: string): void {
        if (/^(https?:|mailto:|tel:)/.test(url)) {
          const link = document.createElement('link')
          link.href = url
          link.rel = 'stylesheet'
          customCache.add(url)
          document.body.appendChild(link)
        }
      }
      // props.iconClass 为 url类型，说明为iconfont引用
      const isExternal = /^(https?:|mailto:|tel:)/.test(props.url) && !customCache.has(props.url)
      // 加载iconfont字体
      isExternal && loadUrl(props.url)

      const iconName = `#icon-${props.iconClass}`
      const svgClass = props.className ? `svg-icon ${props.className}` : 'svg-icon '

      return {
        isExternal,
        iconName,
        svgClass
      }
    }
  })
</script>

<style lang="scss" scoped>
  .svg-icon {
    overflow: hidden;
    vertical-align: -0.15em;
    fill: currentcolor;
  }
</style>
