<template>
  <t-card
    :class="{
      'dashboard-card': true,
      'no-border': !haveBorder
      // 'hover-shadow': hoverShadow
    }"
    :body-style="{ ...bodyStyle, height: '100%' }"
    shadow="never"
  >
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="派件管理" name="first">
        <el-table :data="tableData" border style="width: 100%" table-layout="auto">
          <el-table-column prop="date" label="日期" width="120" />
          <el-table-column label="派送信息">
            <el-table-column prop="name" label="姓名" width="120" />
            <el-table-column prop="state" label="省份" width="120" />
            <el-table-column prop="city" label="市区" width="120" />
            <el-table-column prop="address" label="地址" />
            <el-table-column prop="zip" label="邮编" width="120" />
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="区域管理" name="second">敬请期待</el-tab-pane>
    </el-tabs>
  </t-card>
</template>

<script lang="ts">
  import { CSSProperties, defineComponent, ref } from 'vue'
  import Mock from 'mockjs'

  export default defineComponent({
    name: 'BoardTable',
    props: {
      haveBorder: {
        type: Boolean,
        default: true
      },
      hoverShadow: {
        type: Boolean,
        default: true
      },
      bodyStyle: {
        type: Object as PropType<CSSProperties>,
        default: () => ({})
      }
    },
    setup() {
      const tableData = Mock.mock({
        list: [
          {
            date: '2022-05-03',
            name: '@cname',
            state: '北京',
            city: '北京市',
            address: '北京，北京市，XX路101号',
            zip: '100000'
          },
          {
            date: '2022-05-02',
            name: '@cname',
            state: '北京',
            city: '北京市',
            address: '北京，北京市，XX路102号',
            zip: '100000'
          },
          {
            date: '2022-05-04',
            name: '@cname',
            state: '北京',
            city: '北京市',
            address: '北京，北京市，XX路103号',
            zip: '100000'
          }
        ]
      }).list
      const activeName = ref('first')

      return {
        tableData,
        activeName
      }
    }
  })
</script>

<style scoped lang="scss">
  .dashboard-card {
    margin: 0 5px;
    background-color: transparent;
    box-sizing: border-box;

    :deep(.el-card) {
      height: 100%;
    }
  }

  .no-border {
    :deep(.el-card) {
      border: none;
    }
  }

  // .hover-shadow {
  //   &:hover {
  //     box-shadow: 0 0 15px #b3b3b3;
  //     transition: all 0.2s;
  //   }
  // }
</style>
