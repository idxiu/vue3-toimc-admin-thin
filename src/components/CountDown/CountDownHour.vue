<template>
  <count-down-wrapper :font-size="fontSize">
    <div class="h-full" :style="{ backgroundColor }">
      <h2
        class="truncate flex flex-wrap justify-center items-center"
        style="height: 40%; font-size: 0.8em"
        :style="{ color: fontColor }"
      >
        {{ title }}
      </h2>
      <div
        class="flex justify-center"
        style="height: 40%; font-size: 1.6em; font-weight: 700"
        :style="{ color: fontColor }"
      >
        {{ result }}
      </div>
    </div>
  </count-down-wrapper>
</template>

<script lang="ts">
  import { countdown } from './utils'
  export default defineComponent({
    name: 'CountDownBase',
    props: {
      fontSize: {
        type: [String, Number],
        default: 18
      },
      backgroundColor: {
        type: String,
        default: '#64A099'
      },
      fontColor: {
        type: String,
        default: '#FFF'
      },
      title: {
        type: String,
        required: true
      },
      endText: {
        type: String,
        default: ''
      },
      date: {
        type: [String, Date],
        required: true
      }
    },
    setup(props) {
      const result = ref('')
      let timer: NodeJS.Timer
      function getValue() {
        result.value = countdown(props.date, props.endText)
        clearTimeout(timer)
        timer = setTimeout(() => {
          getValue()
        }, 1000)
      }

      onMounted(() => {
        getValue()
      })

      onUnmounted(() => {
        clearTimeout(timer)
      })

      return {
        result
      }
    }
  })
</script>

<style lang="scss" scoped></style>
