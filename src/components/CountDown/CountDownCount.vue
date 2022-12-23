<template>
  <count-down-wrapper :font-size="fontSize">
    <div class="w-full h-full relative text-center" :style="{ backgroundColor }">
      <div class="w-full h-full">
        <div
          class="flex flex-col justify-between items-center h-full w-full"
          style="padding: 0.9em"
        >
          <div class="truncate" style="font-size: 0.6em" :style="{ color: fontColor }">
            {{ title }}
          </div>
          <p class="inline" style="font-size: 1.7em" :style="{ color: fontColor }">
            <span style="font-weight: 700">{{ diff }}</span>
            <i style="font-size: 12px; font-style: normal"> 天 </i>
          </p>
          <p class="mt-1" style="font-size: 0.6em" :style="{ color: fontColor }">{{ finalDate }}</p>
        </div>
      </div>
    </div>
  </count-down-wrapper>
</template>

<script lang="ts">
  import { dayFormat, calculateDay } from './utils'

  export default defineComponent({
    props: {
      fontSize: {
        type: [String, Number],
        default: 18
      },
      backgroundColor: {
        type: String,
        default: '#FFF'
      },
      fontColor: {
        type: String,
        default: '#9e726f'
      },
      title: {
        type: String,
        default: '和她❤️恋爱已经',
        required: true
      },
      date: {
        type: [String, Date, Number],
        required: true
      }
    },
    setup(props) {
      const finalDate = computed(() => dayFormat(props.date))
      const diff = computed(() => -calculateDay(props.date))
      return {
        finalDate,
        diff
      }
    }
  })
</script>

<style lang="scss" scoped></style>
