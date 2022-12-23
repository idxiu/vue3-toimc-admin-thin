<template>
  <count-down-wrapper :font-size="fontSize">
    <div class="w-full h-full">
      <div class="h-full relative">
        <h2
          class="truncate flex flex-wrap justify-center items-center"
          style="height: 30%; font-size: 0.7em"
          :style="{ backgroundColor, color: fontColor }"
          >{{ title }}</h2
        >
        <div
          class="flex flex-wrap items-center justify-center"
          style="height: 70%; font-size: 3em; font-weight: 700"
          :style="{ color: backgroundColor, backgroundColor: fontColor }"
        >
          {{ diff }}
        </div>
      </div>
    </div>
  </count-down-wrapper>
</template>

<script lang="ts">
  import { calculateMountDay } from './utils'
  export default defineComponent({
    props: {
      fontSize: {
        type: [String, Number],
        default: 18
      },
      title: {
        type: String,
        required: true
      },
      backgroundColor: {
        type: String,
        default: '#0092FA'
      },
      fontColor: {
        type: String,
        default: '#FFF'
      },
      date: {
        type: Number,
        required: true
      }
    },
    setup(props) {
      const diff = computed(() => calculateMountDay(props.date))

      return {
        diff
      }
    }
  })
</script>
<style lang="scss" scoped></style>
