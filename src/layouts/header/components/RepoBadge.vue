<template>
  <span @click="setStorage">
    <el-badge :value="state.github ? 'new' : ''" class="badge">
      <el-link :underline="false" :href="GITHUB_URL" target="_blank">
        <icon icon="ant-design:github-filled" size="24px"></icon>
      </el-link>
    </el-badge>
  </span>
</template>

<script lang="ts">
  import { GITHUB_URL } from '@/settings/siteSetting'
  import { defineComponent } from 'vue'

  export default defineComponent({
    setup() {
      const state = useStorage('my-repo', { github: true })

      function setStorage() {
        state.value.github = false
      }

      return {
        GITHUB_URL,
        state,
        setStorage
      }
    }
  })
</script>

<style scoped></style>
