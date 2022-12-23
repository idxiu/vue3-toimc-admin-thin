<template>
  <el-dialog
    :model-value="show"
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
  import { saveOrUpdateDictItemConf } from '@/api/sys/dict'
  import { ElMessage } from 'element-plus'
  import { HttpResponse } from '@/api/sys/model/http'
  export default defineComponent({
    props: {
      show: {
        type: Boolean,
        default: false
      },
      //字典信息
      dict: {
        type: Object,
        default: () => null
      },
      dictId: {
        type: String,
        default: ''
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
        dictId: '', //字典id
        itemText: '', //字典名称
        itemValue: '', //字典数据值
        description: '', //描述
        sortOrder: '', //排序
        status: '' //状态 是否启用
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
            value: formData.itemText,
            label: '名称',
            prop: 'itemText',
            rules: [{ required: true, message: '请输入名称', trigger: 'blur' }],
            attrs: {
              placeholder: '请输入名称'
            }
          },
          {
            component: 'input',
            value: formData.itemValue,
            label: '数据值',
            prop: 'itemValue',
            rules: [{ required: true, message: '请输入数据值', trigger: 'blur' }],
            attrs: {
              placeholder: '请输入数据值'
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
          },
          {
            component: 'input-number',
            label: '排序',
            prop: 'sortOrder',
            value: formData.sortOrder,
            attrs: { min: 0, max: 999 }
          },
          {
            component: 'radio-group',
            value: formData.status,
            prop: 'status',
            label: '是否启用',
            children: [
              {
                component: 'radio-button',
                label: '启用',
                value: '1'
              },
              {
                component: 'radio-button',
                label: '不启用',
                value: '0'
              }
            ],
            span: 12
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
            saveDictInfo(model)
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
      const saveDictInfo = (model: any) => {
        loading.value = true
        const data: DataColumn = {
          dictId: formData.dictId,
          itemText: model.itemText,
          itemValue: model.itemValue,
          description: model.description,
          sortOrder: model.sortOrder,
          status: model.status
        }
        if (props.isEdit) {
          data.id = formData.id || ''
        }

        saveOrUpdateDictItemConf(data, props.isEdit)
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
          if (props.show) {
            formData.itemText = val.itemText || ''
            formData.itemValue = val.itemValue || ''
            formData.description = val.description || ''
            formData.sortOrder = val.sortOrder || ''
            formData.status = val.status || ''
            formData.id = val.id || ''
            formData.dictId = props.dictId || ''

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
