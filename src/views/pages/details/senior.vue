<template>
  <div class="p-4">
    <div class="header">
      <el-row class="pt-3 pb-1" align="middle">
        <el-col :span="8" class="overflow-ellipsis">
          <span class="text-lg font-bold">{{ pageTitle }}</span>
        </el-col>
        <el-col :span="16" class="flex justify-end items-center">
          <el-button type="primary">主操作</el-button>
          <el-button>操作一</el-button>
          <el-button type="danger">操作二</el-button>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="详情" name="details" />
        <el-tab-pane label="规则" name="rules" />
        <el-tab-pane label="评价" name="appraise" />
      </el-tabs>
    </div>
    <el-divider />
    <t-card shadow="never">
      <descriptions :items="infoSchema" :border="false" :collapse="false" :column="2" />
      <div class="sub-title">
        <span>流程进度</span>
        <el-divider />
      </div>
      <el-steps :active="3" align-center finish-status="success">
        <el-step
          v-for="(item, index) in stepList"
          :key="index"
          :title="item.title"
          :description="item.description"
        />
      </el-steps>
      <div class="sub-title">
        <span>用户信息</span>
        <el-divider />
      </div>
      <descriptions :items="userSchema" :border="false" :collapse="false" style="padding: 0 20px" />
      <div class="bold-title">
        <span>信息组</span>
      </div>
      <descriptions :items="msgSchema" :border="false" :collapse="false" style="padding: 0 20px" />
      <t-card header="多层级信息组" shadow="never">
        <descriptions title="组1" :items="group1" :border="false" :collapse="false" />
        <el-divider />
        <descriptions title="组2" :items="group2" :border="false" :collapse="false" />
        <el-divider />
        <descriptions title="组3" :items="group3" :border="false" :collapse="false" :column="1" />
      </t-card>
      <el-divider />
      <t-card header="用户近3个月来电记录" shadow="never">
        <el-empty description="暂无数据" />
      </t-card>
      <el-divider />
      <t-card header="退货进度" shadow="never">
        <el-table :data="tableData" stripe style="width: 100%" table-layout="auto">
          <el-table-column
            v-for="(item, index) in columns"
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
    </t-card>
  </div>
</template>

<script lang="ts">
  import { ref } from 'vue'
  import { defineComponent } from 'vue'
  import { DescItem } from '@/components/Descriptions/types'
  import Mock from 'mockjs'

  export default defineComponent({
    setup() {
      const pageTitle = `单号：${Mock.mock({ lable: /\d{10}/ }).lable}`
      const activeName = ref('details')

      const infoSchema: DescItem[] = Mock.mock({
        list: [
          {
            label: '创建人：',
            field: /\d{10}/
          },
          {
            label: '订购产品：',
            'field|1': ['手机', '电脑', '平板电脑', '蓝牙音箱']
          },
          {
            label: '创建时间：',
            field: '2022-01-22'
          },
          {
            label: '关联单据：',
            field: {
              link: 'javascript: void(0)',
              text: /\d{6}/
            }
          },
          {
            label: '生效日期：',
            field: '2022-01-23 ~ 2022-02-23'
          },
          {
            label: '备注：',
            field: '无'
          }
        ]
      }).list

      const stepList = [
        {
          title: '流程发起',
          description: 'toimc 2022-01-22'
        },
        {
          title: '审核',
          description: 'admin 审核不通过'
        },
        {
          title: '退回修改',
          description: 'toimc 修改XXX内容'
        },
        {
          title: '审核'
        },
        {
          title: '流程结束'
        }
      ]

      const userSchema: DescItem[] = Mock.mock({
        list: [
          {
            label: '用户姓名：',
            field: '@cname'
          },
          {
            label: '会员卡号：',
            field: `VIP${Mock.mock({ num: /\d{16}/ }).num}`
          },
          {
            label: '身份证号：',
            field:
              /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
          },
          {
            label: '联系方式：',
            field: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/
          },
          {
            label: '联系地址：',
            field: '@cname 18800008888 @county(true) XXX社区X号楼X单元XXX室'
          }
        ]
      }).list

      const msgSchema: DescItem[] = Mock.mock({
        list: [
          {
            label: '数据ID：',
            field: /[a-z]{3}[0-9]{9}/
          },
          {
            label: '该数据更新时间：',
            field: '@now'
          },
          {
            label: '数据ID2：',
            field: /[a-z]{3}[0-9]{9}/
          },
          {
            label: '该数据更新时间：',
            field: '@now'
          }
        ]
      }).list

      const group1: DescItem[] = Mock.mock({
        list: [
          {
            label: '负责人：',
            field: '@cname'
          },
          {
            label: '角色编码：',
            field: `ID${Mock.mock({ num: /\d{8}/ }).num}`
          },
          {
            label: '所属部门：',
            field: 'XX公司 - 产品研发部'
          },
          {
            label: '过期时间：',
            field: '@datetime'
          },
          {
            label: '描述：',
            field: '@csentence'
          }
        ]
      }).list

      const group2: DescItem[] = Mock.mock({
        list: [
          {
            label: '描述：',
            field:
              'vue-toimc-admin 管理后台项目是基于 Vue3.0+TypeScript+Vite+Element-plus 的管理后台项目'
          }
        ]
      }).list

      const group3: DescItem[] = Mock.mock({
        list: [
          {
            label: '负责人：',
            field: '@cname'
          },
          {
            label: '角色编码：',
            field: `ID${Mock.mock({ num: /\d{8}/ }).num}`
          }
        ]
      }).list

      const tableData = Mock.mock({
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

      const columns = [
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
        pageTitle,
        activeName,
        infoSchema,
        stepList,
        userSchema,
        msgSchema,
        group1,
        group2,
        group3,
        tableData,
        columns
      }
    }
  })
</script>

<style scoped lang="scss">
  .header {
    width: 100%;
    padding: 10px 20px 0;
    background-color: #fff;
  }

  .sub-title {
    margin-top: 20px;

    span {
      margin-left: 20px;
    }
  }

  .bold-title {
    span {
      margin-left: 20px;
      font-size: 18px;
      font-weight: bold;
    }
  }

  .el-card {
    &:last-child {
      margin-bottom: 40px;
    }
  }

  .el-divider--horizontal {
    margin: 12px 0;
  }
</style>
