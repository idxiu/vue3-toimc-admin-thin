<template>
  <div class="dashboard-body">
    <el-row>
      <el-col :span="6">
        <dashboard-card
          :options="{
            title: '总销量',
            end: end1,
            dot: 2,
            prefix: '￥',
            mainIcon: 'RMBc',
            dataFrom: '自上周以来',
            dataStatus: 'rise',
            dataNum: '12%'
          }"
          :have-border="false"
          :hover-shadow="false"
          :body-style="{
            backgroundColor: '#ff654c',
            backgroundImage: 'linear-gradient(to right, #74bcff , #1890ff)',
            color: '#fff'
          }"
        />
      </el-col>
      <el-col :span="6">
        <dashboard-card
          :options="{
            title: '总成交',
            end: end2,
            mainIcon: 'RMBs',
            dataFrom: '自上周以来',
            dataStatus: 'riseC',
            dataNum: '36%'
          }"
        />
      </el-col>
      <el-col :span="6">
        <dashboard-card
          :options="{
            title: '活跃用户',
            end: end3,
            mainIcon: 'user',
            dataFrom: '自上周以来',
            dataStatus: 'fallC',
            dataNum: '5%'
          }"
        />
      </el-col>
      <el-col :span="6">
        <dashboard-card
          :options="{
            title: '订单',
            end: end4,
            mainIcon: 'order',
            dataFrom: '自上周以来',
            dataStatus: 'riseC',
            dataNum: '8%'
          }"
        />
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <echarts-board
          title="趋势"
          type="line"
          :data="{
            line1: [1401, 2322, 1015, 2143, 1304, 3401, 2505, 3015, 2922, 2811, 3233, 4361],
            line2: [1201, 2822, 1113, 2345, 2204, 2806, 3107, 3002, 3510, 2155, 3881, 3511]
          }"
        />
      </el-col>
      <el-col :span="6">
        <echarts-board
          title="分布"
          type="pie"
          :data="{
            pie: [
              { value: 1048, name: '搜索引擎' },
              { value: 735, name: '直接访问' },
              { value: 580, name: '邮件营销' },
              { value: 484, name: '联盟广告' },
              { value: 300, name: '视频广告' }
            ]
          }"
        />
      </el-col>
      <el-col :span="6">
        <echarts-board
          title="消费排行"
          type="bar"
          :data="{
            bar: [
              ['小明', 314],
              ['小红', 351],
              ['小李', 287],
              ['小王', 219],
              ['小刚', 253],
              ['小强', 165],
              ['小凯', 318],
              ['小林', 366]
            ]
          }"
        />
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <board-table />
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
  import DashboardCard from './components/card/index.vue'
  import EchartsBoard from './components/board/index.vue'
  import BoardTable from './components/table/index.vue'

  import Mock from 'mockjs'

  export default defineComponent({
    name: 'DashBoard',
    components: {
      DashboardCard,
      EchartsBoard,
      BoardTable
    },
    setup() {
      const end1 = Mock.mock('@float(100, 50000, 2, 2)')
      const end2 = Mock.mock('@float(600, 3000)')
      const end3 = Mock.mock('@float(5000, 60000)')
      const end4 = Mock.mock('@float(800, 6000)')
      return {
        end1,
        end2,
        end3,
        end4
      }
    },
    activated() {
      // called on initial mount
      // and every time it is re-inserted from the cache
      console.log('keep-alive demo, set keepAlive in meta: activated')
    },
    deactivated() {
      // called when removed from the DOM into the cache
      // and also when unmounted
      console.log('keep-alive demo: deactivated')
    }
  })
</script>

<style scoped lang="scss">
  .dashboard-body {
    width: 100%;
    height: 100%;
    padding: 20px;
    background: #f6f8f9;

    :deep(.el-row) {
      margin-bottom: 0.5rem;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
</style>
