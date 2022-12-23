<template>
  <div class="inline-flex flex-col justify-center items-center">
    <div class="mb-4 relative flex" @click="() => (show = true)">
      <el-avatar :src="src" :shape="shape" :size="size" :alt="alt" :fit="fit"></el-avatar>
      <span
        class="absolute left-0 top-0 w-full h-full flex items-center justify-center transition-opacity duration-500 bg-dark-600 rounded-1/2 bg-opacity-40 opacity-0 hover:opacity-100 cursor-pointer"
      >
        <icon icon="ant-design:cloud-upload-outlined" :size="getIconWidth" color="#d6d6d6"></icon>
      </span>
    </div>
    <div @click="() => (show = true)">
      <slot name="trigger">
        <el-button v-if="showBtn" type="primary">选择图片</el-button>
      </slot>
    </div>
    <cropper-modal v-model="show" :image="src"></cropper-modal>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    props: {
      image: {
        type: String,
        default: ''
      },
      shape: {
        type: String as PropType<'circle' | 'square'>,
        default: 'circle'
      },
      size: {
        type: [Number, String] as PropType<number | 'large' | 'default' | 'small'>,
        default: 200
      },
      alt: {
        type: String,
        default: ''
      },
      fit: {
        type: String as PropType<'fill' | 'contain' | 'cover' | 'none' | 'scale-down'>,
        default: 'cover'
      },
      showBtn: {
        type: Boolean,
        default: true
      }
    },
    setup(props) {
      const src = ref(props.image || '')
      const show = ref(false)

      const getIconWidth = computed(() => parseInt(`${props.size}`.replace(/px/, '')) / 2 + 'px')

      return {
        src,
        show,
        getIconWidth
      }
    }
  })
</script>

<style scoped></style>
