<template>
  <t-card
    :class="{
      'dashboard-card': true,
      'no-border': !haveBorder,
      'hover-shadow': hoverShadow
    }"
    :body-style="{ ...bodyStyle, height: '100%' }"
    shadow="never"
  >
    <span class="dashboard-title">{{ options.title }}</span>
    <div class="dashboard-content">
      <count-to
        :end-val="options.end"
        :start-val="options.begin"
        :decimals="options.dot"
        :duration="options.duration"
        :autoplay="options.auto"
        :prefix="options.prefix"
        :suffix="options.suffix"
      />
      <div class="icon-back">
        <icon v-if="options.mainIcon === 'RMBc'" icon="ant-design:bar-chart-outlined" size="40px">
        </icon>
        <icon
          v-if="options.mainIcon === 'RMBs'"
          icon="ant-design:account-book-outlined"
          size="40px"
        >
        </icon>
        <icon v-if="options.mainIcon === 'user'" icon="ant-design:user-outlined" size="40px">
        </icon>
        <icon
          v-if="options.mainIcon === 'order'"
          icon="ant-design:shopping-cart-outlined"
          size="40px"
        >
        </icon>
      </div>
    </div>
    <div class="dashboard-footer">
      <span>
        {{ options.dataFrom }}
      </span>
      <i class="mx-2 flex items-center">
        <trend
          v-if="options.dataStatus === 'rise'"
          cls="rounded-1/2 w-4 h-4 bg-white flex items-center justify-center"
          icon="Top"
          type="up"
          :colors="['#67a6f8', '', '']"
        >
        </trend>
        <trend
          v-if="options.dataStatus === 'fall'"
          cls="rounded-1/2 w-4 h-4 bg-white flex items-center justify-center"
          icon="Bottom"
          type="down"
          :colors="['', '', '#67a6f8']"
        >
        </trend>
        <trend
          v-if="options.dataStatus === 'riseC'"
          cls="rounded-1/2 w-4 h-4 bg-[#60cb70] flex items-center justify-center"
          icon="Top"
          type="up"
          :colors="['#fff', '', '']"
        >
        </trend>
        <trend
          v-if="options.dataStatus === 'fallC'"
          cls="rounded-1/2 w-4 h-4 bg-[#ec5b56] flex items-center justify-center"
          icon="Bottom"
          type="down"
          :colors="['', '', '#fff']"
        >
        </trend>
      </i>
      <span
        v-if="options.dataStatus === 'rise' || options.dataStatus === 'fall'"
        style="color: #fff"
        >{{ options.dataNum }}</span
      >
      <span v-if="options.dataStatus === 'riseC'" style="color: #13ce66">{{
        options.dataNum
      }}</span>
      <span v-if="options.dataStatus === 'fallC'" style="color: #ff4d4f">{{
        options.dataNum
      }}</span>
    </div>
  </t-card>
</template>

<script lang="ts">
  import { CSSProperties, defineComponent } from 'vue'
  import Mock from 'mockjs'

  type CardOptions = {
    title?: string
    begin?: number
    end?: number
    duration?: number
    dot?: number
    auto?: boolean
    breakAll?: boolean
    prefix?: string
    suffix?: string
    mainIcon?: 'RMBc' | 'RMBs' | 'user' | 'order'
    dataFrom?: string
    dataStatus?: 'rise' | 'fall' | 'riseC' | 'fallC'
    dataNum?: string
  }

  export default defineComponent({
    name: 'DashboardCard',
    props: {
      options: {
        type: Object as PropType<CardOptions>,
        default: () => ({
          title: '标题',
          begin: 0,
          end: Mock.mock('@float(100, 50000, 2, 2)'),
          duration: 5000,
          dot: 0,
          auto: true,
          breakAll: true,
          prefix: '',
          suffix: '',
          mainIcon: 'RMBc',
          dataFrom: '',
          dataStatus: 'rise',
          dataNum: ''
        })
      },
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
      return {}
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

  .hover-shadow {
    &:hover {
      box-shadow: 0 0 15px #b3b3b3;
      transition: all 0.2s;
    }
  }

  .dashboard-title {
    font-size: 0.9rem;
  }

  .dashboard-content {
    display: flex;
    margin: 0.6rem 0;
    font-size: 1.8rem;
    justify-content: space-between;
    align-items: center;

    .icon-back {
      display: flex;
      width: 4rem;
      height: 4rem;
      color: #1890ff;
      background-color: #e8f4ff;
      border-radius: 50%;
      justify-content: center;
      align-items: center;

      // font-size: 2rem;
    }
  }

  .dashboard-footer {
    display: flex;
    font-size: 0.9rem;
    align-items: center;
  }
</style>
