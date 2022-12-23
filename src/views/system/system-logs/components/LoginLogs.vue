<template>
  <div class="">
    <basic-table
      ref="tableRef"
      :wrapper="false"
      :border="true"
      :data="tableData"
      :columns="loginColumns"
      :loading="loading"
    >
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
  import { loginColumns } from './tabColumns'
  import { getLogList } from '@/api/sys/logs'
  import { HttpResponse } from '@/api/sys/model/http'
  export default defineComponent({
    setup() {
      const loading = ref(false)
      const tableTotal = ref(0)
      const formData = ref({
        logType: 1,
        pageNo: 1,
        pageSize: 10
      })

      const tableData = ref([])
      const queryData = (params) => {
        console.log('登录日志 queryData', params)
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
      return {
        loading,
        tableData,
        formData,
        tableTotal,
        loginColumns,
        queryData,
        handleCurrentChange
      }
    }
  })
</script>

<style scoped></style>
