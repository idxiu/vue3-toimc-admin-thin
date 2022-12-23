<template>
  <div
    v-for="(item, index) in lists"
    :key="index"
    class="inline-flex flex-wrap px-3 pb-2 hover:text-blue-400 cursor-pointer"
    @click="handleSelect({ ...item, value: item.name })"
    >{{ item.name }}</div
  >
</template>

<script lang="ts">
  import { PropType } from 'vue'
  import { CityCSVData } from './types'
  export default defineComponent({
    props: {
      lists: {
        type: Array as PropType<CityCSVData[]>,
        default: () => []
      }
    },
    emits: ['click'],
    setup(_props, { emit }) {
      const handleSelect = (val) => {
        emit('click', val)
      }

      return {
        handleSelect
      }
    }
  })
</script>

<style scoped></style>
