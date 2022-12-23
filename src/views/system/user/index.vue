<template>
  <div class="p-4">
    <el-card>
      <!-- 条件查询 -->
      <div class="mb-2">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="用户账号">
            <el-input v-model="formInline.username" placeholder="请输入用户账号" />
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="formInline.sex" placeholder="请选择性别">
              <el-option label="请选择" value="0" />
              <el-option label="男" value="1" />
              <el-option label="女" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="真实姓名">
            <el-input v-model="formInline.realname" placeholder="请输入真实姓名" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="onSubmit">查询</el-button>
            <el-button :icon="Refresh" @click="onRestForm">重置</el-button>
            <el-button
              v-if="multipleSelection.length > 0"
              :icon="Delete"
              type="danger"
              @click="onDelUser"
              >批量删除</el-button
            >
          </el-form-item>
        </el-form>
      </div>

      <div class="flex mb-2">
        <el-button type="primary" icon="Plus" @click="addUser"> 新增用户</el-button>
      </div>
      <!-- 用户列表表格数据 -->
      <el-table
        ref="multipleTableRef"
        v-loading="loading"
        :data="tableData"
        border
        align="center"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column property="username" label="用户账号" align="center" width="120" />
        <el-table-column property="realname" label="用户姓名" align="center" width="120" />
        <el-table-column property="avatar" label="头像" align="center" width="80">
          <template #default="scope">
            <el-avatar shape="square" :size="42" :src="scope.row.avatar" />
          </template>
        </el-table-column>
        <el-table-column property="sex_dictText" label="性别" align="center" width="60" />
        <el-table-column property="birthday" label="生日" align="center" width="180" />
        <el-table-column property="phone" label="手机号" align="center" width="120" />
        <el-table-column property="departIds_dictText" label="部门" align="center" />
        <el-table-column property="status_dictText" label="状态" width="80" align="center" />
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="editUserInfo(scope.row)"
              >编辑</el-button
            >
            <el-button link type="primary" size="small" @click="resetPwd(scope.row)"
              >密码</el-button
            >

            <!-- sys/user/frozenBatch -->

            <el-popconfirm
              title="是否确认冻结?"
              confirm-button-text="确认"
              cancel-button-text="取消"
              @confirm="confirmFrozenEvent(scope.row)"
            >
              <template #reference>
                <el-button link type="primary" size="small">冻结</el-button>
              </template>
            </el-popconfirm>

            <el-popconfirm
              title="是否确认删除?"
              confirm-button-text="确认"
              cancel-button-text="取消"
              @confirm="confirmDelEvent(scope.row)"
            >
              <template #reference>
                <el-button link type="primary" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
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
    </el-card>

    <!-- 编辑 新增用户 -->
    <add-or-edit-user
      ref="addOrEditUserRef"
      :show="isShowEditDrawer"
      :user="userInfo"
      @close="isShowEditDrawer = false"
    >
    </add-or-edit-user>
    <!-- 重置密码 -->
    <reset-pwd
      ref="resetPwdRef"
      :show="isShowResetPwdDrawer"
      :username="username"
      @close="isShowResetPwdDrawer = false"
    >
    </reset-pwd>
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive, ref } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { UserItem } from '@/api/sys/model/userModel'
  import { HttpResponse } from '@/api/sys/model/http'
  import { queryUserList, deleteBatch, frozenBatch } from '@/api/sys/user'
  import { Search, Refresh, Delete } from '@element-plus/icons-vue'
  import AddOrEditUser from './components/AddOrEditUser.vue'
  import ResetPwd from './components/ResetPwd.vue'

  export default defineComponent({
    components: {
      AddOrEditUser,
      ResetPwd
    },
    setup() {
      const loading = ref(false)
      const tableTotal = ref(0)
      const tableData = ref<UserItem[]>([])
      const multipleSelection = ref<UserItem[]>([])
      const userInfo = ref<UserItem>({})
      const isShowEditDrawer = ref(false)
      const isShowResetPwdDrawer = ref(false)
      const username = ref('')
      const formInline = reactive({
        username: '',
        realname: '',
        sex: ''
      })
      // 查询接口字段
      const formData = reactive({
        pageNo: 1,
        pageSize: 10,
        column: 'createTime',
        order: 'desc',
        username: formInline.username,
        realname: formInline.realname,
        sex: formInline.sex
      })

      //页数改变
      const handleCurrentChange = (page: number) => {
        formData.pageNo = page
        getTableList()
      }
      //条件查询用户
      const onSubmit = () => {
        formData.pageNo = 1
        formData.pageSize = 10
        formData.username = '*' + formInline.username + '*'
        formData.realname = '*' + formInline.realname + '*'
        formData.sex = formInline.sex
        getTableList()
      }

      //重置
      const onRestForm = () => {
        formInline.username = ''
        formInline.realname = ''
        formInline.sex = '0'
      }

      //查询用户列表
      const getTableList = () => {
        loading.value = true
        queryUserList(formData).then((res: HttpResponse) => {
          console.log('res', res)
          tableData.value = res.data.records as UserItem[]
          loading.value = false
          tableTotal.value = res.data.total
        })
      }
      // 默认请求一次
      onSubmit()
      const handleSelectionChange = (val: UserItem[]) => {
        multipleSelection.value = val
      }
      //冻结用户
      const confirmFrozenEvent = (row: UserItem) => {
        let data = {
          ids: row.id,
          status: 2
        }
        frozenBatch(data).then((res: HttpResponse) => {
          console.log('res', res)
          if (res.code === 0) {
            ElMessage.success(res.message)
            //重新查询用户列表
            onSubmit()
          } else {
            ElMessage.error(res.message)
          }
        })
      }
      // 表格操作区删除用户
      const confirmDelEvent = (row) => {
        console.log('scope', row)
        console.log('confirm!')
        const data = {
          userIds: row.id
        }
        deleteUser(data)
      }

      // 批量删除用户
      const onDelUser = () => {
        ElMessageBox.confirm('是否删除选中数据?', '确认删除', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let userCheckIds = multipleSelection.value.map((item) => item.id)
          const data = {
            userIds: userCheckIds.join(',')
          }
          deleteUser(data)
        })
      }
      //请求删除用户
      const deleteUser = (data) => {
        deleteBatch(data).then((res: HttpResponse) => {
          if (res.code === 0) {
            ElMessage({
              type: 'success',
              message: '删除成功'
            })
            //重新查询用户列表
            onSubmit()
          } else {
            ElMessage({
              type: 'error',
              message: res.message
            })
          }
        })
      }
      // 编辑用户密码
      const resetPwd = (row) => {
        console.log('row', row)
        username.value = row.username
        isShowResetPwdDrawer.value = true
      }
      // 编辑用户
      const editUserInfo = (row) => {
        console.log('row', row)
        userInfo.value = row
        isShowEditDrawer.value = true
      }
      const addUser = () => {
        userInfo.value = {}
        isShowEditDrawer.value = true
      }
      return {
        Search,
        Refresh,
        Delete,
        isShowEditDrawer,
        isShowResetPwdDrawer,
        multipleSelection,
        username,
        formData,
        formInline,
        tableTotal,
        loading,
        tableData,
        userInfo,
        onSubmit,
        onRestForm,
        onDelUser,
        handleCurrentChange,
        handleSelectionChange,
        confirmDelEvent,
        confirmFrozenEvent,
        editUserInfo,
        addUser,
        resetPwd
      }
    }
  })
</script>

<style scoped>
  .el-form-item {
    margin-bottom: 0;
  }
</style>
