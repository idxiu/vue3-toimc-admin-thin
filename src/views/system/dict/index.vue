<template>
  <div class="p-4">
    <!-- 字典列表 -->
    <basic-table
      ref="tableRef"
      :border="true"
      :data="tableData"
      :columns="columns"
      :loading="loading"
      :default-sort="{ prop: 'date' }"
    >
      <template #header>
        <!-- 条件查询 -->
        <div class="mb-2">
          <el-form :inline="true" :model="formData" class="demo-form-inline">
            <el-form-item label="字典名称">
              <el-input v-model="formData.dictName" placeholder="请输入字典名称" />
            </el-form-item>
            <el-form-item label="字典编码">
              <el-input v-model="formData.dictCode" placeholder="请输入字典编码" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" :icon="Search" @click="onGetTableData">查询</el-button>
              <el-button :icon="Refresh" @click="onRestForm">重置</el-button>
              <el-button
                v-if="checkedKeys.length > 0"
                :icon="Delete"
                type="danger"
                @click="onDelDict"
                >批量删除</el-button
              >
            </el-form-item>
          </el-form>
        </div>
        <div class="flex mb-2">
          <el-button type="primary" icon="Plus" @click="addDict"> 新增</el-button>
        </div>
      </template>
      <template #action="{ row }">
        <el-button link type="primary" @click="handleAction(1, row)">编辑</el-button>
        <el-button link type="primary" @click="handleAction(2, row)">字典配置</el-button>
        <el-button link type="primary" @click="handleAction(3, row)">删除</el-button>
      </template>
      <!-- 分页 -->
      <template #footer-with-pagination>
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
      </template>
    </basic-table>

    <!-- 添加编辑字典 -->
    <add-or-edit-dict
      :show-dialog="showDialog"
      :is-edit="isEdit"
      :dict="editDictInfo"
      @close="showDialog = false"
      @success="addOrUpdateDictSuccess"
    ></add-or-edit-dict>
    <!-- 字典配置 -->
    <dict-config :show="showDictConf" :dict-id="dictId" @close="showDictConf = false"></dict-config>
  </div>
</template>

<script lang="ts">
  import { HttpResponse } from '@/api/sys/model/http'
  import { ColumnOptions } from '@/components/Table/types'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { queryDictList, deleteDict, deleteBatchDict } from '@/api/sys/dict'
  import { defineComponent } from 'vue'
  import AddOrEditDict from './components/AddOrEditDict.vue'
  import DictConfig from './components/DictConf.vue'
  import { Search, Refresh, Delete } from '@element-plus/icons-vue'
  import { DictItem } from '@/api/sys/model/dictModel'

  export default defineComponent({
    components: {
      AddOrEditDict,
      DictConfig
    },
    setup() {
      const tableRef = ref()
      const tableTotal = ref(0)
      const tableData = ref<DictItem[]>([])
      const dictId = ref<string>('')

      // table 数据正在加载
      const loading = ref(true)
      // 是否显示新增字典弹窗
      const showDialog = ref(false)
      // 是否显示字典配置
      const showDictConf = ref(false)
      // 是否编辑
      const isEdit = ref(false)
      // 编辑字典信息
      const editDictInfo = ref<DictItem>({ id: '' })

      const columns = [
        {
          type: 'selection',
          align: 'center'
        },
        {
          label: '字典名称',
          prop: 'dictName',
          align: 'center'
        },
        {
          label: '字典编号',
          prop: 'dictCode',
          align: 'center'
        },
        {
          label: '操作',
          slot: 'action',
          align: 'center'
        }
      ] as ColumnOptions[]

      const formData = ref({
        pageNo: 1,
        pageSize: 10,
        dictName: '',
        dictCode: '',
        column: 'createTime',
        order: 'desc'
      })
      //页数改变
      const handleCurrentChange = (page: number) => {
        formData.value.pageNo = page
        getTableList()
      }

      //条件查询字典
      const onGetTableData = () => {
        formData.value.pageNo = 1
        getTableList()
      }

      //重置
      const onRestForm = () => {
        formData.value.pageNo = 1
        formData.value.dictName = ''
        formData.value.dictCode = ''
      }

      // 查询字典列表
      const getTableList = () => {
        loading.value = true
        queryDictList(formData.value).then((res: HttpResponse) => {
          loading.value = false
          if (res.code === 0) {
            tableData.value = res.data.records as DictItem[]
            tableTotal.value = res.data.total
          } else {
            ElMessage.error(res.message)
          }
        })
      }
      getTableList()
      //新增字典
      const addDict = () => {
        editDictInfo.value = { id: '' }
        isEdit.value = false
        showDialog.value = true
      }
      // 添加修改字典成功
      const addOrUpdateDictSuccess = () => {
        getTableList()
      }

      //操作
      const handleAction = (index, row) => {
        switch (index) {
          case 1:
            //编辑
            editDictInfo.value = row
            isEdit.value = true
            showDialog.value = true
            console.log('编辑', row)
            break
          case 2:
            //字典配置
            dictId.value = row.id
            showDictConf.value = true
            break
          case 3:
            //删除
            ElMessageBox.confirm('确定删除吗？', '温馨提示').then(() => {
              deleteDict({ id: row.id }).then((res: HttpResponse) => {
                ElMessage({
                  message: `${res.message}`,
                  type: 'error'
                })
              })
            })
            break
          default:
            break
        }
      }

      const onDelDict = () => {
        ElMessageBox.confirm('是否删除选中数据?', '确认删除', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let checkIds = checkedKeys.value.map((item) => item.id)
          const data = {
            dictIds: checkIds.join(',')
          }
          deleteBatchDict(data).then((res: HttpResponse) => {
            if (res.code === 0) {
              ElMessage({
                message: `${res.message}`,
                type: 'success'
              })
              getTableList()
            } else {
              ElMessage({
                message: `${res.message}`,
                type: 'error'
              })
            }
          })
        })
      }

      const checkedKeys = computed(() => {
        return tableRef.value ? tableRef.value.getSelectionRows() || [] : []
      })

      return {
        Search,
        Refresh,
        Delete,
        checkedKeys,
        loading,
        tableRef,
        formData,
        tableTotal,
        columns,
        tableData,
        dictId,
        showDictConf,
        showDialog,
        isEdit,
        editDictInfo,
        handleCurrentChange,
        addDict,
        onDelDict,
        addOrUpdateDictSuccess,
        getTableList,
        handleAction,
        onGetTableData,
        onRestForm
      }
    }
  })
</script>

<style scoped>
  .el-form-item {
    margin-bottom: 0;
  }
</style>
