<template>
  <el-dialog :model-value="show" title="修改密码" center width="400px" @close="onClose">
    <!--  :default-checked-keys="[]" -->
    <el-form
      ref="ruleFormRef"
      :model="formData"
      :rules="rules"
      label-width="90px"
      label-position="right"
    >
      <el-form-item label="用户账号" prop="username">
        <el-input v-model="formData.username" :disabled="true" placeholder="请输入用户账号" />
      </el-form-item>
      <el-form-item label="登录密码" prop="password">
        <el-input
          v-model="formData.password"
          type="password"
          show-password
          placeholder="请输入登录密码"
        />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input
          v-model="formData.confirmPassword"
          type="password"
          show-password
          placeholder="请输入确认密码"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer flex justify-end">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" :loading="isLoading" @click="submitForm(ruleFormRef)"
          >确认</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import type { FormRules, FormInstance } from 'element-plus'
  import { resetPassword } from '@/api/sys/user'
  import { HttpResponse } from '@/api/sys/model/http'
  import { ElMessage } from 'element-plus'
  export default defineComponent({
    props: {
      show: {
        type: Boolean,
        default: false
      },
      // 账号
      username: {
        type: String,
        default: ''
      }
    },
    emits: ['close', 'confirm', 'loadTreeData'],
    setup(props, { emit }) {
      const ruleFormRef = ref<FormInstance>()
      const isLoading = ref(false)
      interface UserInfo {
        username: string
        password?: string
        confirmPassword?: string
      }
      const formData = ref<UserInfo>({
        username: props.username,
        password: '',
        confirmPassword: ''
      })
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
        username: [{ required: true, message: '请输入用户账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入登录密码', trigger: 'blur' }],
        confirmPassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ]
      })
      //确认提交
      const submitForm = async (formEl: FormInstance | undefined) => {
        if (!formEl) return
        await formEl.validate((valid, fields) => {
          if (valid) {
            console.log('submit!')
            updatePwd()
          } else {
            console.log('error submit!', fields)
          }
        })
      }
      const updatePwd = () => {
        isLoading.value = true
        resetPassword(formData.value).then((res: HttpResponse) => {
          isLoading.value = false
          if (res.code == 0) {
            onClose()
            ElMessage({
              type: 'success',
              message: res.message
            })
          } else {
            ElMessage({
              type: 'error',
              message: res.message
            })
          }
        })
      }

      // 弹窗关闭
      const onClose = () => {
        emit('close')
      }
      watch(
        () => props.show,
        (val) => {
          if (val) {
            console.log(val)
            formData.value.username = props.username

            // let arr = props.checkedKeys.split(',')
            // if (arr.length > 0) {
            //   console.log('treeDepartRef', treeDepartRef)
            //   setTimeout(() => {
            //     console.log('treeDepartRef', treeDepartRef.value)
            //     treeDepartRef.value.setCheckedKeys(arr)
            //   }, 100)

            // treeDepartRef.value!.setCheckedKeys(arr)
            // treeDepartRef.value!.setCheckedKeys(arr, false)
          }
        },
        {
          immediate: true
        }
      )

      return { ruleFormRef, isLoading, formData, rules, onClose, submitForm }
    }
  })
</script>

<style></style>
