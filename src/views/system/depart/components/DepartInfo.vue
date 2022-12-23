<template>
  <el-form :model="formData">
    <el-form-item label="机构名称" :label-width="formLabelWidth">
      <el-input v-model="formData.departName" autocomplete="off" />
    </el-form-item>
    <el-form-item label="上级部门" :label-width="formLabelWidth">
      <el-tree-select
        v-model="formData.parentId"
        disabled
        node-key="id"
        :data="treeData"
        :props="defaultProps"
        placeholder=" "
        check-strictly
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
      <el-input v-model="formData.memo" type="textarea" />
    </el-form-item>
  </el-form>

  <div class="form-footer flex justify-end pr-2">
    <el-button @click="resetInfo">重置</el-button>
    <el-button type="primary" @click="saveInfo">保存</el-button>
  </div>
</template>

<script lang="ts">
  import { ref } from 'vue'
  let temp: any = {}
  export default defineComponent({
    props: {
      // 部门树列表数据
      treeData: {
        type: Array,
        default: () => []
      }
    },
    emits: ['on-save'],
    setup(props, { emit }) {
      const formLabelWidth = '120px'
      let formData = ref({
        departName: '', //部门名称
        parentId: '', //上级部门
        orgCategory: '1', //组织类型
        departOrder: 0, //部门排序
        mobile: '', //手机号
        address: '', //地址
        memo: '' //备注
      })
      const defaultProps = {
        children: 'children',
        label: 'departName',
        value: 'id'
      }

      //选中节点时把节点信息传给表单回显
      const setFormInfo = (data: any) => {
        console.log('setFormInfo', data)
        temp = {
          ...data
        }
        formData.value = data
      }
      //保存信息
      const saveInfo = () => {
        emit('on-save', formData.value)
      }
      //重置信息
      const resetInfo = () => {
        formData.value = {
          ...temp
        }
      }
      return { props, defaultProps, formLabelWidth, formData, setFormInfo, saveInfo, resetInfo }
    }
  })
</script>
