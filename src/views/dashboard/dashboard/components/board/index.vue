<template>
  <t-card
    :header="title"
    tips="true"
    :class="{
      'dashboard-card': true,
      'no-border': !haveBorder
    }"
    :body-style="{
      ...bodyStyle,
      height: '100%'
    }"
    shadow="never"
  >
    <template #tips>
      <icon v-if="type === 'pie'" icon="ep:data-line"></icon>
      <icon v-if="type === 'line'" icon="ep:pie-chart"></icon>
      <icon v-if="type === 'bar'" icon="ep:histogram"></icon>
    </template>
    <d-echarts v-if="type === 'pie'" :option="pieOptions"></d-echarts>
    <d-echarts v-if="type === 'line'" :option="lineOptions"></d-echarts>
    <d-echarts v-if="type === 'bar'" :option="barOptions"></d-echarts>
  </t-card>
</template>

<script lang="ts">
  import { CSSProperties, defineComponent } from 'vue'
  import * as echarts from 'echarts'

  export default defineComponent({
    name: 'EchartsBoard',
    props: {
      title: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        default: 'line'
      },
      data: {
        type: Object,
        default: () => ({})
      },
      haveBorder: {
        type: Boolean,
        default: true
      },
      hoverShadow: {
        type: Boolean,
        default: true
      },
      bodyStyle: {
        type: Object as PropType<CSSProperties>,
        default: () => ({})
      }
    },
    setup(props) {
      const lineOptions = ref<any>({
        color: ['#80FFA5', '#00DDFF'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        grid: {
          left: '1%',
          right: '3%',
          bottom: '1%',
          top: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: [
              '1月',
              '2月',
              '3月',
              '4月',
              '5月',
              '6月',
              '7月',
              '8月',
              '9月',
              '10月',
              '11月',
              '12月'
            ]
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '签单',
            type: 'line',
            smooth: true,
            lineStyle: {
              width: 3
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.6,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgb(128, 255, 165)'
                },
                {
                  offset: 1,
                  color: 'rgb(1, 191, 236)'
                }
              ])
            },
            emphasis: {
              focus: 'series'
            },
            data: props.data.line1
          },
          {
            name: '回款',
            type: 'line',
            smooth: true,
            lineStyle: {
              width: 3
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.6,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgb(0, 221, 255)'
                },
                {
                  offset: 1,
                  color: 'rgb(77, 119, 255)'
                }
              ])
            },
            emphasis: {
              focus: 'series'
            },
            data: props.data.line2
          }
        ]
      })
      const pieOptions = ref<any>({
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['35%', '55%'],
            avoidLabelOverlap: true,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            labelLine: {
              show: true,
              length: 8
            },
            data: props.data.pie
          }
        ]
      })
      const barOptions = ref<any>({
        color: '#4e53df',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        dataset: [
          {
            dimensions: ['name', 'score'],
            source: props.data.bar
          },
          {
            transform: {
              type: 'sort',
              config: { dimension: 'score', order: 'desc' }
            }
          }
        ],
        grid: {
          left: '1%',
          right: '5%',
          bottom: '1%',
          top: '1%',
          containLabel: true
        },
        xAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          type: 'category',
          inverse: true,
          axisLabel: { interval: 0, rotate: 0 }
        },
        series: {
          type: 'bar',
          encode: { x: 'score', y: 'name' },
          datasetIndex: 1,
          itemStyle: {
            borderRadius: 30
          }
        }
      })

      return { pieOptions, lineOptions, barOptions }
    }
  })
</script>

<style scoped lang="scss">
  .dashboard-card {
    margin: 0 5px;
    background-color: transparent;
    box-sizing: border-box;

    :deep(.el-card) {
      height: 100%;
    }

    :deep(.chart) {
      height: 200px;
    }
  }

  .no-border {
    :deep(.el-card) {
      border: none;
    }
  }

  // .hover-shadow {
  //   &:hover {
  //     box-shadow: 0 0 15px #b3b3b3;
  //     transition: all 0.2s;
  //   }
  // }
</style>
