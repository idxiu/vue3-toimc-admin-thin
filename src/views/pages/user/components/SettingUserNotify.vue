<template>
  <h2 class="border-b border-gray-200 mb-4 pb-2">消息通知</h2>
  <ul role="list" class="mt-2 divide-y divide-gray-200 px-4">
    <li v-for="(item, index) in list" :key="index" class="py-4 flex items-center justify-between">
      <div class="flex flex-col">
        <p class="text-sm font-medium text-gray-900">{{ item.name }}</p>
        <p class="text-sm text-gray-500">{{ item.desc }}</p>
      </div>
      <el-switch v-model="item.isOpen" inline-prompt active-text="开" inactive-text="关" />
    </li>
  </ul>
</template>

<script lang="ts">
  export default defineComponent({
    name: 'SettingUserNotify',
    components: {},
    setup() {
      const list = reactive([
        {
          name: '账户密码',
          desc: '其他用户的消息将以站内信的形式通知',
          isOpen: false
        },
        {
          name: '系统消息',
          desc: '系统消息将以站内信的形式通知',
          isOpen: false
        },
        {
          name: '待办任务',
          desc: '待办任务将以站内信的形式通知',
          isOpen: false
        }
      ])
      return { list }
    }
  })
</script>

<style scoped lang="scss"></style>
