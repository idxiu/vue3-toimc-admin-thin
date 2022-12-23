<template>
  <span class="items" @click="changeDarkMode">
    <icon :icon="iconName" size="20px" />
  </span>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { useSettingsStore } from '@/store/modules/settings'
  import { storeToRefs } from 'pinia'
  export default defineComponent({
    setup() {
      const settingsStore = useSettingsStore()
      const { darkMode } = storeToRefs(settingsStore)
      const iconName = computed(() => {
        if (darkMode.value) {
          return 'ep:sunny'
        } else {
          return 'ep:moon'
        }
      })

      const changeDarkMode = () => {
        settingsStore.$state.darkMode = darkMode.value ? false : true
      }

      return {
        iconName,
        changeDarkMode
      }
    }
  })
</script>
