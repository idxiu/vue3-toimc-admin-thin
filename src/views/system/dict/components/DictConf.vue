<template>
  <el-drawer :model-value="show" direction="rtl" size="930px" @close="onClose">
    <template #header>
      <h4 class="divide-y divide-gray-500/50">字典列表【{{ dictId }}】</h4>
    </template>
    <template #default>
      <div class="overflow-auto" style="width: 100%; max-height: 700px">
        <!-- 条件查询 -->
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="名称">
            <el-input v-model="formInline.itemText" placeholder="请输入名称" />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="formInline.status" placeholder="请选择状态">
              <el-option label="请选择" value="" />
              <el-option label="启用" value="1" />
              <el-option label="不启用" value="0" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="onSubmit">查询</el-button>
            <el-button :icon="Refresh" @click="onRestForm">重置</el-button>
            <el-button type="primary" @click="onAddOrEditItem(null)">新增</el-button>
          </el-form-item>
        </el-form>

        <!-- 列表表格数据 -->
        <el-table
          ref="multipleTableRef"
          v-loading="loading"
          :data="tableData"
          style="width: 100%"
          border
          align="center"
        >
          <el-table-column property="itemText" label="名称" align="center" />
          <el-table-column property="itemValue" label="数据值" align="center" />
          <el-table-column property="status_dictText" label="状态" width="80" align="center" />
          <el-table-column label="操作" width="120" align="center">
            <template #default="scope">
              <el-button type="text" size="small" @click="onAddOrEditItem(scope.row)"
                >编辑</el-button
              >
              <el-popconfirm
                title="是否确认删除?"
                confirm-button-text="确认"
                cancel-button-text="取消"
                @confirm="confirmDelEvent(scope.row)"
              >
                <template #reference>
                  <el-button type="text" size="small">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <div class="mt-4 flex justify-end">
          <el-pagination
            v-model:currentPage="formInline.pageNo"
            background
            :page-size="formInline.pageSize"
            layout="prev, pager, next"
            :total="tableTotal"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </template>
  </el-drawer>
  <!-- 添加编辑字典配置项-->
  <add-or-edit-dict-conf-item
    :show="showAddEditDictConf"
    :dict="dictInfo"
    :is-edit="isEditDictConf"
    :dict-id="dictId"
    @close="showAddEditDictConf = false"
  >
  </add-or-edit-dict-conf-item>
</template>

<script lang="ts">
  import { ref, defineComponent } from 'vue'
  import { queryDictItemList, deleteDictItemConf } from '@/api/sys/dict'
  import { HttpResponse } from '@/api/sys/model/http'
  import { ElMessage } from 'element-plus'
  import AddOrEditDictConfItem from './AddOrEditDictConfItem.vue'

  import { Search, Refresh } from '@element-plus/icons-vue'
  import { DictItems } from '@/api/sys/model/dictModel'
  export default defineComponent({
    components: {
      AddOrEditDictConfItem
    },
    props: {
      show: {
        type: Boolean,
        default: false
      },
      //字典ID
      dictId: {
        type: String,
        default: ''
      }
    },
    emits: ['close'],
    setup(props, ctx) {
      const formInline = reactive({
        itemText: '',
        status: '',
        pageNo: 1,
        pageSize: 10,
        dictId: props.dictId
      })
      const dictInfo = ref<DictItems>({ id: '' })
      const loading = ref(false)
      const showAddEditDictConf = ref(false)
      const isEditDictConf = ref(false)
      const tableData = ref<DictItems[]>([])
      const tableTotal = ref(0)
      // 表格操作区删除字典配置项
      const confirmDelEvent = (row) => {
        const data = {
          id: row.id
        }
        deleteDict(data)
      }
      //请求删除字典配置项
      const deleteDict = (data) => {
        deleteDictItemConf(data).then((res: HttpResponse) => {
          if (res.code === 0) {
            ElMessage({
              type: 'success',
              message: '删除成功'
            })
            //重新查询列表
            onSubmit()
          } else {
            ElMessage({
              type: 'error',
              message: res.message
            })
          }
        })
      }

      //条件查询
      const onSubmit = () => {
        formInline.pageNo = 1
        formInline.pageSize = 10
        getTableList()
      }
      //查询列表
      const getTableList = () => {
        formInline.dictId = props.dictId

        loading.value = true
        queryDictItemList(formInline).then((res: HttpResponse) => {
          console.log('res', res)
          tableData.value = res.data.records as DictItems[]
          loading.value = false
          tableTotal.value = res.data.total
        })
      }
      // 分页变化
      const handleCurrentChange = (val: number) => {
        formInline.pageNo = val
        getTableList()
      }
      //重置
      const onRestForm = () => {
        formInline.itemText = ''
        formInline.status = ''
      }

      const onAddOrEditItem = (row) => {
        console.log('editUser', row)
        if (row) {
          //编辑字典项
          dictInfo.value = row
          isEditDictConf.value = true
        } else {
          dictInfo.value = { id: '', status: 1, sortOrder: 1 }
          isEditDictConf.value = false
        }
        showAddEditDictConf.value = true
      }

      // 弹窗关闭
      const onClose = () => {
        ctx.emit('close')
      }

      watch(
        () => props.dictId,
        () => {
          onSubmit()
        },
        {
          immediate: true
        }
      )
      return {
        Search,
        Refresh,
        dictInfo,
        loading,
        formInline,
        tableData,
        tableTotal,
        showAddEditDictConf,
        isEditDictConf,
        onAddOrEditItem,
        handleCurrentChange,
        confirmDelEvent,
        onSubmit,
        onRestForm,
        onClose
      }
    }
  })
</script>
<style scoped lang="scss">
  :deep(.el-drawer__header) {
    margin-bottom: 0;
  }
</style>
