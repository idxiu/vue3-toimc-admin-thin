<template>
  <div class="p-4">
    <t-card header="节流指令示例" class="text-lg font-bold">
      <div class="flex items-center justify-center mt-10 mb-10">
        <el-button v-throttle="throttleClick" type="primary">节流按钮 (每隔1S秒后执行)</el-button>
      </div>
    </t-card>
  </div>
</template>

<script setup lang="ts">
  import { ElMessage } from 'element-plus'
  const throttleClick = () => {
    ElMessage.success('节流按钮触发事件')
  }
</script>
