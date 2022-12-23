<template>
  <div style="position: relative">
    <el-table
      ref="tableRef"
      :data="cloneData"
      header-cell-class-name="header"
      fit
      :border="false"
      :row-class-name="rowCls"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
    >
      <template #empty>
        <el-empty description="暂无数据"></el-empty>
      </template>
      <el-table-column v-if="isIndex" type="index" width="50"></el-table-column>
      <el-table-column
        v-if="isChoose"
        :selectable="selectable"
        type="selection"
        width="55"
        align="center"
      ></el-table-column>
      <el-table-column
        v-for="column in columns"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
        :sortable="column.sort"
        :fixed="column.fixed"
        :min-width="column.width"
        :align="column.align || 'left'"
      >
        <template v-if="isHeader" #header="scope">
          <slot
            :name="`${column.prop}Header`"
            style="padding: 5px 0 4px 10px"
            :column="scope.column"
          >
            {{ column.label }}
          </slot>
        </template>
        <template #default="scope">
          <slot
            :name="column.prop"
            style="padding-left: 10px"
            :row="scope.row"
            :column="scope.column"
            :index="scope.$index"
          >
            {{
              scope.row[column.prop]
                ? scope.row[column.prop]
                : scope.row[column.prop] === 0
                ? 0
                : '-'
            }}
          </slot>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination" :class="{ margin: !isPage }" :style="{ width: offsetWidth + 'px' }">
      <el-pagination
        v-if="isPage"
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        :layout="pageLayout"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
    <div :class="footer">
      <el-checkbox
        v-if="isChoose"
        v-model="checked"
        style="margin: 0 10px 0 20px"
        @change="onChange"
      >
        全选本页
      </el-checkbox>
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script lang="ts">
  import { arrayTool } from 'mwutil'
  import { defineComponent, ref, PropType, computed, watch, onMounted } from 'vue'
  type selectableFunc = (row?: object, index?: number) => boolean
  type handleRowClickFunc = (row?: object, column?: object, event?: object) => void
  type tableColumns = {
    label: string
    prop: string
    minLength: number
    width?: number
    fixed?: string
    sort?: boolean
    align?: string
    [key: string]: any
  }
  interface propsData {
    tableData: object[]
    tableColumns: tableColumns[]
    pageSizes: number[]
    pageLayout: string
    selectable: selectableFunc
    handleRowClick: handleRowClickFunc
    isChoose: boolean
    isComputed: boolean
    isHeader: boolean
    isPage: boolean
    total: number
    minus: number
    isFixedWidth: boolean
    fixedWidth: number
    isIndex: boolean
  }
  export default defineComponent({
    name: 'TableComp',
    props: {
      tableData: {
        type: Array as PropType<object[]>,
        default() {
          return []
        }
      },
      tableColumns: {
        type: Array as PropType<tableColumns[]>,
        default() {
          return []
        }
      },
      pageSizes: {
        type: Array as unknown as PropType<number[]>,
        default() {
          return [10, 20, 50, 100]
        }
      },
      pageLayout: {
        type: String,
        default: 'total, sizes, prev, pager, next, jumper'
      },
      selectable: {
        type: Function as PropType<selectableFunc>,
        default: () => {
          return true
        }
      },
      handleRowClick: {
        type: Function as PropType<handleRowClickFunc>,
        default: () => {}
      },
      isChoose: {
        type: Boolean,
        default: false
      },
      isComputed: {
        type: Boolean,
        default: false
      },
      isHeader: {
        type: Boolean,
        default: false
      },
      isPage: {
        type: Boolean,
        default: true
      },
      total: {
        type: Number,
        default: 0
      },
      minus: {
        type: Number,
        default: 0
      },
      isFixedWidth: {
        type: Boolean,
        default: false
      },
      fixedWidth: {
        type: Number,
        default: 0
      },
      isIndex: {
        type: Boolean,
        default: false
      }
    },
    emits: ['select', 'size', 'current'],
    setup(props: propsData, ctx) {
      let offsetWidth = ref((document.getElementById('app') as HTMLDivElement).clientWidth)
      let checked = ref(false)
      let isInitPage = ref(false)
      interface OptionType {
        type: string
        value?: string
      }
      let optionType = reactive<OptionType>({
        type: 'init'
      })
      let currentPage = ref(1)
      let pageSize = ref(props.pageSizes[0])
      let columns = ref<tableColumns[]>([])
      let cloneData = ref([])
      let selection = ref([])
      const footer = computed(() => (props.isPage ? 'pos' : 'pos-r'))

      const tableRef = ref()

      watch(selection, (newSelection) => {
        ctx.emit('select', newSelection)
      })
      watch(
        () => props.tableData,
        (newData) => {
          cloneData.value = arrayTool.deepClone(newData)
          switch (optionType.type) {
            case 'init':
              currentPage.value = 1
              pageSize.value = 10
              break
            case 'changeSize':
              pageSize.value = optionType.value as unknown as number
              break
            case 'changeCurrent':
              currentPage.value = optionType.value as unknown as number
              break
            default:
              break
          }
          setTimeout(() => {
            optionType.type = 'init'
          }, 20)
          isInitPage.value = false
        },
        { immediate: true }
      )
      onMounted(() => {
        columns.value = arrayTool.deepClone(props.tableColumns)
        _computed()
        resolveColumn()
        window.onresize = () => {
          _computed()
          resolveColumn()
        }
      })
      const rowCls = ({ rowIndex }) => {
        if (rowIndex >= 0) {
          return 'table-cell'
        }
        return ''
      }
      const _computed = () => {
        if (props.isComputed) {
          offsetWidth.value =
            (document.getElementById('app') as HTMLDivElement).clientWidth - props.minus
          return
        }
        if (props.isFixedWidth) {
          offsetWidth.value = props.fixedWidth
        }
      }
      const resolveColumn = () => {
        let totalWidth = columns.value.reduce((total, column) => {
          return total + column.minLength
        }, 0)
        if (props.isChoose) {
          totalWidth = totalWidth + 55
        }
        if (props.isIndex) {
          totalWidth = totalWidth + 50
        }
        _computedWidth(offsetWidth.value, totalWidth)
      }
      const _computedWidth = (offsetWidth, totalWidth) => {
        if (totalWidth <= offsetWidth) {
          _middleWidth(totalWidth)
        } else {
          _minWidth()
        }
      }
      const _middleWidth = (totalWidth) => {
        const diff = offsetWidth.value - totalWidth
        const size = columns.value.length
        const finalSize = Math.floor(diff / size)
        columns.value = columns.value.map((item) => {
          return {
            ...item,
            width: item.minLength + finalSize
          }
        })
      }
      const _minWidth = () => {
        columns.value = columns.value.map((item) => {
          return {
            ...item,
            width: item.minLength
          }
        })
      }
      const handleSelectionChange = (select) => {
        if (!props.isChoose) return
        const data = cloneData.value.filter((item, index) => {
          return props.selectable(item, index)
        })
        checked.value = select.length === data.length
        selection.value = select
      }
      const chooseAll = () => {
        cloneData.value.forEach((item, index) => {
          if (props.selectable(item, index)) {
            tableRef.value.toggleRowSelection(item, true)
            return
          }
          tableRef.value.toggleRowSelection(item, false)
        })
        selection.value = cloneData.value.filter((item, index) => {
          return props.selectable(item, index)
        })
      }
      const clearAll = () => {
        tableRef.value.clearSelection()
        selection.value = []
      }
      const onChange = () => {
        checked.value ? chooseAll() : clearAll()
      }
      const handleSizeChange = (size) => {
        isInitPage.value = true
        pageSize.value = size
        optionType = Object.assign(
          {},
          {
            type: 'changeSize',
            value: size
          }
        )
        ctx.emit('size', size)
      }
      const handleCurrentChange = (current) => {
        isInitPage.value = true
        currentPage.value = current
        optionType = Object.assign(
          {},
          {
            type: 'changeCurrent',
            value: current
          }
        )
        ctx.emit('current', current)
      }
      const getTableData = () => {
        if (!isInitPage.value) {
          return {
            size: 10,
            current: 1,
            selection: selection.value
          }
        }
        return {
          size: pageSize.value,
          current: currentPage.value,
          selection: selection.value
        }
      }
      ctx.expose({
        getTableData
      })
      return {
        getTableData,
        checked,
        isInitPage,
        optionType,
        currentPage,
        pageSize,
        offsetWidth,
        columns,
        cloneData,
        selection,
        footer,
        tableRef,
        rowCls,
        handleSelectionChange,
        onChange,
        handleSizeChange,
        handleCurrentChange
      }
    }
  })
</script>

<style lang="scss" scoped>
  :deep(.el-table) {
    font-size: 14px;
    color: #000;

    tr {
      display: table-row;
    }

    .header {
      height: 34px;
      padding: 5px 0 !important;
      font-size: 14px;
      font-weight: normal;
      line-height: 34px;
      color: #707a8a;
      background-color: #f5f5f5 !important;
      border-bottom: none !important;

      .cell {
        height: 34px;
        line-height: 34px;
      }
    }

    .table-cell {
      height: 64px;
      line-height: 64px;
    }
  }

  :deep(.el-table--enable-row-hover) {
    .el-table__body tr:hover > td {
      background-color: #f5f5f5 !important;
    }
  }

  :deep(.el-pagination) {
    .el-select {
      .el-input.el-input--suffix {
        height: 32px;

        .el-input__inner {
          height: 32px;
          line-height: 32px;
        }
      }
    }
  }

  .pagination {
    display: flex;
    align-items: center;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .pos {
    position: absolute;
    bottom: 0;
    left: 0;
  }

  .pos-r {
    position: relative;
  }

  .margin {
    color: #b6bcc4;
    cursor: pointer;
  }
</style>
