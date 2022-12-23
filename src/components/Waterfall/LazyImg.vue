<template>
  <div class="lazy__box">
    <img ref="lazyRef" class="lazy__img" />
  </div>
</template>

<script lang="ts">
  // import type { Ref } from 'vue'
  import { defineComponent, inject, onMounted, onUnmounted, ref } from 'vue'
  import type Lazy from './types/lazy'
  import { CallbackParams, LoadedEmitParams } from './types/lazy'
  import type { Nullable } from './types/util'

  export default defineComponent({
    props: {
      url: {
        type: String,
        default: ''
      },
      width: {
        type: String,
        default: '100%'
      }
    },
    emits: ['loaded'],
    setup(props, { emit }) {
      const lazy = inject('lazy') as Lazy
      const lazyRef = ref<Nullable<HTMLImageElement>>(null)

      onMounted(() => {
        render()
      })

      onUnmounted(() => {
        unRender()
      })

      function render() {
        if (!lazyRef.value) return

        lazy.mount(lazyRef.value, props.url, (params) => {
          const { height, width } = params as CallbackParams
          emit('loaded', {
            dom: lazyRef.value,
            src: props.url,
            width,
            height
          } as LoadedEmitParams)
        })
      }

      function unRender() {
        if (!lazyRef.value) return

        lazy.unmount(lazyRef.value)
      }

      return {
        lazyRef
      }
    }
  })
</script>

<style scoped>
  .lazy__box {
    display: flex;
    width: 100%;
    justify-content: center;
  }

  .lazy__img {
    display: block;
  }

  .lazy__img[lazy='loading'] {
    width: 48px;
    padding: 5em 0;
  }

  .lazy__img[lazy='loaded'] {
    width: 100%;
  }

  .lazy__img[lazy='error'] {
    width: 48px;
    padding: 5em 0;
  }
</style>
