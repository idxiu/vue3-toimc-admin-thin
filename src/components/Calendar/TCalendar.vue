<template>
  <div :class="['t-calendar', { 't-inline': inline }]">
    <el-calendar ref="calendar" v-model="localValue" :style="style">
      <template #header="{ date }">
        <slot name="header" :date="date" :value="localValue">
          <div v-if="showTool" class="w-full flex justify-between items-center">
            <div>
              {{ date }}
            </div>
            <el-button-group>
              <el-button
                v-for="(item, index) in toolList"
                :key="'tool' + index"
                @click="selectDate(item)"
              >
                {{ defaultTools[item] }}
              </el-button>
            </el-button-group>
          </div>
          <div v-else></div>
        </slot>
      </template>
      <template #date-cell="{ data }">
        <slot name="date-cell" :data="data">
          <div :class="['h-full flex', wrapperCls]" @click="handleCellClick(data)">
            <div class="c-day">{{ solar2lunar(data.day).cDay }}</div>
            <div class="addition">
              <span v-if="showDayCn" :class="{ 'pr-2': showGzDay || showAstro }">{{
                solar2lunar(data.day).IDayCn
              }}</span>
              <span>
                <span v-if="showGzDay" class="pr-1">
                  {{ solar2lunar(data.day).gzDay }}
                </span>
                <span v-if="showAstro" class="<lg:hidden">
                  {{ solar2lunar(data.day).astro }}
                </span>
              </span>
            </div>
          </div>
        </slot>
      </template>
    </el-calendar>
  </div>
</template>

<script lang="ts">
  import dayjs from 'dayjs'
  import { solar2lunar } from '@/utils/calendar'
  import { isFunction } from 'lodash-es'

  const defaultTools = {
    'prev-year': '上一年',
    'prev-month': '上一月',
    today: '今天',
    'next-month': '下一月',
    'next-year': '下一年'
  }

  export type IToolType = keyof typeof defaultTools

  type FormatterFuncType = (val: any) => string

  export default defineComponent({
    name: 'Calendar',
    props: {
      showTool: {
        type: Boolean,
        default: true
      },
      toolList: {
        type: Array as PropType<IToolType[]>,
        default: () => ['prev-year', 'prev-month', 'today', 'next-month', 'next-year']
      },
      value: {
        type: [Date, Number, String],
        default: new Date()
      },
      // 格式化方法
      format: {
        type: Function as PropType<FormatterFuncType>,
        default: null
      },
      // 是否显示农历
      showDayCn: {
        type: Boolean,
        default: true
      },
      // 是否显示干支纪年法
      showGzDay: {
        type: Boolean,
        default: false
      },
      // 是否显示星座
      showAstro: {
        type: Boolean,
        default: false
      },
      position: {
        type: String as PropType<'center' | 'left' | 'right' | 'left-between' | 'right-between'>,
        default: ''
      },
      size: {
        type: String as PropType<'small' | 'large' | 'default'>,
        default: 'default'
      },
      border: {
        type: Boolean,
        default: true
      },
      inline: {
        type: Boolean,
        default: false
      }
    },
    emits: ['cell-click', 'update:value'],
    setup(props, { emit }) {
      const { value, showDayCn, showGzDay, showAstro, border, size } = toRefs(props)
      const { format } = unref(props)

      const calendar = ref<any>(null)

      // 设置日历的值
      const selectDate = (val: IToolType) => calendar.value.selectDate(val)

      // 点击单元格的回调
      const handleCellClick = (data) => emit('cell-click', data)

      const localValue = computed({
        get() {
          return dayjs(value.value).toDate()
        },
        set(value) {
          emit('update:value', isFunction(format) ? format(value) : value)
        }
      })

      const wrapperCls = computed(() => {
        const cls = ['calendar-wrapper']
        if (props.position) {
          cls.push(` calendar-wrapper-${props.position}`)
        }
        if (showDayCn.value) {
          cls.push(' show-day-cn')
        }
        if (showGzDay.value) {
          cls.push(' show-gz-day')
        }
        if (showAstro.value) {
          cls.push(' show-astro')
        }
        return cls.join('')
      })

      return {
        defaultTools,
        calendar,
        dayjs,
        selectDate,
        solar2lunar,
        handleCellClick,
        localValue,
        wrapperCls,
        style: computed(() => {
          const borderObj = !border.value ? { '--el-calendar-border': 0 } : {}

          let tmpsize
          if (size.value === 'small') {
            tmpsize = 50
          } else if (size.value === 'large') {
            tmpsize = 120
          }
          const sizeObj =
            size.value !== 'default' ? { '--el-calendar-cell-width': tmpsize + 'px' } : {}
          return { ...borderObj, ...sizeObj }
        })
      }
    }
  })
</script>

<style lang="scss" scoped>
  // stylelint-disable scss/operator-no-unspaced
  .t-calendar {
    &.t-inline {
      :deep(.el-calendar-table) {
        display: inline;
        width: auto;
      }
    }

    .calendar-wrapper {
      @apply flex-col items-center justify-center;

      .addition {
        @apply flex w-full justify-center text-sm font-light xl:text-[12px];
      }

      .c-day {
        @apply pb-2;
      }

      &.calendar-wrapper-center {
        @apply justify-center;
      }

      &.calendar-wrapper-right,
      &.calendar-wrapper-right-between {
        @apply justify-between items-end;

        .addition {
          @apply justify-end;

          .pr-1 {
            padding-right: unset;
          }
        }
      }

      &.calendar-wrapper-left,
      &.calendar-wrapper-left-between {
        @apply justify-between items-start;

        .addition {
          @apply justify-start;
        }
      }

      &.calendar-wrapper-left-between,
      &.calendar-wrapper-right-between {
        .addition {
          @apply justify-between;
        }
      }
    }
  }
</style>
