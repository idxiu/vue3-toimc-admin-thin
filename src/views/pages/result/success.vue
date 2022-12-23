<template>
  <div class="p-4">
    <t-card>
      <template #header>
        <div class="card-header">
          <span class="font-medium">成功页</span>
        </div>
      </template>
      <el-result
        icon="success"
        title="提交成功"
        sub-title="提交结果页用于反馈一系列操作任务的处理结果， 如果仅是简单操作，使用 Message 全局提示反馈即可。 本文字区域可以展示简单的补充说明，如果有类似展示 “单据”的需求，下面这个灰色区域可以呈现比较复杂的内容。"
      >
        <template #extra>
          <div class="flex">
            <el-button type="primary">返回列表</el-button>
            <el-button>查看项目</el-button>
            <el-button>打印</el-button>
          </div>
        </template>
      </el-result>
      <div style="background: rgb(250 250 250)" class="p-6 ml-10 mr-10">
        <el-descriptions title="项目名称" class="mb-5">
          <el-descriptions-item label="项目 ID：">15232</el-descriptions-item>
          <el-descriptions-item label="负责人：">Jerry</el-descriptions-item>
          <el-descriptions-item label="生效时间：">{{ lastBuildTime }}</el-descriptions-item>
        </el-descriptions>
        <el-steps :active="2">
          <el-step title="创建项目">
            <template #description>
              <p class="items-center">Jerry</p>
              <p>{{ lastBuildTime }}</p>
            </template>
          </el-step>
          <el-step title="部门初审">
            <template #description>
              <p class="flex items-center">
                toimc
                <span
                  role="img"
                  class="anticon anticon-dingding cursor-pointer flex items-center cursor-pointer"
                  style="margin-left: 8px; color: rgb(0 160 233)"
                >
                  <icon icon="ant-design:pushpin-filled" size="13px" />
                  催一下
                </span>
              </p>
            </template>
          </el-step>
          <el-step title="财务复核" />
          <el-step title="完成" />
        </el-steps>
      </div>
    </t-card>
  </div>
</template>

<script setup lang="ts">
  const { lastBuildTime } = __APP_INFO__
</script>

<style scoped>
  :deep(.el-descriptions__body) {
    background: transparent;
  }
</style>
