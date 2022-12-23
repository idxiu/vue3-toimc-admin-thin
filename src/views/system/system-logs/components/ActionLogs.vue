<template>
  <div class="">
    <basic-table
      ref="tableRef"
      :wrapper="false"
      :border="true"
      :data="tableData"
      :columns="actionColumns"
      :loading="loading"
    >
      <template #expand="{ row }">
        <div class="px-6">
          <div style="margin-bottom: 5px">
            <el-badge
              is-dot
              type="success"
              class="item"
              style="display: inline-flex; vertical-align: middle"
            ></el-badge>
            <span style="margin-left: 4px; vertical-align: middle"
              >请求方法:{{ row.method }}</span
            ></div
          >
          <div>
            <el-badge
              type="primary"
              is-dot
              class="item"
              style="display: inline-flex; vertical-align: middle"
            ></el-badge>
            <span style="margin-left: 4px; vertical-align: middle"
              >请求参数:{{ row.requestParam }}</span
            ></div
          >
        </div>
      </template>
      <template #action="{ row }">
        <el-button @click="handleDetail(row)">查询</el-button>
      </template>
    </basic-table>

    <!-- 分页 -->
    <div class="mt-4 flex justify-end">
      <el-pagination
        v-model:currentPage="formData.pageNo"
        background
        :page-size="formData.pageSize"
        layout="prev, pager, next"
        :total="tableTotal"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { ref } from 'vue'
  import { actionColumns } from './tabColumns'
  import { getLogList } from '@/api/sys/logs'
  import { HttpResponse } from '@/api/sys/model/http'
  export default defineComponent({
    setup() {
      const loading = ref(false)
      const tableRef = ref()
      const tableTotal = ref(0)
      const formData = ref({
        logType: 2,
        pageNo: 1,
        pageSize: 10
      })

      const tableData = ref([])
      const queryData = (params) => {
        console.log('操作日志 queryData', params)
        formData.value = { ...formData.value, ...params }
        getTableData()
      }
      //查询列表数据
      const getTableData = () => {
        loading.value = true
        getLogList(formData.value).then((res: HttpResponse) => {
          tableData.value = res.data
          loading.value = false
          tableData.value = res.data.records
          tableTotal.value = res.data.total
        })
      }
      //页数改变
      const handleCurrentChange = (page: number) => {
        formData.value.pageNo = page
        getTableData()
      }
      const handleDetail = (row) => {
        console.log('查看详情', row)
        tableRef.value.toggleRowExpansion(row)
      }
      return {
        loading,
        tableRef,
        tableData,
        formData,
        tableTotal,
        actionColumns,
        queryData,
        handleDetail,
        handleCurrentChange
      }
    }
  })
</script>

<style scoped></style>
