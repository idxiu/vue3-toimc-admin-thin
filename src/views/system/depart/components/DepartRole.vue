<template>
  <!--菜单组织机构树-->
  <div style="min-height: 360px">
    <el-tree
      :data="treeData"
      :props="defaultProps"
      node-key="id"
      :default-checked-keys="checkedKeys"
      show-checkbox
      default-expand-all
      @check="onCheck"
    >
    </el-tree>
  </div>

  <div class="form-footer flex justify-end mr-2">
    <el-button type="primary" @click="saveInfo">保存</el-button>
  </div>
</template>
<script lang="ts">
  import { ref } from 'vue'
  import { getMenuList } from '@/api/sys/menu'
  import { saveOrUpdateDepartPermission } from '@/api/sys/depart'
  import { ElMessage } from 'element-plus'
  import { HttpResponse } from '@/api/sys/model/http'
  let tempIds: any = []
  export default defineComponent({
    props: {
      // 部门树列表数据默认选中的节点
      defaultKeys: {
        type: Array,
        default: () => []
      },
      departId: {
        type: String,
        default: ''
      }
    },
    setup(props) {
      let treeData = ref([])
      const defaultProps = {
        children: 'children',
        label: 'name',
        value: 'id'
      }
      //选中节点
      const checkedKeys = ref([])

      //check 事件 传递给 data 属性的数组中该节点所对应的对象、树目前的选中状态对象
      const onCheck = (_data: any, checked: any) => {
        checkedKeys.value = checked.checkedKeys
      }

      //获取菜单列表
      const loadMenuTree = () => {
        getMenuList().then((res: HttpResponse) => {
          // 修复菜单数据 数据结构{total: 0, records: Array(number)}
          treeData.value = res?.data?.records
        })
      }

      loadMenuTree()

      //选中节点时把节点信息传给树回显
      const setCheckedKeys = (data: any) => {
        console.log('setCheckedKeys', data)
        tempIds = [...data]
        checkedKeys.value = data
      }
      //保存信息
      const saveInfo = () => {
        let data = {
          departId: props.departId, //部门id
          lastPermissionIds: tempIds, //上次的权限
          permissionIds: checkedKeys.value //本次的权限
        }
        saveOrUpdateDepartPermission(data).then((res: HttpResponse) => {
          if (res.code === 200) {
            //保存成功
          } else {
            ElMessage({
              message: `${res.message}`,
              type: 'error'
            })
          }
        })
      }
      return { props, defaultProps, checkedKeys, treeData, onCheck, setCheckedKeys, saveInfo }
    }
  })
</script>

<style></style>
