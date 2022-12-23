<template>
  <div class="w-full p-4 custom-login">
    <!-- 右上角扫码登陆部分，若不需要，可直接注销 -->
    <div class="flex items-center justify-end">
      <div class="px-3 py-2 rounded-md mr-2 flex items-center bg-[#ECFAF3]">
        <span class="we inline-block pr-2 bg-contain"></span>
        <span class="text-sm text-[#07C160]">微信扫码登录</span>
      </div>
      <router-link to="/login/scan">
        <img class="relative cursor-pointer" src="@/assets/images/qr.png" />
      </router-link>
    </div>
    <!-- 注册账号主体部分 -->
    <div class="my-10 mx-auto max-w-96">
      <div class="text-3xl pb-6">注册账号</div>
      <basic-form ref="form" :schemas="regForm" label-width="0" class="pt-4" @change="handleChange">
        <template #action="{ validate, model }">
          <el-button
            type="primary"
            size="large"
            class="w-full mb-2"
            @click="handleSubmit(validate, model)"
            >注册</el-button
          >
        </template>
        <template #suffix>
          <el-link
            v-if="!state.sending"
            type="primary"
            :underline="false"
            class="mr-2"
            href="javascript:;"
            @click="onSendCode"
            >获取验证码</el-link
          >
          <span
            v-else
            class="text-sm text-gray-400 w-[70px] text-center inline-block flex items-center"
            >重发{{ leftCount }}秒</span
          >
        </template>
      </basic-form>
      <div class="flex justify-between text-sm text-gray-400">
        <router-link class="text-blue-400" to="/login/forget">忘记密码？</router-link>
        <div>
          已有账号？
          <router-link class="text-blue-400" to="/login/pwd">立即登录></router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { FormSchema } from '@/components/Form/types/types'
  import sendUtils from '@/utils/sendCode'
  import { register } from '../../../api/page/login'
  import { HttpResponse } from '@/api/sys/model/http'
  import { phoneReg } from '@/utils/domUtils'
  import _ from 'lodash-es'
  import { ElMessage } from 'element-plus'

  export default defineComponent({
    setup() {
      const router = useRouter()
      const form = ref()
      const mobilePhone = ref()
      // 注册表单配置，作为配置参数传递给basic-form组件
      const regForm = [
        {
          component: 'input',
          class: 'py-1',
          prop: 'phone',
          attrs: {
            placeholder: '请输入手机号',
            size: 'large',
            prefixIcon: 'Avatar'
          },
          rules: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { pattern: phoneReg, message: '请输入正确的手机号', trigger: 'blur' }
          ]
        },
        {
          component: 'input',
          class: 'py-1',
          prop: 'code',
          attrs: {
            placeholder: '请输入验证码',
            size: 'large',
            prefixIcon: 'ChatRound'
          },
          itemSlot: { suffix: 'suffix' },
          rules: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
        },
        {
          component: 'input',
          class: 'py-1',
          prop: 'password',
          attrs: {
            placeholder: '请输入密码',
            type: 'password',
            size: 'large',
            prefixIcon: 'Lock'
          },
          rules: [
            { required: true, message: '密码不能为空', trigger: 'blur' },
            { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
          ]
        }
      ] as FormSchema[]

      // 验证码处理，state 为状态，sendCode为处理发送的函数，leftCount为重发时间
      const { state, handleSendCode, leftCount } = sendUtils()

      const handleChange = (event) => {
        mobilePhone.value = event.phone
      }
      const handleSubmit = async (validate, model) => {
        if (!validate) return
        const res = (await register(model)) as HttpResponse
        if (res.code !== 0) {
          ElMessage.error(res.message)
          return
        }
        ElMessage.success('注册成功')
        _.delay(() => router.push({ path: '/login/pwd' }), 3000)
      }

      const onSendCode = () => {
        form.value.validateField('phone').then(() => {
          handleSendCode(mobilePhone.value)
        })
      }

      return {
        form,
        regForm,
        state,
        onSendCode,
        leftCount,
        handleChange,
        handleSubmit
      }
    }
  })
</script>

<style scoped></style>
