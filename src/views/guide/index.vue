<template>
  <div class="p-4">
    <el-card>
      <template #header>
        <div class="card-header">
          <span
            >引导页对于一些第一次进入项目的人很有用，你可以简单介绍下项目的功能。本 Demo 是基于
            driver.js.</span
          >
        </div>
      </template>
      <el-button type="primary" style="margin-top: 10px" @click.prevent.stop="guide">
        打开引导页
      </el-button>
    </el-card>
  </div>
</template>

<script lang="ts">
  import Driver from 'driver.js'
  import 'driver.js/dist/driver.min.css'

  export default defineComponent({
    setup() {
      const steps = [
        {
          element: '#header-collapse',
          popover: {
            title: '折叠展开',
            description: '你可以点击这里折叠或展开左侧菜单栏',
            position: 'right'
          }
        },
        {
          element: '#header-home',
          popover: {
            title: '返回首页',
            description: '你可以点击这里返回首页',
            position: 'left'
          }
        },
        {
          element: '#header-message',
          popover: {
            title: '消息通知',
            description: '你可以在这里查看管理员发送的消息',
            position: 'left'
          }
        },
        {
          element: '#header-internationalization',
          popover: {
            title: '国际化',
            description: '你可以在这里进行语言切换',
            position: 'left'
          }
        }
      ]

      const driver = new Driver({
        className: 'scoped-class',
        animate: true,
        opacity: 0.75,
        padding: 0,
        allowClose: true,
        overlayClickNext: false,
        doneBtnText: '完成',
        closeBtnText: '关闭',
        nextBtnText: '下一步',
        prevBtnText: '上一步'
      })

      const guide = () => {
        driver.defineSteps(steps)
        driver.start()
      }

      return {
        guide
      }
    }
  })
</script>

<style scoped></style>
