<template>
  <collapse-transition>
    <template #default>
      <div v-show="!collapse">
        <slot></slot>
      </div>
    </template>
  </collapse-transition>
</template>

<script lang="ts">
  export default defineComponent({
    props: {
      collapse: {
        type: Boolean,
        default: false
      }
    },
    setup() {}
  })
</script>

<style scoped></style>
