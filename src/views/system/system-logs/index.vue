<template>
  <div class="p-4">
    <el-card>
      <!-- 条件查询 -->
      <!-- 条件查询 -->
      <el-form :inline="true" :model="formData" class="demo-form-inline">
        <el-form-item label="搜索日志">
          <el-input v-model="formData.keyWord" placeholder="请输入搜索日志" />
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="formData.createDate"
            type="daterange"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD"
            @change="onDateChange"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="onSubmit">查询</el-button>
          <el-button :icon="Refresh" @click="onRestForm">重置</el-button>
        </el-form-item>
      </el-form>
      <!-- 日志分类 -->
      <el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleTabChange">
        <el-tab-pane label="登录日志" name="1">
          <login-logs ref="loginLogsRef"></login-logs>
        </el-tab-pane>
        <el-tab-pane label="操作日志" name="2">
          <action-logs ref="actionLogsRef"></action-logs>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { ref } from 'vue'
  import { Search, Refresh } from '@element-plus/icons-vue'
  import type { TabPanelName } from 'element-plus'
  import LoginLogs from './components/LoginLogs.vue'
  import ActionLogs from './components/ActionLogs.vue'

  export default defineComponent({
    components: { LoginLogs, ActionLogs },
    setup() {
      const formData = ref({
        pageNo: 1,
        pageSize: 10,
        keyWord: '',
        createDate: [],
        createTime_begin: '',
        createTime_end: '',
        column: 'createTime',
        order: 'desc',
        logType: '1' //日志类型：1登录日志，2操作日志
      })
      const activeName = ref('1')
      const loginLogsRef = ref()
      const actionLogsRef = ref()
      onMounted(() => {
        console.log('onMounted')
        queryData()
      })
      const handleTabChange = (tab: TabPanelName) => {
        console.log('handleTabChange', tab)
        queryData()
      }
      //条件查询
      const onSubmit = () => {
        formData.value.pageNo = 1
        formData.value.pageSize = 10
        queryData()
      }
      //重置
      const onRestForm = () => {
        formData.value.keyWord = ''
        formData.value.createTime_begin = ''
        formData.value.createTime_end = ''
      }
      const queryData = () => {
        formData.value.logType = activeName.value
        console.log('activeName', activeName.value)
        let params = {
          pageNo: formData.value.pageNo,
          pageSize: formData.value.pageSize,
          keyWord: formData.value.keyWord,
          createTime_begin: formData.value.createTime_begin,
          createTime_end: formData.value.createTime_end,
          column: formData.value.column,
          order: formData.value.order
        }
        switch (activeName.value) {
          case '1':
            //登录日志
            loginLogsRef.value.queryData(params)
            break
          case '2':
            //操作日志
            actionLogsRef.value.queryData(params)
            break
          default:
            break
        }
      }
      // 日期改变
      const onDateChange = (e) => {
        console.log('日期改变', e)
        formData.value.createTime_begin = e[0]
        formData.value.createTime_end = e[1]
      }

      return {
        Search,
        Refresh,
        formData,
        activeName,
        loginLogsRef,
        actionLogsRef,
        handleTabChange,
        onDateChange,
        onSubmit,
        onRestForm
      }
    }
  })
</script>

<style scoped></style>
