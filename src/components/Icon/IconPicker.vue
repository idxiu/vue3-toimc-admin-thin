<template>
  <el-button type="primary" @click="() => showDialog()">
    <slot>选择图标</slot>
  </el-button>
  <div class="icon-picker-dialog">
    <el-dialog v-model="dialogVisible" :title="title" width="30%" :before-close="handleClose">
      <icon-list
        :items="items"
        :show-icon="showIcon"
        :show-text="showText"
        :classes="classes"
        :choose="choose"
        @click="handlePick"
      ></icon-list>
      <template #footer>
        <span v-if="footer" class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleConfirm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
  import type { PropType } from 'vue'
  import type { IconTypes } from './types'
  import { IconData } from './data'

  export default defineComponent({
    name: 'IconPicker',
    props: {
      // 当前选中的图标
      choose: {
        type: [String, Number],
        default: ''
      },
      // 标题
      title: {
        type: String,
        default: '选择图标'
      },
      // 图标庥
      items: {
        type: Array as PropType<IconTypes[]>,
        default: () => IconData
      },
      // 是否显示图标
      showIcon: {
        type: Boolean,
        default: true
      },
      // 是否显示文字
      showText: {
        type: Boolean,
        default: false
      },
      // 是否显示控制按钮
      footer: {
        type: Boolean,
        default: false
      },
      // 设置图标列表的类名
      classes: {
        type: String,
        default: 'p-1'
      }
    },
    emits: ['update:choose', 'pick'],
    setup(_props, { emit }) {
      const { choose, footer } = toRefs(_props)
      let tmp

      onUpdated(() => {
        if (!tmp) {
          tmp = choose.value
        }
      })

      const dialogVisible = ref(false)
      function showDialog() {
        dialogVisible.value = !dialogVisible.value
      }

      function handleClose() {
        dialogVisible.value = false
        tmp = null
      }

      function handlePick(item) {
        if (!footer.value) {
          handleClose()
        }
        choose !== item && emit('update:choose', item)
      }

      async function handleCancel() {
        emit('update:choose', tmp)
        handleClose()
      }

      function handleConfirm() {
        emit('pick', choose.value)
        handleClose()
      }

      return {
        showDialog,
        handleClose,
        dialogVisible,
        handlePick,
        handleCancel,
        handleConfirm
      }
    }
  })
</script>

<style scoped lang="scss">
  .icon-picker-dialog {
    :deep(.el-dialog__body) {
      height: auto;
      max-height: 65vh;
      padding-top: 0;
      padding-bottom: 0;
      overflow-y: auto;
    }
  }
</style>
