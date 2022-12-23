<template>
  <div class="h-full p-4">
    <iframe class="wh-full" :src="frameSrc"></iframe>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'IframeIndex',
    setup() {
      const router = useRouter()

      // 获得iframe的src
      const frameSrc = computed<string>(() => {
        const current = router.currentRoute.value
        return (current.meta.frameSrc = current.meta.frameSrc || '') as string
      })

      return {
        frameSrc
      }
    }
  })
</script>

<style scoped></style>
