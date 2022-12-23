<template>
  <div class="p-4">
    <t-card>
      <template #header>
        <div class="card-header">
          <span class="font-medium">失败页</span>
        </div>
      </template>
      <el-result icon="error" title="提交失败" sub-title="请核对并修改以下信息后，再重新提交。">
        <template #extra>
          <el-button type="primary">返回修改</el-button>
        </template>
      </el-result>
      <el-descriptions
        :column="1"
        title="您提交的内容有如下错误："
        style="background: rgb(250 250 250)"
        class="p-6 ml-10 mr-10"
      >
        <el-descriptions-item>
          <span class="flex items-center -mt-6">
            <icon icon="ant-design:close-circle-outlined" size="18px" color="#F56C6C" />
            <span class="ml-4 mr-6">您的账户已被冻结</span>
            <a
              href="javascript:void(0);"
              class="flex items-center"
              style="color: var(--el-color-primary)"
            >
              立即解冻
              <icon icon="ant-design:right-outlined" size="18px" color="#3894ff" />
            </a>
          </span>
        </el-descriptions-item>
        <el-descriptions-item>
          <span class="flex items-center -mt-8">
            <icon icon="ant-design:close-circle-outlined" size="18px" color="#F56C6C" />
            <span class="ml-4 mr-6">您的账户还不具备申请资格</span>
            <a
              href="javascript:void(0);"
              class="flex items-center"
              style="color: var(--el-color-primary)"
            >
              立即升级
              <icon icon="ant-design:right-outlined" size="18px" color="#3894ff" />
            </a>
          </span>
        </el-descriptions-item>
      </el-descriptions>
    </t-card>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
  :deep(.el-descriptions__body) {
    background: transparent;
  }
</style>
