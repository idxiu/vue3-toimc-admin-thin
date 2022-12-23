<template>
  <div
    :class="['flex items-center', classes]"
    :style="{ 'font-size': typeof size === 'string' ? size : size + 'px', ...style }"
    v-bind="$attrs"
  >
    <slot name="prefix"></slot>
    <div :class="[{ 'break-all': breakAll }]">{{ result }}</div>
    <slot name="suffix"></slot>
  </div>
</template>

<script lang="ts">
  import { CSSProperties, defineComponent } from 'vue'
  import bigInt from 'big-integer'
  import { rand } from '@/utils'
  import { isFunction, isNumber } from 'lodash-es'

  export default defineComponent({
    props: {
      begin: {
        type: [Number, String],
        default: 0
      },
      end: {
        type: [Number, String],
        default: 0,
        required: true
      },
      duration: {
        type: Number,
        default: 3000
      },
      setupDuration: {
        type: Number,
        default: 10
      },
      dot: {
        type: Number,
        default: 0
      },
      classes: {
        type: String,
        default: 'd-numbers'
      },
      auto: {
        type: Boolean,
        default: true
      },
      breakAll: {
        type: Boolean,
        default: false
      },

      size: {
        type: [Number, String],
        default: '16px'
      },
      style: {
        type: Object as PropType<CSSProperties>,
        default: () => ({})
      },
      // todo
      split: {
        type: String,
        default: ''
      },
      // 比如，可以由,或者.来分隔数据
      // 比如，可以设置单位，千，百，万，亿，兆
      // unit: {
      //   type: String as PropType<>,
      //   default: '',
      // }
      // 比如，用户可以定义format格式
      format: {
        type: Function,
        default: null
      }
    },
    setup(props, { expose }) {
      const { setupDuration } = unref(props)
      const { begin, end, dot, duration } = toRefs(props)

      const status = ref(false)
      const pauseFlag = ref(false)

      const result = ref<string>('')

      let ctrl

      // 先把带小数的数放大，倍数是：10的倍数 的 小数位数 次方，比如：1.12345，那么放大后是：1.12345 * 10^5
      function getTimesNum(number, times) {
        const str = number.toString()
        if (str.indexOf('.') !== -1) {
          return bigInt(str.split('.')[0])
            .multiply(times)
            .add(
              bigInt(str.split('.')[1])
                .multiply(times)
                .divide(bigInt(10).pow(str.split('.')[1].length))
            )
        } else {
          return bigInt(number.toString()).multiply(times)
        }
      }

      // 加分隔符
      function formatWithSeperator(val: string, separator: string) {
        const num = val.split('.')
        let x1 = num[0]
        const x2 = num.length > 1 ? '.' + num[1] : ''
        const rgx = /(\d+)(\d{3})/
        if (separator && !isNumber(separator)) {
          while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + separator + '$2')
          }
        }
        return x1 + x2
      }

      // 格式化
      function format(number, digits) {
        // 用户传递了format方法，直接返回
        if (isFunction(props.format)) {
          return formatWithSeperator(props.format(number), props.split)
        }
        const str = number.toString()
        let tmp
        if (digits > 0) {
          if (str.indexOf('.') === -1) {
            // number中无"."
            tmp = (str + '.').padEnd(digits + str.length + 1, '0')
          } else {
            // number中无中有".""
            if (str.split('.')[1].length > digits) {
              tmp = str.split('.')[0] + '.' + str.split('.')[1].substr(0, digits)
            } else {
              tmp = str.split('.')[0] + '.' + str.split('.')[1].padEnd(digits, '0')
            }
          }
        } else {
          tmp = str.substr(0, str.length - digits)
        }
        return formatWithSeperator(tmp, props.split)
      }

      function init() {
        clearInterval(ctrl)

        status.value = true
        let durationCount = 0

        // 放大dot的对应的点数
        let times
        let origin
        let target

        // 如果end包含小数点，放大的倍数需要大于小数点的位数
        if (end.value.toString().indexOf('.') !== -1) {
          const dotsPart = end.value.toString().split('.')[1]
          if (dot.value > dotsPart?.length || 0) {
            // 指定的小数点数大于end的小数点数
            times = bigInt(10).pow(dot.value)
          } else {
            times = bigInt(10).pow(dotsPart.length)
          }
        } else {
          // 不包含小数点
          times = bigInt(10).pow(dot.value)
        }

        // 初始值与结束值
        origin = getTimesNum(begin.value, times)
        target = getTimesNum(end.value, times)

        // 计算定时器的倍率
        let rate = bigInt(duration.value).divide(setupDuration)
        console.log('🚀 ~ file: DNumbers.vue ~ line 178 ~ init ~ rate', rate)

        // 计算step
        let step = rate.compareAbs(bigInt.zero) !== 0 ? target.minus(origin).divide(rate) : target

        ctrl = setInterval(() => {
          // 暂停
          if (pauseFlag.value) return
          // 总时间计时
          durationCount += setupDuration

          let tempStep = step
          // TODO 加入ease
          if (step.compareAbs(bigInt.zero) === 1) {
            const len = step.toString().length
            // 加入随机性，这样就不会有很多0
            if (Math.random() > 0.5) {
              if (len > 3) {
                tempStep = bigInt(tempStep).add(bigInt(rand(len - 3)))
              }
            }
            tempStep = bigInt(tempStep)
              .multiply(Math.floor(Math.random() * 11) + 95)
              .divide(100)
            // step = bigInt(rand(len))
          } else {
            tempStep = bigInt(1)
          }

          origin = origin.add(tempStep)

          // format
          let divide = origin.divmod(times)

          let tmp =
            divide.quotient.toString() +
            (dot.value > 0 ? '.' : '') +
            (divide.remainder.toString() !== '0'
              ? divide.remainder.toString().length < dot.value
                ? divide.remainder.toString().padEnd(dot.value, '0')
                : divide.remainder.toString()
              : '')

          tmp = isFunction(props.format) ? props.format(tmp) : tmp
          result.value = formatWithSeperator(tmp, props.split)
          // 如果达到目标值，则停止
          if (origin.compareAbs(target) === 1 || durationCount >= duration.value) {
            result.value = format(end.value, dot.value)
            status.value = false
            clearInterval(ctrl)
          }
        }, setupDuration)
      }

      onMounted(() => {
        if (props.auto) {
          init()
        } else {
          result.value = format(begin.value, dot.value)
        }
      })

      onBeforeUnmount(() => {
        clearInterval(ctrl)
        status.value = false
        ctrl = null
      })

      function start() {
        init()
      }

      function terminate() {
        status.value = false
        pauseFlag.value = false
        clearInterval(ctrl)
        // result.value =
      }

      async function reset() {
        terminate()
        result.value = format(begin.value, dot.value)
      }

      function pause() {
        pauseFlag.value = true
      }

      function resume() {
        pauseFlag.value = false
      }

      expose({
        status,
        start,
        terminate,
        reset,
        pause,
        resume
      })

      return {
        result
      }
    }
  })
</script>

<style scoped lang="scss">
  .break-all {
    word-break: break-all;
  }
</style>
