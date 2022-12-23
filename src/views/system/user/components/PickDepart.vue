<template>
  <el-dialog :model-value="show" title="选择部门" center width="400px" @close="close">
    <!--  :default-checked-keys="[]" -->
    <div class="overflow-auto" style="height: 340px">
      <el-tree
        ref="treeDepartRef"
        v-loading="loading"
        default-expand-all
        :data="treeData"
        show-checkbox
        node-key="id"
        check-strictly
        :props="defaultProps"
      />
    </div>
    <template #footer>
      <span class="dialog-footer flex justify-end">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="onConfirm">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { queryRoleTreeList } from '@/api/sys/depart'
  import { HttpResponse } from '@/api/sys/model/http'
  export default defineComponent({
    props: {
      show: {
        type: Boolean,
        default: false
      },
      checkedKeys: {
        type: String,
        default: ''
      }
    },
    emits: ['close', 'confirm', 'loadTreeData'],
    setup(props, { emit }) {
      const defaultProps = {
        children: 'children',
        label: 'departName',
        value: 'id'
      }
      const loading = ref(false)
      //部门树节点
      const treeData = ref([])
      const treeDepartRef = ref()
      //查询所有部门
      const getAllDepart = () => {
        loading.value = true
        queryRoleTreeList().then((res: HttpResponse) => {
          treeData.value = res.data
          loading.value = false
          emit('loadTreeData', res.data)
        })
      }
      getAllDepart()
      const close = () => {
        emit('close')
      }
      //确认选择的节点
      const onConfirm = () => {
        let nodes = treeDepartRef.value.getCheckedNodes(false, true)
        close()
        emit('confirm', nodes)
      }

      watch(
        () => props.show,
        (val) => {
          if (val) {
            let arr = props.checkedKeys.split(',')
            if (arr.length > 0) {
              console.log('treeDepartRef', treeDepartRef)
              setTimeout(() => {
                console.log('treeDepartRef', treeDepartRef.value)
                treeDepartRef.value.setCheckedKeys(arr)
              }, 100)

              // treeDepartRef.value!.setCheckedKeys(arr)
              // treeDepartRef.value!.setCheckedKeys(arr, false)
            }
          }
        },
        {
          immediate: true
        }
      )

      return { defaultProps, treeData, treeDepartRef, loading, close, onConfirm }
    }
  })
</script>

<style></style>
