<template>
  <div class="p-4 menuBox">
    <el-card>
      <div class="flex">
        <el-button type="primary" icon="Plus" @click="addMenu"> 新增菜单</el-button>
        <el-dropdown
          v-if="multipleSelection.length > 0"
          style="margin-left: 5px"
          trigger="click"
          @command="handleCommand"
        >
          <span class="el-dropdown-link">
            <el-button plain icon=""
              >批量操作
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </el-button>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="del">删除</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="info flex items-center content-center">
        <el-icon class="mr-1 block" color="#409EFF">
          <info-filled />
        </el-icon>
        <p class="border-gray-500">
          <span v-if="multipleSelection.length > 0"
            >已选中 {{ multipleSelection.length }} 条记录 |
            <span class="cursor-pointer" @click="cleanSelection()">清空</span></span
          >
          <span v-else>未选中任何数据</span>
        </p>
      </div>
      <vxe-table
        ref="xTableRef"
        round
        border
        :loading="loading"
        :column-config="{ resizable: true }"
        :tree-config="{ transform: false, rowField: 'id', parentField: 'parentId' }"
        :data="tableData"
        :checkbox-config="{ labelField: 'name' }"
        @checkbox-all="selectAllChangeEvent"
        @checkbox-change="selectChangeEvent"
      >
        <vxe-column type="checkbox" title="菜单名称" min-width="200" tree-node></vxe-column>
        <vxe-column field="menuType" title="菜单类型" align="center">
          <template #default="scope">
            <span v-if="scope.row.menuType == 0">一级菜单</span>
            <span v-else-if="scope.row.menuType == 1">子菜单</span>
            <span v-else-if="scope.row.menuType == 2">按钮/权限</span>
          </template>
        </vxe-column>
        <vxe-column field="icon" title="图标" width="50" align="center">
          <template #default="scope">
            <el-icon v-if="scope.row.icon" :name="scope.row.icon">
              <box />
            </el-icon>
            <span v-else class="icon-ify m-auto" data-icon="null"></span>
          </template>
        </vxe-column>
        <vxe-column field="component" title="组件" min-width="150"></vxe-column>
        <vxe-column field="url" title="路径" min-width="150"></vxe-column>
        <vxe-column field="sortNo" title="排序" min-width="50" align="center"></vxe-column>
        <vxe-column title="操作" min-width="150" align="center">
          <template #default="scope">
            <el-button link type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-dropdown @command="handleMoreCommand">
              <span class="el-dropdown-link ml-2">
                <el-button link type="primary"
                  >更多<el-icon class="el-icon--right">
                    <arrow-down />
                  </el-icon>
                </el-button>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item :command="{ index: 0, row: scope.row }"
                    >添加下级</el-dropdown-item
                  >
                  <el-dropdown-item :command="{ index: 1, row: scope.row }">删除</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </vxe-column>
      </vxe-table>

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
    </el-card>
    <menu-drawer
      :show-drawer="data.showDrawer"
      :obj="data.obj"
      :menus="data.menuALL"
      :is-update="data.isUpdate"
      @on-confirm="onConfirm"
      @close="data.showDrawer = false"
    ></menu-drawer>
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref, onUnmounted } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { VxeTableEvents, VxeTableInstance } from 'vxe-table'
  import MenuDrawer from './MenuDrawer.vue'
  import { getMenuList, saveOrUpdateMenu, deleteMenu, deleteMenus } from '@/api/sys/menu'
  import { MenuItem } from '@/api/sys/model/menuModel'
  import { HttpResponse } from '@/api/sys/model/http'
  export default defineComponent({
    name: 'MenusPage',
    components: {
      MenuDrawer
    },
    setup() {
      const tableTotal = ref(0)
      const loading = ref(false)
      let data = reactive({
        isUpdate: false,
        showDrawer: false,
        obj: {},
        menuALL: [] as MenuItem[]
      })
      const xTableRef = ref({} as VxeTableInstance)
      const multipleSelection = ref<Array<MenuItem>>([])
      const tableData = ref<Array<MenuItem>>([])

      const handleCommand = (command: string | number | object) => {
        // ElMessage(`click on item ${command}`)

        if (typeof command === 'string') {
          if (command === 'del') {
            // 删除
            ElMessageBox.confirm('确定删除吗？', '温馨提示')
              .then(() => {
                let ids = multipleSelection.value.map((item) => item.id)
                console.log('ids', ids)
                deleteMenus({ ids: ids }).then((res: HttpResponse) => {
                  ElMessage({
                    message: `${res.message}`,
                    type: 'error'
                  })
                })
              })
              .catch(() => {
                // 取消
              })
          }
        }
      }
      interface MenuCommand {
        index: 0
        row: MenuItem
      }
      const handleMoreCommand = (command: MenuCommand) => {
        if (command.index == 0) {
          console.log('click add item ', command)
          data.isUpdate = false
          data.showDrawer = true // 显示抽屉
          data.obj = {
            parentId: command.row.id,
            parentName: command.row.name,
            menuType: 1,
            route: true,
            permsType: '1',
            status: '1'
          }
        } else {
          //删除
          console.log('click on del item ', command)
          ElMessageBox.confirm('确定删除吗？', '温馨提示')
            .then(() => {
              deleteMenu({ id: command.row.id }).then((res: HttpResponse) => {
                ElMessage({
                  message: `${res.message}`,
                  type: 'error'
                })
              })
            })
            .catch(() => {
              // 取消
            })
        }
      }

      //选中监听
      const selectChangeEvent: VxeTableEvents.CheckboxChange = ({ $table }) => {
        const records = $table.getCheckboxRecords()
        multipleSelection.value = records
        console.info(`勾选${records.length}个树形节点`, records)
      }

      const selectAllChangeEvent: VxeTableEvents.CheckboxAll = ({ checked }) => {
        const $table = xTableRef.value
        const records = $table.getCheckboxRecords()
        multipleSelection.value = records
        console.log(checked ? '所有勾选事件' : '所有取消事件', records)
      }

      //添加菜单
      const addMenu = () => {
        data.isUpdate = false
        data.showDrawer = true // 显示抽屉
        data.obj = { menuType: 0, route: true, permsType: '1', status: '1' }
      }
      //菜单保存添加确认事件
      const onConfirm = (obj: any) => {
        console.log('onConfirm obj is:', obj)
        data.showDrawer = false
        saveOrUpdateMenu(obj, data.isUpdate).then((res: HttpResponse) => {
          ElMessage({
            message: `${res.message}`,
            type: 'error'
          })
        })
      }
      const handleEdit = (row: MenuItem) => {
        // ElMessage(`编辑 ${row.name}`)
        data.isUpdate = true
        data.showDrawer = true
        data.obj = row
      }
      //清除选中的数据
      const cleanSelection = () => {
        xTableRef.value.clearCheckboxRow()
        multipleSelection.value = []
      }

      // 查询接口字段
      const formData = reactive({
        pageNo: 1,
        pageSize: 10,
        column: 'createTime',
        order: 'desc'
      })

      //页数改变
      const handleCurrentChange = (page: number) => {
        formData.pageNo = page
        getTableList()
      }

      //查询表格列表
      const getTableList = () => {
        loading.value = true
        getMenuList(formData).then((res: HttpResponse) => {
          console.log('res', res)
          loading.value = false
          tableData.value = res.data.records
          data.menuALL = tableData.value || []
          tableTotal.value = res.data.total
        })
      }

      onMounted(() => {
        console.log('onMounted')
        getTableList()
      })
      onUnmounted(() => {
        console.log('unmount')
      })
      return {
        formData,
        tableTotal,
        loading,
        multipleSelection,
        tableData,
        data,
        xTableRef,
        addMenu,
        onConfirm,
        selectChangeEvent,
        selectAllChangeEvent,
        handleCurrentChange,
        handleCommand,
        handleMoreCommand,
        handleEdit,
        cleanSelection
      }
    }
  })
</script>
<style lang="scss" scoped>
  $color-primary: #409eff;

  .menuBox {
    .info {
      padding: 5px;
      margin: 10px auto;
      color: #333;
      background: #f1f1f1;
    }

    span.icon-ify {
      display: block;
      width: 1em;
      height: 1em;
      background-color: #5551;
      border-radius: 100%;
    }

    :deep(.vxe-checkbox--icon::before) {
      border-width: 1px !important;
    }
  }
</style>
