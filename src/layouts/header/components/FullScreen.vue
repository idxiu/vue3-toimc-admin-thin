<template>
  <span @click="toggle">
    <icon :icon="!isFullscreen ? 'ep:full-screen' : 'ri:fullscreen-exit-fill'"></icon>
  </span>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    setup() {
      const { toggle, isFullscreen } = useFullscreen()
      return {
        toggle,
        isFullscreen
      }
    }
  })
</script>

<style scoped></style>
