<template>
  <div ref="chartRef" class="chart"></div>
</template>

<script lang="ts">
  import { ECharts, init } from 'echarts'
  import { debounce } from 'lodash-es'

  export default defineComponent({
    props: {
      option: {
        type: Object,
        default: () => {}
      },
      responsive: {
        type: Boolean,
        default: true
      }
    },
    setup(props: any) {
      const chartRef = ref<ECharts>()
      let echartsInstance: ECharts | undefined

      function resize() {
        echartsInstance?.resize()
      }

      function destroy() {
        if (props.responsive) {
          window.removeEventListener('resize', resize)
        }
      }

      onUnmounted(destroy)

      onMounted(() => {
        if (props.responsive) {
          window.addEventListener('resize', debounce(resize, 200))
        }
        echartsInstance = init(chartRef.value as unknown as HTMLElement)
        echartsInstance.setOption(props.option)
      })

      return { chartRef }
    }
  })
</script>

<style lang="scss" scoped>
  .chart {
    width: 100%;
    height: 400px;
  }
</style>
