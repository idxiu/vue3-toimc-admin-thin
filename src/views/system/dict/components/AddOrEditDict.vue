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
  import { saveOrUpdateDict } from '@/api/sys/dict'
  import { ElMessage } from 'element-plus'
  import { HttpResponse } from '@/api/sys/model/http'
  export default defineComponent({
    props: {
      showDialog: {
        type: Boolean,
        default: false
      },
      //字典信息
      dict: {
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
        dictCode: '', //字典编码
        dictName: '', //字典名称
        description: '' //描述
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
            value: formData.dictCode,
            label: '字典编码',
            prop: 'dictCode',
            rules: [{ required: true, message: '请输入字典编码', trigger: 'blur' }],
            attrs: {
              placeholder: '请输入字典编码',
              disabled: props.isEdit ? true : false
            }
          },
          {
            component: 'input',
            value: formData.dictName,
            label: '字典名称',
            prop: 'dictName',
            rules: [{ required: true, message: '请输入字典名称', trigger: 'blur' }],
            attrs: {
              placeholder: '请输入字典名称'
            }
          },

          {
            component: 'input',
            label: '描述',
            prop: 'description',
            value: formData.description,
            attrs: {
              type: 'textarea',
              placeholder: '请输入描述'
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
            formData.dictName = model.dictName
            formData.dictCode = model.dictCode
            formData.description = model.description
            saveDictInfo()
          } else {
            return false
          }
        })
      }

      // 列信息
      interface DataColumn {
        [key: string]: any
      }

      //保存字典信息
      const saveDictInfo = () => {
        loading.value = true
        const data: DataColumn = {
          dictCode: formData.dictCode,
          dictName: formData.dictName,
          description: formData.description
        }
        if (props.isEdit) {
          data.id = formData.id || ''
        }

        saveOrUpdateDict(data, props.isEdit)
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
        () => props.dict,
        (val) => {
          if (props.showDialog) {
            formData.dictCode = val.dictCode || ''
            formData.dictName = val.dictName || ''
            formData.description = val.description || ''
            formData.id = val.id || ''
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
