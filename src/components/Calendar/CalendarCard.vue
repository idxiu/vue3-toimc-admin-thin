<template>
  <div :class="{ 'inline-block': inline }">
    <div
      :class="{ 'x-shadow': shadow }"
      class="flex bg-white rounded-lg p-4"
      :style="{ width: `${width}px`, 'font-size': `${fontSize}px`, height: finalHeight }"
    >
      <div v-show="showLeft" class="calendar-left">
        <div class="left-top">
          <p>{{ week() }}</p>
          <i>{{ date }}</i>
        </div>
        <div class="left-bottom" :style="{ 'margin-bottom': `${finalMargin}px` }">
          <p>{{ yearAndMonth }}</p>
          <p>{{ lunar }}</p>
        </div>
      </div>
      <div v-show="showRight" ref="calendarWrapperRef" class="calendar-wrapper">
        <el-calendar ref="calendarRef">
          <template #date-cell="{ data }">
            <div :style="{ margin: `${finalMargin}px 0` }">
              {{ data.cellMargin }}
              {{ dayjs(data.date).date() }}
            </div>
          </template>
        </el-calendar>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import dayjs from 'dayjs'
  import { solar2lunar } from '@/utils/calendar'

  // 当前日期
  const date = dayjs().date()
  // 当前年月
  const yearAndMonth = dayjs().format('YYYY年MM月')
  // 当前农历
  const lunarDate = solar2lunar(dayjs().format('YYYY-MM-DD')) as any
  // 当前星期
  function week() {
    const day = dayjs().day()
    return (
      '周' +
      (day === 0
        ? '日'
        : day === 1
        ? '一'
        : day === 2
        ? '二'
        : day === 3
        ? '三'
        : day === 4
        ? '四'
        : day === 5
        ? '五'
        : '六')
    )
  }

  export default defineComponent({
    name: 'CalendarCard',
    props: {
      // 卡片宽度
      width: {
        type: [Number, String],
        default: 350
      },
      // 卡片高度
      height: {
        type: [Number, String],
        default: null
      },
      // 卡片布局
      layout: {
        type: String as PropType<'left' | 'right' | 'all'>,
        default: 'all'
      },
      // 卡片文字大小
      fontSize: {
        type: [Number, String],
        default: 22
      },
      // 是否为行内组件
      inline: {
        type: Boolean,
        default: false
      },
      // 是否显示阴影
      shadow: {
        type: Boolean,
        default: false
      }
    },
    setup(props) {
      const calendarRef = ref<any>()
      const calendarWrapperRef = ref<any>()

      const finalMargin = ref(0)
      const finalHeight = ref('100%')

      // 计算 Margin 是右侧自适应
      const calculateMargin = (): number => {
        const calendarWrapperDom = calendarWrapperRef.value
        let wrapperHeight = 0
        if (!props.height) {
          wrapperHeight = calendarWrapperDom?.clientHeight as number
        } else {
          wrapperHeight = Number(props.height) - 32
        }
        const residualHeight = wrapperHeight - calendarRef.value.$el.clientHeight
        return residualHeight / 12
      }

      // 获得组件最终高度
      const getFinalHeight = () => {
        if (props.height) {
          return props.height + 'px'
        } else {
          return '100%'
        }
      }

      // 是否显示左侧日期
      const showLeft = computed(() => {
        return props.layout === 'left' || props.layout === 'all'
      })

      // 是否显示右侧日历
      const showRight = computed(() => {
        return props.layout === 'right' || props.layout === 'all'
      })

      onMounted(() => {
        finalHeight.value = getFinalHeight()
        finalMargin.value = calculateMargin()
      })

      return {
        date,
        week,
        yearAndMonth,
        lunar: `${lunarDate.IMonthCn}${lunarDate.IDayCn}`,
        dayjs,
        calendarRef,
        calendarWrapperRef,
        finalMargin,
        showLeft,
        showRight,
        finalHeight
      }
    }
  })
</script>

<style lang="scss" scoped>
  .x-shadow {
    box-shadow: var(--el-box-shadow-light);
  }

  .calendar-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-right: 0.5em;

    p {
      white-space: nowrap;
    }

    .left-top {
      font-size: 0.7em;

      p {
        color: rgb(218 48 48);
      }

      i {
        font-size: 2.6em;
        font-style: normal;
      }
    }

    .left-bottom {
      font-size: 0.6em;
    }
  }

  .calendar-wrapper {
    :deep(.el-calendar) {
      .el-calendar__header {
        display: none;
      }

      .el-calendar__body {
        padding: 0;
      }

      .el-calendar-table {
        font-size: 0.6em;

        th {
          padding: 0.2em 0;
        }
      }

      .el-calendar-table__row {
        .el-calendar-day {
          height: 100%;
          padding: 0;
          text-align: center;
        }

        td {
          border: 0;
        }
      }
    }
  }
</style>
