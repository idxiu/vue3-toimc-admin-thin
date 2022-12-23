<template>
  <el-dialog
    :model-value="showDialog"
    :title="isEdit ? '编辑' : '新增'"
    center
    @close="close"
    @opened="opened"
  >
    <template v-if="isLoadedForm">
      <basic-form :schemas="formBasicSchema">
        <template #action="{ form, model }">
          <span class="dialog-footer flex justify-end">
            <el-button @click="close">取消</el-button>
            <el-button type="primary" :loading="loading" @click="submitForm(form, model)"
              >确认</el-button
            >
          </span>
        </template>
      </basic-form>
    </template>
  </el-dialog>
</template>
<script lang="ts">
  import { ref, reactive } from 'vue'
  import { FormSchema } from '@/components/Form/types/types'
  import type { FormInstance } from 'element-plus'
  import { saveOrUpdateRole } from '@/api/sys/role'
  import { ElMessage } from 'element-plus'
  import { HttpResponse } from '@/api/sys/model/http'
  export default defineComponent({
    props: {
      showDialog: {
        type: Boolean,
        default: false
      },
      //角色信息
      role: {
        type: Object,
        default: () => null
      },
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    emits: ['success', 'close'],
    setup(props, { emit }) {
      const loading = ref(false)
      const formData = reactive({
        id: '', //主键id
        roleCode: '', //角色编码
        roleName: '', //角色名称
        createTime: '', //创建时间
        description: '', //描述
        createBy: '', //创建人
        updateBy: '', //修改人
        updateTime: '' //修改时间
      })

      //FormSchema 是否加载完成
      const isLoadedForm = ref(false)
      let formBasicSchema = ref<FormSchema[]>([])
      // 重置初始化表单
      const resetFormSchema = () => {
        isLoadedForm.value = false
        let fromSchema: FormSchema[] = [
          {
            component: 'input',
            value: formData.roleCode,
            label: '角色编码',
            prop: 'roleCode',
            rules: [{ required: true, message: '请输入角色编码', trigger: 'blur' }],
            attrs: {
              placeholder: '请输入角色编码',
              disabled: props.isEdit ? true : false
            }
          },
          {
            component: 'input',
            value: formData.roleName,
            label: '角色名称',
            prop: 'roleName',
            rules: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
            attrs: {
              placeholder: '请输入角色名称'
            }
          },

          {
            component: 'input',
            label: '描述',
            prop: 'description',
            value: formData.description,
            attrs: {
              type: 'textarea',
              placeholder: '请输入角色描述'
            }
          }
        ]
        formBasicSchema.value = [...fromSchema] //更新表单
        setTimeout(() => {
          isLoadedForm.value = true
        }, 50)
      }
      //初始化表单
      resetFormSchema()

      const close = () => {
        emit('close')
      }

      const opened = () => {}

      // 提交表单
      const submitForm = (formEl: FormInstance, model: any) => {
        if (!formEl) return
        formEl.validate((valid) => {
          console.log('model', model)
          if (valid) {
            formData.roleName = model.roleName
            formData.description = model.description
            formData.roleCode = model.roleCode
            saveRoleInfo()
          } else {
            return false
          }
        })
      }

      // 列信息
      interface RoleColumn {
        [key: string]: any
      }

      //保存角色信息
      const saveRoleInfo = () => {
        loading.value = true
        const data: RoleColumn = {
          roleCode: formData.roleCode,
          roleName: formData.roleName,
          description: formData.description
        }
        if (props.isEdit) {
          data.id = formData.id || ''
          data.createTime = formData.createTime || ''
          data.createBy = formData.createBy || ''
          // data.updateBy = ''
          // data.updateTime = ''
        }

        saveOrUpdateRole(data, props.isEdit)
          .then((res: HttpResponse) => {
            loading.value = false
            if (res.code == 200) {
              ElMessage({
                message: `${res.message}`,
                type: 'success'
              })
              emit('success')
            } else {
              close()
              ElMessage({
                message: `${res.message}`,
                type: 'error'
              })
            }
          })
          .catch(() => {
            loading.value = false
            close()
            ElMessage({
              message: '操作失败',
              type: 'error'
            })
          })
      }
      // 监听参数变化
      watch(
        () => props.role,
        (val) => {
          if (props.showDialog) {
            formData.roleCode = val.roleCode || ''
            formData.roleName = val.roleName || ''
            formData.description = val.description || ''
            formData.id = val.id || ''
            formData.createTime = val.createTime || ''
            formData.createBy = val.createBy || ''
            formData.updateBy = val.updateBy || ''
            formData.updateTime = val.updateTime || ''
            resetFormSchema()
          }
        },
        {
          immediate: true
        }
      )
      return {
        formBasicSchema,
        loading,
        isLoadedForm,
        submitForm,

        opened,
        close
      }
    }
  })
</script>

<style></style>
