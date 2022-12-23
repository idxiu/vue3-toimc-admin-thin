<template>
  <div class="p-4 grid grid-cols-4 gap-3">
    <el-col>
      <t-card header="折线图">
        <d-echarts :option="lineOptions" autoresize></d-echarts>
      </t-card>
    </el-col>
    <el-col>
      <t-card header="饼图">
        <d-echarts :option="pieOptions"></d-echarts>
      </t-card>
    </el-col>
    <el-col>
      <t-card header="柱形图">
        <d-echarts :option="barOptions"></d-echarts>
      </t-card>
    </el-col>
    <el-col>
      <t-card header="雷达图">
        <d-echarts :option="radarOptions"></d-echarts>
      </t-card>
    </el-col>
    <el-col>
      <t-card header="折线图">
        <v-charts type="LineChart" :option="lineOptions"></v-charts>
      </t-card>
    </el-col>
    <el-col>
      <t-card header="饼图">
        <v-charts type="PieChart" :option="pieOptions"></v-charts>
      </t-card>
    </el-col>
    <el-col>
      <t-card header="柱形图">
        <v-charts type="BarChart" :option="barOptions"></v-charts>
      </t-card>
    </el-col>
    <el-col>
      <t-card header="雷达图">
        <v-charts type="RadarChart" prefix-class="my-charts" :option="radarOptions"></v-charts>
      </t-card>
    </el-col>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    setup() {
      // 折线图选项
      const lineOptions = ref<any>({
        grid: {
          top: 20,
          right: 20,
          bottom: 40,
          left: 40
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: {
          data: [150, 230, 224, 218, 135, 147, 260],
          type: 'line'
        }
      })

      // 饼图选项
      const pieOptions = ref<any>({
        grid: {
          top: 20,
          right: 20,
          bottom: 40,
          left: 40
        },
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['40%', '80%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '14'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 1048, name: '搜索引擎' },
              { value: 735, name: '直接访问' },
              { value: 580, name: '邮件营销' },
              { value: 484, name: '联盟广告' },
              { value: 300, name: '视频广告' }
            ]
          }
        ]
      })

      // 柱状图选项
      const barOptions = ref<any>({
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar'
          }
        ]
      })
      // 雷达图选项
      const radarOptions = ref<any>({
        radar: {
          indicator: [
            { name: 'Sales', max: 6500 },
            { name: 'Administration', max: 16000 },
            { name: 'Information Technology', max: 30000 },
            { name: 'Customer Support', max: 38000 },
            { name: 'Development', max: 52000 },
            { name: 'Marketing', max: 25000 }
          ]
        },
        series: [
          {
            name: 'Budget vs spending',
            type: 'radar',
            data: [
              {
                value: [4200, 3000, 20000, 35000, 50000, 18000],
                name: 'Allocated Budget'
              },
              {
                value: [5000, 14000, 28000, 26000, 42000, 21000],
                name: 'Actual Spending'
              }
            ]
          }
        ]
      })
      return { lineOptions, pieOptions, barOptions, radarOptions }
    }
  })
</script>

<style scoped lang="scss">
  .my-charts {
    width: 100%;
    height: 500px;
  }
</style>
