<template>
  <count-down-wrapper :font-size="fontSize">
    <div class="w-full h-full" :style="{ backgroundColor }">
      <div class="w-full h-full flex flex-col justify-between items-start" style="padding: 0.9em">
        <div class="truncate" style="font-size: 0.6em" :style="{ color: fontColor }">
          {{ title }}
        </div>
        <p class="inline-block" style="font-size: 2em" :style="{ color: fontColor }">
          <span style="font-weight: 600">{{ diff }}</span>
          <i style="font-size: 12px; font-style: normal">天</i>
        </p>
        <p class="mt5" style="font-size: 0.6em" :style="{ color: fontColor }"> {{ finalDate }} </p>
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
        default: '#EEE1DA'
      },
      fontColor: {
        type: String,
        default: '#9e726f'
      },
      title: {
        type: String,
        required: true
      },
      date: {
        type: [String, Date],
        required: true
      }
    },
    setup(props) {
      const finalDate = computed(() => dayFormat(props.date))
      const diff = computed(() => calculateDay(props.date))
      return {
        finalDate,
        diff
      }
    }
  })
</script>

<style scoped></style>
