<template>
  <div class="p-4">
    <!-- 角色列表 -->
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
            <el-form-item label="角色名称">
              <el-input v-model="formData.roleName" placeholder="请输入角色名称" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :icon="Search" @click="onGetTableData">查询</el-button>
              <el-button :icon="Refresh" @click="onRestForm">重置</el-button>
              <el-button
                v-if="checkedKeys.length > 0"
                :icon="Delete"
                type="danger"
                @click="onDelRole"
                >批量删除</el-button
              >
            </el-form-item>
          </el-form>
        </div>
        <div class="flex mb-2">
          <el-button type="primary" icon="Plus" @click="addRole"> 新增角色</el-button>
        </div>
      </template>
      <template #action="{ row }">
        <el-button link type="primary" @click="findUser(row)">用户</el-button>
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
              <el-dropdown-item :command="{ index: 0, row: row }">授权</el-dropdown-item>
              <el-dropdown-item :command="{ index: 1, row: row }">编辑</el-dropdown-item>
              <el-dropdown-item :command="{ index: 2, row: row }">删除</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
      <!-- 分页 -->
      <template #footer-with-pagination>
        <div class="mt-4 flex justify-end">
          <el-pagination
            v-model:currentPage="formData.pageNo"
            v-model:page-size="formData.pageSize"
            background
            layout="prev, pager, next"
            :total="tableTotal"
            @current-change="handleCurrentChange"
          />
        </div>
      </template>
    </basic-table>

    <!-- 拥有权限 -->
    <has-role :show-drawer="showDrawer" :role-id="roleId" @close="showDrawer = false"></has-role>
    <!-- 添加编辑角色 -->
    <add-role
      :show-dialog="showDialog"
      :is-edit="isEdit"
      :role="editRoleInfo"
      @close="showDialog = false"
      @success="addOrUpdateRoleSuccess"
    ></add-role>
    <!-- 角色用户 -->
    <role-user :show="showRoleUser" :role-id="roleId" @close="showRoleUser = false"></role-user>
  </div>
</template>

<script lang="ts">
  import { HttpResponse } from '@/api/sys/model/http'
  import { ColumnOptions } from '@/components/Table/types'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { queryRoleList, deleteRole, deleteBatchRole } from '@/api/sys/role'
  import { RoleItem } from '@/api/sys/model/roleModel'
  import { defineComponent } from 'vue'
  import HasRole from './components/HasRole.vue'
  import AddRole from './components/AddRole.vue'
  import RoleUser from './components/RoleUser.vue'
  import { Search, Refresh, Delete } from '@element-plus/icons-vue'

  export default defineComponent({
    components: {
      HasRole,
      AddRole,
      RoleUser
    },
    setup() {
      const tableRef = ref()
      const tableTotal = ref(0)
      const tableData = ref<RoleItem[]>([])
      const roleId = ref<string>('')

      // table 数据正在加载
      const loading = ref(true)
      // 是否显示侧边授权列表
      const showDrawer = ref(false)
      // 是否显示新增角色弹窗
      const showDialog = ref(false)
      // 是否显示角色用户
      const showRoleUser = ref(false)
      // 是否编辑
      const isEdit = ref(false)
      // 编辑角色信息
      const editRoleInfo = ref<RoleItem>({ id: '' })

      const columns = [
        {
          type: 'selection',
          align: 'center'
        },
        {
          label: '角色编码',
          prop: 'roleCode',
          align: 'center'
        },
        {
          label: '角色名称',
          prop: 'roleName',
          align: 'center'
        },
        {
          label: '创建时间',
          prop: 'createTime',
          align: 'center',
          attrs: {
            sortable: true
          }
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
        roleName: '',
        column: 'createTime',
        order: 'desc'
      })
      //页数改变
      const handleCurrentChange = (page: number) => {
        formData.value.pageNo = page
        getTableList()
      }

      //条件查询用户
      const onGetTableData = () => {
        formData.value.pageNo = 1
        getTableList()
      }

      //重置
      const onRestForm = () => {
        formData.value.pageNo = 1
        formData.value.roleName = ''
      }

      // 查询角色列表
      const getTableList = () => {
        loading.value = true
        queryRoleList(formData.value).then((res: HttpResponse) => {
          loading.value = false
          if (res.code === 0) {
            tableData.value = res.data.records as RoleItem[]
            tableTotal.value = res.data.total
          } else {
            ElMessage.error(res.message)
          }
        })
      }
      getTableList()
      //新增角色
      const addRole = () => {
        editRoleInfo.value = { id: '' }
        isEdit.value = false
        showDialog.value = true
      }
      // 添加修改角色成功
      const addOrUpdateRoleSuccess = () => {
        getTableList()
      }
      //查询用户
      const findUser = (role) => {
        roleId.value = role.id
        showRoleUser.value = true
        console.log('findUser', role)
      }

      interface MenuCommand {
        index: number
        row: RoleItem
      }
      //更多操作
      const handleMoreCommand = (command: MenuCommand) => {
        switch (command.index) {
          case 0:
            //授权
            console.log('授权', command.row)
            showDrawer.value = true
            break
          case 1:
            //编辑
            editRoleInfo.value = command.row
            isEdit.value = true
            showDialog.value = true
            console.log('编辑', command.row)
            break
          case 2:
            //删除
            console.log('删除', command.row)
            ElMessageBox.confirm('确定删除吗？', '温馨提示')
              .then(() => {
                deleteRole({ id: command.row.id }).then((res: HttpResponse) => {
                  ElMessage({
                    message: `${res.message}`,
                    type: 'error'
                  })
                })
              })
              .catch(() => {
                // 取消
              })
            break
          default:
            break
        }
      }

      const onDelRole = () => {
        ElMessageBox.confirm('是否删除选中数据?', '确认删除', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let checkIds = checkedKeys.value.map((item) => item.id)
          const data = {
            roleIds: checkIds.join(',')
          }
          deleteBatchRole(data).then((res: HttpResponse) => {
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
        roleId,
        showDrawer,
        showRoleUser,
        showDialog,
        isEdit,
        editRoleInfo,
        handleCurrentChange,
        addRole,
        onDelRole,
        addOrUpdateRoleSuccess,
        getTableList,
        findUser,
        handleMoreCommand,
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
