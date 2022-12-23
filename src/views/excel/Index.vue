<template>
  <div>
    <el-card class="margin">
      <el-input-number v-model="number" :min="5" :max="700" />
      <el-alert
        :title="`当前读取的${fileName}excel文件为${number}列（A列-${col}列）`"
        style="margin-top: 20px"
        type="info"
        :closable="false"
      />
    </el-card>
    <el-card class="margin">
      <el-upload action="" :on-change="inExcel" :limit="1">
        <el-button type="primary">导入数据</el-button>
      </el-upload>
      <el-empty v-if="sourceExcelData.length === 0" description="暂未上传excel"></el-empty>
      <el-tabs v-else v-model="excelTabName" @tab-click="changeTable">
        <el-tab-pane
          v-for="(item, key) in sourceExcelData"
          :key="getKeyColumn(item).key"
          :label="getKeyColumn(item).key"
          :name="getKeyColumn(item).key"
        >
          <div class="flex-start">
            <el-input
              v-model="excelVal"
              placeholder="请输入Excel表A列关键字搜索"
              suffix-icon="el-icon-search"
              class="mr input"
              @change="search(item, key)"
            >
            </el-input>
            <el-button type="primary" @click="search(item, key)">搜索</el-button>
          </div>
          <table-comp
            ref="tableRef"
            :table-data="excelPageData"
            :is-page="false"
            is-index
            is-choose
            :table-columns="columns"
            is-computed
            :minus="350"
            @select="selectExcel"
          >
            <template #options="{ row, index }">
              <el-button type="text" @click="updateMore(row, index)">修改更多</el-button>
            </template>
            <template v-for="(ele, i) in tagColumn" #[ele]="scope" :key="ele">
              <div>
                <el-input
                  v-show="excelPageData[scope.index].isEdit && ele === editColumn"
                  v-model="scope.row[ele]"
                  style="width: 140px"
                ></el-input>
                <div
                  v-show="!excelPageData[scope.index].isEdit || ele !== editColumn"
                  style="display: inline"
                >
                  <span>{{ ele && scope.row[ele] }}</span>
                </div>
                <el-icon
                  v-show="getIsEdit(scope, ele, i)"
                  class="edit"
                  @click="edit(scope.index, true, scope.row, scope.column.property)"
                  ><tickets />
                </el-icon>
                <el-icon
                  v-show="excelPageData[scope.index].isEdit && ele === editColumn"
                  class="edit"
                  @click="edit(scope.index, false, scope.row, '')"
                  ><circle-check-filled />
                </el-icon>
              </div>
            </template>
            <template #footer>
              <el-button type="primary" @click="outExcel">全部导出当前excel表</el-button>
              <el-button type="primary" @click="outExcelByChoose"
                >将勾选的数据导出excel表</el-button
              >
            </template>
          </table-comp>
        </el-tab-pane>
      </el-tabs>
      <div class="pagination-box">
        <el-pagination
          v-model:currentPage="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="excelData.length"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <modal-update-row ref="update" @change-table-by-row="changeTableByRow"></modal-update-row>
  </div>
</template>

<script lang="ts">
  import storage from 'good-storage'
  import { ElMessage } from 'element-plus'
  import { TabsPaneContext } from 'element-plus'
  import { defineComponent, ref, Ref, onMounted, computed, watch } from 'vue'
  import TableComp from './TableComp.vue'
  import UseExcelTemp from './UseExcelTemp'
  import ModalUpdateRow from './ModalUpdateRow.jsx'
  type Obj = {
    [x: string]: string | number | boolean
  }
  export default defineComponent({
    components: {
      TableComp,
      ModalUpdateRow
    },
    setup() {
      let currentPage = ref(1)
      let pageSize = ref(10)
      let number = ref(5)
      let excelTabName = ref('')
      let excelVal = ref('')
      let editColumn = ref('')
      let fileName = ref('')
      let isUpdate = ref(false)
      const update = ref()
      const tableRef = ref()
      const select: Ref<object[]> = ref([])
      const excelData: Ref<object[]> = ref([])
      const excelPageData: Ref<any[]> = ref([])
      const sourceExcelData: Ref<object[]> = ref([])
      const inputOptions: Ref<string[]> = ref([
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z'
      ])
      const columns = ref([
        {
          label: 'excel表A列',
          prop: 'A',
          minLength: 150
        },
        {
          label: 'excel表B列',
          prop: 'B',
          minLength: 150
        },
        {
          label: 'excel表C列',
          prop: 'C',
          minLength: 150
        },
        {
          label: 'excel表D列',
          prop: 'D',
          minLength: 150
        },
        {
          label: 'excel表E列',
          prop: 'E',
          minLength: 150
        },
        {
          label: '操作',
          prop: 'options',
          minLength: 150
        }
      ])
      const tagColumn = computed(() => inputOptions.value.slice(0, 5))
      onMounted(() => {
        getInputArr()
        initPaging()
        fileName.value = storage.session.get('fileName', '')
        const source = storage.session.get('sourceExcelData', [])
        if (source.length > 0) {
          sourceExcelData.value = source
          excelTabName.value = getKeyColumn(source[0]).key
          getTableData(source[0][excelTabName.value])
        }
      })
      watch(
        sourceExcelData,
        (newValue) => {
          const value = newValue ? newValue[0] : {}
          const currentKey = Object.keys(value) || []
          const key = currentKey && currentKey[0]
          excelTabName.value = key
        },
        { deep: true }
      )
      const col = computed(() => inputOptions.value[number.value - 1])
      const excelColumns = computed(() => inputOptions.value.slice(0, number.value))
      const getInputArr = () => {
        let data: string[] = []
        inputOptions.value.forEach((first) => {
          inputOptions.value.forEach((second) => {
            data.push(first + second)
          })
        })
        const filterData = [...inputOptions.value, ...data]
        inputOptions.value = filterData
      }
      const getIsEdit = (scope, item, index) => {
        const isEditColumn = !excelPageData.value[scope.index]['isEdit']
        const isEditRow = item !== editColumn.value
        const EditIndex = tagColumn.value.findIndex((item) => item === editColumn.value)
        const isShowOther = editColumn.value ? index === EditIndex : true
        return isEditColumn && isEditRow && isShowOther
      }
      const edit = (index, isEdit, row, property) => {
        if (!isEdit) {
          editColumn.value = property
          excelPageData.value = excelPageData.value.map((item, i) => {
            if (i === index) {
              return {
                ...row,
                isEdit: false
              }
            }
            return item
          })
          changeTableByEdit(row, index)
          return
        }
        editColumn.value = property
        excelPageData.value = excelPageData.value.map((item, i) => {
          if (i === index) {
            return {
              ...item,
              isEdit
            }
          }
          return item
        })
      }
      const changeTableByRow = (row, index) => {
        excelPageData.value = excelPageData.value.map((item, i) => {
          if (i === index) {
            return {
              ...row,
              isEdit: false
            }
          }
          return item
        })
        changeTableByEdit(row, index)
      }
      const changeTableByEdit = (row, index) => {
        const table = storage.session.get('sourceExcelData', [])
        const tableIndex = table.findIndex((item) => {
          const key = Object.keys(item)[0]
          return key === excelTabName.value
        })
        const sessionArr = storage.session.get('sourceExcelData', [])[tableIndex]
        const saveArr = sessionArr[excelTabName.value].map((item, i) => {
          if (i === index + (currentPage.value - 1) * pageSize.value) return row
          return item
        })
        const sourceTable = table.map((item, i) => {
          if (i === tableIndex) return { [excelTabName.value]: saveArr }
          return item
        })
        storage.session.set('sourceExcelData', sourceTable)
      }
      const inExcel = async (file) => {
        if (isUpdate.value) return
        isUpdate.value = true
        const isPass =
          file.raw.type === 'application/vnd.ms-excel' ||
          file.raw.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        if (!isPass) {
          ElMessage({
            message: '请上传excel文件',
            type: 'success'
          })
          return
        }
        fileName.value = file.name
        storage.session.set('fileName', file.name)
        storage.session.set('excelColumns', excelColumns.value)
        UseExcelTemp.getExcelData(file)
          .then((data) => {
            sourceExcelData.value = data || []
            storage.session.set('sourceExcelData', data || [])
            getTableData(data[0][excelTabName.value])
            isUpdate.value = false
          })
          .catch(() => {
            isUpdate.value = false
          })
      }
      const getTableData = (data) => {
        if (data.length === 0) {
          excelData.value = []
          excelPageData.value = []
          return
        }
        excelData.value = data.map((item) => {
          const res = {
            isEdit: false
          }
          Object.keys(item).forEach((rowItem) => {
            if (excelColumns.value.some((column) => rowItem === column)) {
              res[rowItem] = item[rowItem] || ''
            }
          })
          return res
        })
        excelPageData.value = excelData.value.slice(0, 10)
      }
      const getKeyColumn = (item) => {
        const key = Object.keys(item)[0]
        return {
          key,
          value: item[key]
        }
      }
      const search = (item, index) => {
        if (editColumn.value) return
        const key = getKeyColumn(item).key
        const pureTable = storage.session.get('sourceExcelData', [])[index][key] || []
        const sourceTable = pureTable.map((item) => {
          return {
            ...item,
            isEdit: false
          }
        })
        const value = excelVal.value.toString()
        if (!value) {
          excelData.value = sourceTable
          excelPageData.value = sourceTable.slice(0, 10)
          initPaging()
          return
        }
        const table = sourceTable.filter((item) => {
          const string = item['A'].toString()
          const isRepeat = value.split('').some((str) => string.includes(str))
          return isRepeat && string.length >= value.length
        })
        excelData.value = table
        excelPageData.value = table.slice(0, 10)
        initPaging()
      }
      const changeTable = (tab: TabsPaneContext) => {
        const key = tab.props.name as string
        const source = storage.session.get('sourceExcelData', [])
        const index = source.findIndex((item) => {
          const sourceKey = Object.keys(item)[0]
          return sourceKey === key
        })
        excelTabName.value = key
        getTableData(source[index][excelTabName.value])
      }
      const initPaging = () => {
        currentPage.value = 1
        pageSize.value = 10
      }
      const handleSizeChange = (size) => {
        excelPageData.value = excelData.value.slice(
          (currentPage.value - 1) * size,
          (currentPage.value - 1) * size + size
        )
        pageSize.value = size
      }
      const handleCurrentChange = (current) => {
        excelPageData.value = excelData.value.slice(
          (current - 1) * pageSize.value,
          (current - 1) * pageSize.value + pageSize.value
        )
        currentPage.value = current
      }
      const updateMore = (row, index) => {
        update.value.show(excelColumns.value, row, index)
      }
      const outExcel = () => {
        if (excelData.value.length === 0) {
          ElMessage({
            message: '当前excel表为空',
            type: 'error'
          })
          return
        }
        const data = [
          {
            [excelTabName.value]: excelData.value.map((item) => {
              const obj: Obj = { ...item }
              delete obj.isEdit
              return obj
            })
          }
        ]
        UseExcelTemp.dataToExcel(data, storage.session.get('excelColumns', []), fileName.value)
      }
      const selectExcel = (selection) => {
        select.value = selection
      }
      const outExcelByChoose = () => {
        if (select.value.length === 0) {
          ElMessage({
            message: '当前未选择excel表的数据',
            type: 'error'
          })
          return
        }
        const data = [
          {
            [excelTabName.value]: select.value.map((item) => {
              const obj: Obj = { ...item }
              delete obj.isEdit
              return obj
            })
          }
        ]
        UseExcelTemp.dataToExcel(data, storage.session.get('excelColumns', []), fileName.value)
      }
      return {
        fileName,
        excelData,
        update,
        tableRef,
        sourceExcelData,
        changeTableByRow,
        excelPageData,
        columns,
        number,
        isUpdate,
        excelTabName,
        excelVal,
        col,
        editColumn,
        tagColumn,
        excelColumns,
        inExcel,
        outExcel,
        outExcelByChoose,
        getKeyColumn,
        search,
        edit,
        changeTable,
        handleSizeChange,
        handleCurrentChange,
        getIsEdit,
        updateMore,
        currentPage,
        pageSize,
        selectExcel,
        select
      }
    }
  })
</script>

<style lang="scss" scoped>
  .margin {
    margin: 20px;
  }

  .pagination-box {
    display: flex;
    justify-content: center;
  }

  .flex-start {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 20px;
  }

  .mr {
    margin-right: 20px;
  }

  .input {
    width: 300px;
    height: 40px !important;
    line-height: 40px !important;
  }

  .edit {
    margin-left: 10px;
    font-size: 20px;
    cursor: pointer;
  }
</style>
