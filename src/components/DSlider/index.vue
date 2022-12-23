<template>
  <el-slider
    ref="elSlider"
    v-bind="$attrs"
    v-model="value"
    :format-tooltip="formatTooltip"
    :style="style"
    :class="{ 'el-rainbow': rainbow }"
    :step="step"
    :max="max"
    :min="min"
    @change="handleChange"
    @input="handleInput"
  ></el-slider>
</template>

<script lang="ts">
  import type { CSSProperties } from 'vue'
  export default defineComponent({
    name: 'DSlider',
    props: {
      // 此处属不设置默认值，一旦设置默认值后，el本身支持的css全局变量将失效。
      // eslint-disable-next-line vue/require-default-prop
      color: {
        type: String
      },
      // eslint-disable-next-line vue/require-default-prop
      buttonSize: {
        type: Number
      },
      rainbow: {
        type: Boolean,
        default: false
      },
      modelValue: {
        type: [Number, Array] as PropType<number | number[]>,
        default: 0
      },
      formatTooltip: {
        type: Function as PropType<(val: number) => number | string>,
        default: undefined
      },
      tooltipVisible: {
        type: Boolean,
        default: false
      },
      min: {
        type: Number,
        default: 0
      },
      max: {
        type: Number,
        default: 100
      },
      step: {
        type: Number,
        default: 1
      }
    },
    emits: ['change', 'input'],
    setup(props, { emit }) {
      const { modelValue } = toRefs(props)
      const elSlider = ref()
      const currentValue = ref(modelValue.value)

      const style = computed<CSSProperties>(() => {
        const color = props.color
        const styleObject = {}
        if (color) {
          styleObject['--el-slider-main-bg-color'] = color
        }
        if (props.buttonSize) {
          styleObject['--el-slider-button-size'] = `${props.buttonSize}px`
        }
        return styleObject
      })

      watch(
        () => modelValue.value,
        (val) => {
          currentValue.value = val
        }
      )

      return {
        elSlider,
        handleChange(val: number) {
          currentValue.value = val
          emit('change', val)
        },
        handleInput(val: number) {
          currentValue.value = val
          emit('input', val)
        },
        value: currentValue,
        style
      }
    }
  })
</script>

<style scoped lang="scss">
  .el-slider.el-rainbow {
    :deep(.el-slider__bar) {
      background: linear-gradient(
        to right,
        #f00 0%,
        #ffb600 11%,
        #fff600 22%,
        #a5ff00 33%,
        #00a9ff 44%,
        #0400ff 55%,
        #8a00fc 66%,
        #ff00e9 77%,
        #ff0059 88%,
        #f00 100%
      );
    }
  }
</style>
