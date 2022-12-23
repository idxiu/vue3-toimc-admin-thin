<template>
  <el-drawer :model-value="show" direction="rtl" size="604px" @close="onClose">
    <template #header>
      <h4 class="divide-y divide-gray-500/50">
        <span>{{ user.id ? '编辑' : '新增' }}用户</span>
      </h4>
    </template>
    <template #default>
      <div class="p-4">
        <el-form
          ref="ruleFormRef"
          :model="formData"
          :rules="rules"
          label-width="90px"
          label-position="right"
        >
          <el-form-item label="用户账号" prop="username">
            <el-input
              v-model="formData.username"
              :disabled="user.id ? true : false"
              placeholder="请输入用户账号"
            />
          </el-form-item>
          <!-- 新增用户设置密码 -->
          <template v-if="!user.id">
            <el-form-item label="登录密码" prop="password">
              <el-input v-model="formData.password" type="password" placeholder="请输入登录密码" />
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input
                v-model="formData.confirmPassword"
                type="password"
                placeholder="请输入确认密码"
              />
            </el-form-item>
          </template>
          <el-form-item label="用户姓名" prop="realname">
            <el-input v-model="formData.realname" placeholder="请输入用户姓名" />
          </el-form-item>
          <el-form-item label="头像" prop="avatar">
            <el-upload
              class="avatar-uploader border border-gray-100"
              action="/api/sys/common/upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="formData.avatar" :src="formData.avatar" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon">
                <Plus />
              </el-icon>
            </el-upload>
          </el-form-item>

          <el-form-item label="手机号" prop="phone">
            <el-input v-model="formData.phone" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item label="工号" prop="workNo">
            <el-input v-model="formData.workNo" placeholder="请输入工号" />
          </el-form-item>
          <el-form-item label="角色">
            <el-select
              v-model="formData.roleIdsArr"
              multiple
              placeholder="请选择角色"
              style="width: 100%"
            >
              <el-option
                v-for="item in roleList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="所属部门">
            <el-select
              v-model="formData.departIdsArr"
              style="width: 340px; margin-right: 4px"
              disabled
              multiple
              placeholder="请选择部门"
            >
              <el-option
                v-for="item in departList"
                :key="item.id"
                :label="item.departName"
                :value="item.id"
              />
            </el-select>
            <el-button type="primary" @click="showPickDepart = true"> 选择部门 </el-button>
          </el-form-item>

          <el-form-item label="性别">
            <el-radio-group v-model="formData.sex">
              <el-radio label="1"> 男 </el-radio>
              <el-radio label="2"> 女 </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="状态">
            <el-radio-group v-model="formData.status">
              <el-radio label="1"> 正常 </el-radio>
              <el-radio label="0"> 冻结 </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div class="flex justify-end">
          <el-button @click="onClose"> 取消 </el-button>
          <el-button type="primary" :loading="isEditLoading" @click="submitForm(ruleFormRef)">
            确认
          </el-button>
        </div>
      </div>
      <!-- 选择部门 -->
      <pick-depart
        :show="showPickDepart"
        :checked-keys="formData.departIds"
        @close="showPickDepart = false"
        @confirm="onConfirmDepart"
        @load-tree-data="onLoadTreeData"
      />
    </template>
  </el-drawer>
</template>

<script lang="ts">
  import { ref, defineComponent } from 'vue'
  import { RoleItem } from '@/api/sys/model/roleModel'
  import { DepartItem } from '@/api/sys/model/departModel'
  import { queryAllRoleList } from '@/api/sys/role'
  import { queryUserRole, editUser, addUser } from '@/api/sys/user'
  import { HttpResponse } from '@/api/sys/model/http'
  import { UserItem } from '@/api/sys/model/userModel'
  import type { FormRules, FormInstance, UploadProps } from 'element-plus'
  import { ElMessage } from 'element-plus'
  import { Search, Refresh } from '@element-plus/icons-vue'
  import PickDepart from './PickDepart.vue'
  export default defineComponent({
    components: {
      PickDepart
    },
    props: {
      show: {
        type: Boolean,
        default: false
      },
      //标识是否是角色管理中编辑的用户
      roleId: {
        type: String,
        default: null
      },
      //用户信息
      user: {
        type: Object,
        default: () => ({})
      }
    },
    emits: ['close'],
    setup(props, ctx) {
      const ruleFormRef = ref<FormInstance>()
      const showPickDepart = ref(false)
      interface UserInfo extends UserItem {
        password?: string
        confirmPassword?: string
        roleIdsArr: string[]
        departIdsArr: string[]
      }
      const formData = ref<UserInfo>({
        username: '',
        password: '',
        confirmPassword: '',
        realname: '',
        avatar: '',
        phone: '',
        workNo: '',
        roleIds: '',
        departIds: '',
        roleIdsArr: [],
        departIdsArr: [],
        sex: '',
        status: ''
      })
      //拥有的角色
      const roleList = ref<RoleItem[]>([])
      //拥有的部门
      const departList = ref<DepartItem[]>([])
      //查询所有的角色列表
      const getRoleList = () => {
        queryAllRoleList().then((res: HttpResponse) => {
          if (res.code === 0) {
            roleList.value = res.data.records || []
          }
        })
      }
      getRoleList()
      const validatePass = (_rule: any, value: any, callback: any) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== formData.value.password) {
          callback(new Error('两次输入的密码不匹配!'))
        } else {
          callback()
        }
      }
      const rules = reactive<FormRules>({
        username: [
          { required: true, message: '请输入用户账号', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3-10之间', trigger: 'blur' }
        ],

        password: [{ required: true, message: '请输入登录密码', trigger: 'blur' }],
        confirmPassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        realname: [{ required: true, message: '请输入用户姓名', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        workNo: [{ required: true, message: '请输入工号', trigger: 'blur' }]
      })
      // 文件上传成功
      const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
        if (response.code === 0) {
          formData.value.avatar = response.data
        } else {
          ElMessage.error(response.message)
        }
      }
      // 上传文件之前
      const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
        const isPic = rawFile.type === 'image/jpeg' || rawFile.type === 'image/png'
        if (!isPic) {
          ElMessage.error('上次头像类型为png或者jpg格式文件')
          return false
        } else if (rawFile.size / 1024 / 1024 > 2) {
          ElMessage.error('文件不能超过 2MB!')
          return false
        }
        return true
      }

      // 部门列表加载完成
      const onLoadTreeData = (data: any) => {
        let treeDepart = data || []
        //树形数据数组转数组
        let departListArr: DepartItem[] = []
        treeDepart.forEach((item) => {
          departListArr.push(item)
          if (item.children) {
            item.children.forEach((item) => {
              departListArr.push(item)
            })
          }
        })
        departList.value = departListArr
      }

      //查询用户的角色
      const getUserRole = () => {
        if (!props.user.id) {
          //新增用户
          if (props.roleId) {
            //角色管理中新增用户
            formData.value.roleIds = props.roleId
            formData.value.roleIdsArr = [props.roleId]
          }
          return
        }
        let params = {
          userId: props.user.id
        }
        queryUserRole(params).then((res: HttpResponse) => {
          if (res.code === 0) {
            formData.value.roleIdsArr = res.data
            formData.value.roleIds = res.data.join(',') || ''
          }
        })
      }
      // 选择部门后回显
      const onConfirmDepart = (nodes) => {
        departList.value = nodes
        formData.value.departIds = nodes.map((item) => item.id).join(',')
        formData.value.departIdsArr = nodes.map((item) => item.id)
      }

      //重置表单
      const resetForm = () => {
        formData.value = {
          id: props.user.id,
          username: props.user.username,
          realname: props.user.realname,
          avatar: props.user.avatar || '',
          phone: props.user.phone,
          workNo: props.user.workNo,
          roleIds: '',
          roleIdsArr: [],
          departIds: props.user.departIds || '',
          departIdsArr: props.user.departIds ? props.user.departIds.split(',') : [],
          sex: props.user.sex ? props.user.sex : 0,
          status: props.user.status
        }
        getUserRole()
      }

      //提交
      const submitForm = async (formEl: FormInstance | undefined) => {
        if (!formEl) return
        await formEl.validate((valid, fields) => {
          if (valid) {
            console.log('submit!')
            if (props.user.id) {
              updateUserInfo()
            } else {
              addUserInfo()
            }
          } else {
            console.log('error submit!', fields)
          }
        })
      }

      const isEditLoading = ref(false)
      //新增用户
      const addUserInfo = () => {
        if (isEditLoading.value) return
        const data = { ...formData.value }
        isEditLoading.value = true
        addUser(data).then((res: HttpResponse) => {
          isEditLoading.value = false
          if (res.code === 0) {
            ElMessage.success('添加成功')
          } else {
            ElMessage.error(res.message)
          }
        })
      }
      // 更新用户信息
      const updateUserInfo = () => {
        if (isEditLoading.value) return
        const data = { ...formData.value }
        isEditLoading.value = true
        editUser(data).then((res: HttpResponse) => {
          isEditLoading.value = false
          if (res.code === 0) {
            ElMessage.success('修改成功')
          } else {
            ElMessage.error(res.message)
          }
        })
      }

      // 弹窗关闭
      const onClose = () => {
        ctx.emit('close')
      }

      watch(
        () => props.show,
        (val) => {
          if (val) {
            resetForm()
          }
        },
        {
          immediate: true
        }
      )
      return {
        Search,
        Refresh,
        ruleFormRef,
        rules,
        formData,
        roleList,
        departList,
        showPickDepart,
        isEditLoading,
        onClose,
        submitForm,
        handleAvatarSuccess,
        beforeAvatarUpload,
        onConfirmDepart,
        onLoadTreeData
      }
    }
  })
</script>
<style scoped lang="scss">
  :deep(.el-drawer__header) {
    margin-bottom: 0;
  }

  .avatar-uploader {
    .avatar {
      display: block;
      width: 110px;
      height: 110px;
    }

    .el-upload {
      position: relative;
      overflow: hidden;
      cursor: pointer;
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      transition: var(--el-transition-duration-fast);
    }

    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
  }

  .el-icon.avatar-uploader-icon {
    width: 110px;
    height: 110px;
    font-size: 28px;
    color: #8c939d;
    text-align: center;
  }
</style>
