<template>
  <div class="p-4">
    <t-card header="">
      <el-row>
        <el-col :span="2">
          <el-avatar :src="header" :size="64"></el-avatar>
        </el-col>
        <el-col :span="18">
          <el-row class="font-bold text-xl text-gray-600"
            >{{ hiMorning }}{{ store.userInfo.username }}，{{ randomCtsen }}
          </el-row>
          <el-row class="text-gray-400 text-sm pt-1 flex-col">
            <p>最近更新：1.0正式版本发布~</p>
            <p
              >欢迎使用！<el-link
                type="primary"
                :underline="false"
                href="https://github.com/toimc-team/vue-toimc-admin"
                >仓库地址
              </el-link>
            </p>
          </el-row>
        </el-col>
        <el-row :span="4" class="flex-col items-center">
          <avatar-list :images="images" :gutter="10" direction="horizontal"></avatar-list>
          <p class="text-sm text-gray-300 pt-2">项目核心贡献者们</p>
        </el-row>
      </el-row>
    </t-card>
    <div class="w-full grid grid-cols-2 gap-2 pt-3">
      <t-card header="开源项目信息" :tips="{ content: '版本统计', placement: 'top' }">
        <template #suffix>
          <el-tag type="">最后构建时间：{{ lastBuildTime }}</el-tag>
        </template>
        <descriptions :column="2" title="" :items="infoSchema" :collapse="false"></descriptions>
      </t-card>
      <div class="grid grid-cols-2 gap-2">
        <t-card
          header="下载量"
          reverse
          :tips="true"
          footer-class="!px-0 pt-1 text-sm text-gray-500"
        >
          <template #tips>
            <icon icon="ant-design:bar-chart-outlined" class="mr-1" :size="'22px'"></icon>
          </template>
          <template #suffix>
            <el-tag type="success">日</el-tag>
          </template>
          <v-charts
            ref="rendsChart"
            type="LineChart"
            :options="lineOptions"
            :style="{ height: '177px' }"
            class="pb-2"
          >
          </v-charts>
          <template #footer>
            <div class="flex justify-between">
              <span>总量：{{ formatNumber(totalTrends) }}</span>
              <span>日均：{{ formatNumber(Math.floor(totalTrends / 5)) }}</span>
            </div>
          </template>
        </t-card>
        <t-card
          header="访问量"
          reverse
          :tips="true"
          footer-class="!px-0 pt-1 text-sm text-gray-500"
        >
          <template #tips>
            <icon icon="ant-design:bar-chart-outlined" class="mr-1" :size="'22px'"></icon>
          </template>
          <template #suffix>
            <el-tag type="warning">周</el-tag>
          </template>
          <v-charts
            ref="barChart"
            type="LineChart"
            :options="barOptions"
            :style="{ height: '173px' }"
            class="pb-2"
          >
          </v-charts>
          <template #footer>
            <div class="flex justify-between">
              <span>总量：{{ formatNumber(totalDownloads) }}</span>
              <span>
                <el-tag type="info">倒计时:{{ counter }}s</el-tag>
              </span>
            </div>
          </template>
        </t-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import header from '@/assets/images/brian.jpg'
  import dayjs from 'dayjs'
  import { useUserStore } from '@/store/modules/user'
  import { random, sample, pull } from 'lodash-es'
  import { DescItem } from '@/components/Descriptions/types'
  import * as echarts from 'echarts'
  import { formatNumber } from '@/utils'

  const modules = import.meta.glob('@/assets/images/headers/**/*.jpeg', {
    eager: true,
    import: 'default'
  })

  export default defineComponent({
    name: 'Welcome',
    setup() {
      const images = ref([] as string[])
      const arr = [
        '又是元气满满的一天哦~',
        '今天也要加油哦~',
        '加油！',
        '开心每一天~',
        '快乐每一天~'
      ]

      const store = useUserStore()
      const rendsChart = ref()
      const barChart = ref()
      const timer = ref()
      const timer1 = ref()
      const counter = ref(5)

      const { pkg, lastBuildTime } = __APP_INFO__

      Object.keys(modules).forEach((key) => {
        const mod = modules[key] || ''
        images.value.push(mod as string)
      })

      const hiMorning = computed(() => (dayjs().format('A') === 'AM' ? '早上好' : '下午好'))

      // 下载量
      const lineOptions = ref<any>({
        tooltip: {
          trigger: 'axis',
          extraCssText: 'z-index:1'
        },
        grid: {
          top: '5%',
          left: '2%',
          right: '4%',
          bottom: '0%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: [],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '访问量',
            type: 'line',
            data: [],
            smooth: true,
            areaStyle: {},
            itemStyle: {
              borderRadius: [0, 5, 5, 0],
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                1,
                0,
                ['#3DD572', '#3A9efd'].map((color, offset) => ({
                  color,
                  offset
                }))
              )
            }
          }
        ]
      })
      const barOptions = ref<any>({
        tooltip: {
          trigger: 'axis',
          extraCssText: 'z-index:1'
        },
        grid: {
          top: '5%',
          left: '2%',
          right: '4%',
          bottom: '0%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['0时', '4时', '8时', '12时', '16时', '20时', '24时'],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '授权数',
            type: 'bar',
            barWidth: '60%',
            data: [1002, 5322, 3220, 4233, 3319, 1133, 3222],
            itemStyle: {
              borderRadius: [2, 2, 0, 0],
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                ['#379eff', '#7ca9fd'].map((color, offset) => ({
                  color,
                  offset
                }))
              )
            }
          }
        ]
      })

      onMounted(() => {
        const base = +new Date(2022, 1, 1)
        const oneDay = 24 * 3600 * 1000
        const date = [] as string[]

        const data = [Math.random() * 1500]
        let now = new Date(base)

        const addData = (shift?: boolean) => {
          const nowStr = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/')
          date.push(nowStr)
          data.push(random(20000, 60000))

          if (shift) {
            date.shift()
            data.shift()
          }
          now = new Date(+new Date(now) + oneDay)
          lineOptions.value.xAxis[0].data = []
          lineOptions.value.series[0].data = []
          lineOptions.value.xAxis[0].data = date
          lineOptions.value.series[0].data = data
        }

        for (let i = 1; i < 6; i++) {
          addData()
        }

        rendsChart.value.setOption(lineOptions.value)

        timer.value = setInterval(() => {
          addData(true)
          rendsChart.value?.setOption(lineOptions.value)
        }, 5000)

        barChart.value?.setOption(barOptions.value)
        timer1.value = setInterval(() => {
          if (counter.value > 0) {
            counter.value--
          } else {
            barOptions.value.series[0].type = sample(
              pull(['bar', 'line', 'scatter'], barOptions.value.series[0].type)
            )
            counter.value = 5
          }
          barChart.value?.setOption(barOptions.value)
        }, 1000)
      })

      onUnmounted(() => {
        clearInterval(timer.value)
        timer.value = null
      })
      // 下载量 end

      const { dependencies, devDependencies, version } = pkg
      const infoSchema: DescItem[] = [
        {
          label: 'Vue',
          field: dependencies['vue']
        },
        {
          label: 'Vite',
          field: devDependencies['vite']
        },
        {
          label: 'TypeScript',
          field: devDependencies['typescript']
        },
        {
          label: 'Pinia',
          field: dependencies['pinia']
        },
        {
          label: 'Vue Router',
          field: dependencies['vue-router']
        },
        {
          label: 'element-plus',
          field: dependencies['element-plus']
        },
        {
          label: 'tailwind',
          field: devDependencies['tailwindcss']
        },
        {
          label: 'vitest',
          field: devDependencies['vitest']
        },
        {
          label: '最新版本',
          field: version
        }
      ]

      return {
        rendsChart,
        barChart,
        header,
        images,
        hiMorning,
        store,
        randomCtsen: arr[Math.floor(Math.random() * arr.length)],
        lineOptions,
        totalTrends: computed(() =>
          Math.floor(lineOptions.value.series[0].data.reduce((prev, cur) => prev + cur, 0))
        ),
        totalDownloads: computed(() =>
          Math.floor(barOptions.value.series[0].data.reduce((prev, cur) => prev + cur, 0))
        ),
        barOptions,
        // 构建时间
        lastBuildTime,
        infoSchema,
        formatNumber,
        counter
      }
    }
  })
</script>

<style scoped lang="scss"></style>
