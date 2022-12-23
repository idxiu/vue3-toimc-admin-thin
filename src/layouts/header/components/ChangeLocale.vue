<template>
  <span id="header-internationalization" class="items">
    <drop-down :actions="localeList" :current="getCurrent" @command="handleCommand">
      <icon icon="ion:language" size="24px"></icon>
    </drop-down>
  </span>
</template>

<script lang="ts">
  // useLocale把vue-i18n的useI18n封装了一层，加入了cache
  import { useLocale } from '@/hooks/useLocale'
  import { LocaleType } from 'types/config'
  import { localeList } from '@/settings/localeSetting'
  import { defineComponent } from 'vue'

  export default defineComponent({
    setup() {
      const { changeLocale, getLocale } = useLocale()

      const getCurrent = computed(() => {
        return localeList.findIndex((item) => item.value + '' === getLocale.value)
      })

      function handleCommand(command: string) {
        changeLocale(command as LocaleType)
      }

      return {
        localeList,
        handleCommand,
        getCurrent
      }
    }
  })
</script>

<style scoped lang="scss"></style>
