.<template>
  <el-row class="p-4">
    <!-- 部门树节点 -->
    <el-col :md="8" :sm="24" :xl="6">
      <DepartLeftTree
        ref="leftTree"
        :loading="loading"
        :tree-data="treeData"
        @on-node-click="onTreeSelect"
      />
    </el-col>
    <!-- 部门对应的基本信息及权限 -->
    <t-card header="部门详情" class="ml-2 flex-1">
      <el-tabs v-show="hasCheckNode" v-model="activeName" class="depart-tabs">
        <el-tab-pane label="基本信息" name="info">
          <DepartInfo ref="departInfoRef" :tree-data="treeData" @on-save="onSave" />
        </el-tab-pane>
        <el-tab-pane label="部门权限" name="role">
          <DepartRole ref="departPermissionRef" :depart-id="departId" />
        </el-tab-pane>
      </el-tabs>
      <div v-show="hasCheckNode == false" class="pt-10">尚未选择部门</div>
    </t-card>
  </el-row>
</template>

<script lang="ts">
  import { ref } from 'vue'
  import DepartLeftTree from './components/DepartLeftTree.vue'
  import DepartInfo from './components/DepartInfo.vue'
  import DepartRole from './components/DepartRole.vue'
  // import type { TabsPaneContext } from 'element-plus'
  import { ElMessage } from 'element-plus'
  import { HttpResponse } from '@/api/sys/model/http'
  import { queryRoleTreeList, saveOrUpdateDepart, queryDepartPermission } from '@/api/sys/depart'
  export default defineComponent({
    components: { DepartLeftTree, DepartInfo, DepartRole },
    setup() {
      // 当前选中的tab标签
      const activeName = ref('info')
      // 选中的部门Id
      const departId = ref('')

      //部门树节点
      const treeData = ref([null])
      // 是否选中部门信息
      const hasCheckNode = ref(false)

      const departInfoRef = ref()
      const departPermissionRef = ref()
      const onTreeSelect = (node) => {
        departId.value = node.id
        hasCheckNode.value = true
        //把选中的部门信息赋值给当前部门
        departInfoRef.value.setFormInfo(node)
        queryDepartPermissionById(node.id)
      }
      //查询部门拥有的权限
      const queryDepartPermissionById = (departId: number) => {
        queryDepartPermission({ departId }).then((res: HttpResponse) => {
          console.log('queryDepartPermissionById', departPermissionRef)
          departPermissionRef.value.setCheckedKeys(res.data)
        })
      }

      const loading = ref<boolean>(false)
      // 加载顶级部门树信息
      const loadRootTreeData = () => {
        loading.value = true
        treeData.value = []
        queryRoleTreeList().then((res: HttpResponse) => {
          treeData.value = res.data
          loading.value = false
        })
      }
      loadRootTreeData()

      //更新当前选中的部门信息
      const onSave = (data) => {
        console.log('onSave', data)
        saveOrUpdateDepart(data, true).then((res: HttpResponse) => {
          console.log('更新树节点', res)
          if (res.code === 200) {
            //保存成功
            ElMessage({
              message: `${res.message}`,
              type: 'success'
            })
          } else {
            ElMessage({
              message: `${res.message}`,
              type: 'error'
            })
          }
        })
      }
      return {
        loading,
        treeData,
        hasCheckNode,
        activeName,
        departId,
        departInfoRef,
        departPermissionRef,
        onSave,
        onTreeSelect
      }
    }
  })
</script>

<style scoped lang="scss">
  .el-col {
    margin-bottom: 10px;
    background: white;
  }
</style>
