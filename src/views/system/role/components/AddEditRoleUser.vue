<template>
  <el-drawer :model-value="show" direction="rtl" size="650px" @close="onClose">
    <template #header>
      <h4 class="divide-y divide-gray-500/50">新增/编辑用户</h4>
    </template>
    <template #default>
      <div></div>
    </template>
  </el-drawer>
</template>

<script>
  export default defineComponent({
    props: {
      show: {
        type: Boolean,
        default: false
      },
      //用户
      user: {
        type: Object,
        default: () => null
      }
    },
    emits: ['close'],
    setup(props, ctx) {
      console.log('user', props.user)
      // 弹窗关闭
      const onClose = () => {
        ctx.emit('close')
      }

      return {
        onClose
      }
    }
  })
</script>

<style></style>
