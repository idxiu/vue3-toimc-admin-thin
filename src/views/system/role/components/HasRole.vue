<template>
  <!--菜单组织机构树-->

  <el-drawer :model-value="showDrawer" direction="rtl" @close="onClose">
    <template #header>
      <h4 class="divide-y divide-gray-500/50">角色权限配置</h4>
    </template>
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
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">取消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="saveInfo(false)">仅保存</el-button>
        <el-button type="primary" :loading="btnLoading" @click="saveInfo(true)"
          >保存并关闭</el-button
        >
      </div>
    </template>
  </el-drawer>
</template>
<script lang="ts">
  import { ref } from 'vue'
  import {
    queryRoleTreeList,
    queryRolePermission,
    saveOrUpdateRolePermission
  } from '@/api/sys/role'
  import { ElMessage } from 'element-plus'
  import { HttpResponse } from '@/api/sys/model/http'
  let tempIds: any = []
  export default defineComponent({
    props: {
      showDrawer: {
        type: Boolean,
        default: false
      },
      // 部门树列表数据默认选中的节点
      defaultKeys: {
        type: Array,
        default: () => []
      },
      roleId: {
        type: String,
        default: ''
      }
    },
    emits: ['onConfirm', 'close'],
    setup(props, ctx) {
      let treeData = ref([])
      const defaultProps = {
        children: 'children',
        label: 'name',
        value: 'id'
      }

      const btnLoading = ref(false)
      function onClose() {
        if (props.showDrawer) {
          ctx.emit('close')
        }
      }
      function cancelClick() {
        ctx.emit('close')
      }
      //选中节点
      const checkedKeys = ref([])

      //check 事件 传递给 data 属性的数组中该节点所对应的对象、树目前的选中状态对象
      const onCheck = (_data: any, checked: any) => {
        checkedKeys.value = checked.checkedKeys
      }

      //获取菜单列表
      const loadMenuTree = () => {
        queryRoleTreeList().then((res: HttpResponse) => {
          treeData.value = res?.data
        })
      }
      loadMenuTree()

      //根据角色ID获取角色权限
      const getPermissionByRoleId = () => {
        console.log('roleId', props.roleId)
        queryRolePermission(props.roleId).then((res: HttpResponse) => {
          setCheckedKeys(res.data)
        })
      }

      //回显树选中节点
      const setCheckedKeys = (data: any) => {
        tempIds = [...data]
        checkedKeys.value = data
      }
      //保存信息
      const saveInfo = (isClose: boolean) => {
        // 逗号分开的字符串
        let data = {
          roleId: props.roleId, //角色id
          lastPermissionIds: tempIds.join(','), //上次的权限
          permissionIds: checkedKeys.value.join(',') //本次的权限
        }
        btnLoading.value = true
        saveOrUpdateRolePermission(data).then((res: HttpResponse) => {
          btnLoading.value = false

          if (res.code === 0) {
            //保存成功
          } else {
            ElMessage({
              message: `${res.message}`,
              type: 'error'
            })
          }
          if (isClose) onClose()
        })
      }

      // 监听参数变化
      watch(
        () => props.roleId,
        () => {
          if (props.showDrawer) {
            // 重新根据角色ID获取角色权限
            getPermissionByRoleId()
          }
        }
      )
      // watch(
      //   props,
      //   () => {
      //     props.showDrawer && createQrcode()
      //   },
      //   {
      //     deep: true
      //   }
      // )
      return {
        defaultProps,
        checkedKeys,
        treeData,
        btnLoading,
        cancelClick,
        onClose,
        onCheck,
        saveInfo
      }
    }
  })
</script>

<style></style>
