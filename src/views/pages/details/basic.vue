<template>
  <div class="p-4">
    <t-card>
      <descriptions title="退款申请" :items="infoSchema" :border="false" :collapse="false" />
    </t-card>
    <el-divider />
    <t-card>
      <descriptions title="用户信息" :items="userSchema" :border="false" :collapse="false" />
    </t-card>
    <el-divider />
    <t-card header="退货商品">
      <el-table :data="tableData" stripe style="width: 100%" table-layout="auto">
        <el-table-column
          v-for="(item, index) in columns"
          :key="index"
          :prop="item.prop ? item.prop : ''"
          :align="item.align ? item.align : 'left'"
          :label="item.lable ? item.lable : ''"
          :width="item.width ? item.width : ''"
        >
          <template v-if="item.type === 'link'" #default="scope">
            <el-link type="primary" :underline="false">{{ scope.row.code }}</el-link>
          </template>
        </el-table-column>
      </el-table>
    </t-card>
    <el-divider />
    <t-card header="退货进度">
      <el-table :data="tableData2" stripe style="width: 100%" table-layout="auto">
        <el-table-column
          v-for="(item, index) in columns2"
          :key="index"
          :prop="item.prop ? item.prop : ''"
          :align="item.align ? item.align : 'left'"
          :label="item.lable ? item.lable : ''"
        >
          <template v-if="item.type === 'status'" #default="scope">
            <span
              ><icon style="vertical-align: middle" type="SuccessFilled" color="green" />
              {{ scope.row.status }}</span
            >
          </template>
        </el-table-column>
      </el-table>
    </t-card>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { DescItem } from '@/components/Descriptions/types'
  import Mock from 'mockjs'

  export default defineComponent({
    setup() {
      const infoSchema: DescItem[] = Mock.mock({
        list: [
          {
            label: '取货单号：',
            field: /\d{10}/
          },
          {
            label: '状态：',
            'field|1': ['已取货', '未取货', '退款处理中', '退货中']
          },
          {
            label: '销售单号：',
            field: /\d{10}/
          },
          {
            label: '子订单：',
            field: /\d{10}/
          }
        ]
      }).list

      const userSchema: DescItem[] = Mock.mock({
        list: [
          {
            label: '用户姓名：',
            field: '@cname'
          },
          {
            label: '联系电话：',
            field: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
          },
          {
            label: '常用快递：',
            'field|1': ['菜鸟仓储', '申通', '圆通', '中通', '韵达', '顺丰', '极兔']
          },
          {
            label: '取货地址：',
            field: '@county(true) XXX社区快递代收点'
          },
          {
            label: '备注：',
            field: '无'
          }
        ]
      }).list

      const tableData = Mock.mock({
        list: [
          {
            code: /\d{9}/,
            name: '矿泉水550ml',
            barcode: /\d{17}/,
            price: '2.00',
            quantity: '1',
            amount: '2'
          },
          {
            code: /\d{9}/,
            name: '白象香浓骨汤面',
            barcode: /\d{17}/,
            price: '2.50',
            quantity: '2',
            amount: '5'
          },
          {
            code: /\d{9}/,
            name: '金锣火腿肠10支装',
            barcode: /\d{17}/,
            price: '12.00',
            quantity: '1',
            amount: '12'
          },
          {
            code: '123456003',
            name: '可口可乐550ml',
            barcode: '12421432143214323',
            price: '3.00',
            quantity: '2',
            amount: '6'
          },
          {
            code: '总计',
            name: '',
            barcode: '',
            price: '',
            quantity: '6',
            amount: '25'
          }
        ]
      }).list

      const columns = [
        {
          lable: '商品编号',
          align: 'center',
          type: 'link'
        },
        {
          prop: 'name',
          lable: '商品名称',
          align: 'center'
        },
        {
          prop: 'barcode',
          lable: '商品条码',
          align: 'center'
        },
        {
          prop: 'price',
          lable: '单价',
          align: 'center'
        },
        {
          prop: 'quantity',
          lable: '数量（件）',
          align: 'center',
          width: '150'
        },
        {
          prop: 'amount',
          lable: '金额',
          align: 'center'
        }
      ]

      const tableData2 = Mock.mock({
        list: [
          {
            time: '2022-01-12 16:30',
            progress: '联系客户',
            status: '进行中',
            userId: '取货员 ID1234',
            useTime: '5mins'
          },
          {
            time: '2022-01-12 16:25',
            progress: '取货员出发',
            status: '成功',
            userId: '取货员 ID1234',
            useTime: '5mins'
          },
          {
            time: '2022-01-12 16:20',
            progress: '取货员接单',
            status: '成功',
            userId: '系统',
            useTime: '5mins'
          },
          {
            time: '2022-01-12 15:15',
            progress: '申请审批通过',
            status: '成功',
            userId: '用户',
            useTime: '1h'
          }
        ]
      }).list

      const columns2 = [
        {
          prop: 'time',
          lable: '时间',
          align: 'center'
        },
        {
          prop: 'progress',
          lable: '当前进度',
          align: 'center'
        },
        {
          lable: '状态',
          align: 'center',
          type: 'status'
        },
        {
          prop: 'userId',
          lable: '操作员ID',
          align: 'center'
        },
        {
          prop: 'useTime',
          lable: '耗时',
          align: 'center'
        }
      ]

      return {
        infoSchema,
        userSchema,
        tableData,
        columns,
        tableData2,
        columns2
      }
    }
  })
</script>

<style scoped lang="scss">
  .el-card {
    &:last-child {
      margin-bottom: 40px;
    }
  }
</style>
