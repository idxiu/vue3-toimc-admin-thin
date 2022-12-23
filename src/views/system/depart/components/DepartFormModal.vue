<template>
  <el-dialog
    :model-value="dialogFormVisible"
    title="新增"
    width="520px"
    center
    @close="close"
    @opened="opened"
  >
    <el-form ref="ruleFormRef" :model="formData" :rules="rules">
      <el-form-item label="机构名称" :label-width="formLabelWidth" prop="departName">
        <el-input v-model="formData.departName" autocomplete="off" />
      </el-form-item>
      <el-form-item v-if="parentId != ''" label="上级部门" :label-width="formLabelWidth">
        <el-tree-select
          v-model="formData.parentId"
          clearable
          node-key="id"
          :data="treeData"
          default-expand-all
          :props="defaultProps"
          placeholder=" "
        />
      </el-form-item>
      <el-form-item label="机构类型" :label-width="formLabelWidth">
        <el-radio-group v-model="formData.orgCategory">
          <el-radio-button v-if="formData.orgCategory == 1" label="1">公司</el-radio-button>
          <template v-else>
            <el-radio-button label="2">部门</el-radio-button>
            <el-radio-button label="3">岗位</el-radio-button>
          </template>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="排序" :label-width="formLabelWidth">
        <el-input-number
          v-model="formData.departOrder"
          :min="0"
          :max="9999999999"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item label="电话" :label-width="formLabelWidth">
        <el-input v-model="formData.mobile" autocomplete="off" />
      </el-form-item>
      <el-form-item label="地址" :label-width="formLabelWidth">
        <el-input v-model="formData.address" autocomplete="off" />
      </el-form-item>
      <el-form-item label="备注" :label-width="formLabelWidth">
        <el-input v-model="formData.memo" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer flex justify-end">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" :loading="loading" @click="submitForm(ruleFormRef)"
          >确认</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
  // watch, computed, in  ct, re  f,  onMounted
  import { reactive, ref } from 'vue'
  import type { FormInstance, FormRules } from 'element-plus'
  import { HttpResponse } from '@/api/sys/model/http'
  import { ElMessage } from 'element-plus'
  import { saveOrUpdateDepart } from '@/api/sys/depart'
  export default defineComponent({
    props: {
      // 是否显示弹窗
      dialogFormVisible: {
        type: Boolean,
        default: false
      },
      // 上级部门
      parentId: {
        type: String,
        default: ''
      },
      // 部门树列表数据
      treeData: {
        type: Array,
        default: () => []
      }
    },

    emits: ['cancel', 'success'],
    setup(props, { emit }) {
      const ruleFormRef = ref()
      const rules = reactive<FormRules>({
        departName: [{ required: true, message: '请输入部门名称', trigger: 'blur' }]
      })
      const formData = reactive({
        departName: '', //部门名称
        parentId: '', //上级部门
        orgCategory: '1', //组织类型
        departOrder: 0, //部门排序
        mobile: '', //手机号
        address: '',
        memo: ''
      })

      const defaultProps = {
        children: 'children',
        label: 'departName',
        value: 'id'
      }
      const formLabelWidth = '120px'
      const loading = ref(false)

      // 提交表单
      const submitForm = async (formEl: FormInstance) => {
        if (!formEl) return
        await formEl.validate((valid, fields) => {
          if (valid) {
            console.log('submit!')
            saveDepartInfo()
          } else {
            console.log('error submit!', fields)
          }
        })
      }

      const close = () => {
        emit('cancel')
      }
      const opened = () => {
        formData.departName = ''
        formData.parentId = props.parentId
        formData.orgCategory = props.parentId ? '2' : '1' // 部门类型
        formData.departOrder = 0
        formData.mobile = ''
        formData.address = ''
        formData.memo = ''
      }
      //保存部门信息
      const saveDepartInfo = () => {
        loading.value = true
        saveOrUpdateDepart(formData, false)
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
      return {
        ruleFormRef,
        rules,
        defaultProps,
        formData,
        formLabelWidth,
        loading,
        opened,
        close,
        submitForm
      }
    }
  })
</script>
<style scoped>
  .el-button--text {
    margin-right: 15px;
  }

  .el-select {
    width: 300px;
  }

  .el-input {
    width: 300px;
  }

  .dialog-footer button:first-child {
    margin-right: 10px;
  }
</style>
