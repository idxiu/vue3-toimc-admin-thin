<template>
  <t-card class="p-4">
    <!-- Tabs -->
    <el-tabs
      v-model="activeName"
      class="mt-2"
      tab-position="left"
      style="height: 600px"
      @tab-click="handleClick"
    >
      <el-tab-pane label="基本信息" name="info">
        <setting-user-info-form></setting-user-info-form>
      </el-tab-pane>
      <el-tab-pane label="消息通知" name="article">
        <setting-user-notify></setting-user-notify>
      </el-tab-pane>
    </el-tabs>
  </t-card>
</template>

<script lang="ts">
  import type { TabsPaneContext } from 'element-plus'
  import SettingUserInfoForm from '@/views/pages/user/components/SettingUserInfoForm.vue'
  import SettingUserNotify from '@/views/pages/user/components/SettingUserNotify.vue'
  export default defineComponent({
    components: {
      SettingUserInfoForm,
      SettingUserNotify
    },
    setup() {
      const profile = {
        name: '张三',
        imageUrl:
          'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80',
        coverImageUrl:
          'https://images.unsplash.com/photo-1444628838545-ac4016a5418a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'
      }
      const activeName = ref('info')

      const handleClick = (tab: TabsPaneContext, event: Event) => {
        console.log(tab, event)
      }
      return {
        profile,
        activeName,
        handleClick
      }
    }
  })
</script>

<style scoped lang="scss">
  :deep(.el-tabs__nav-scroll) {
    width: 180px;

    .el-tabs__item {
      text-align: left;

      &.is-active {
        background-color: var(--el-color-primary-light-9);
      }
    }
  }
</style>
