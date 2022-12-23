<template>
  <el-dialog :model-value="modelValue" :title="title" width="800px" :before-close="handleClose">
    <el-row class="min-h-60">
      <el-col :span="14">
        <div class="cropper">
          <cropper
            v-if="src"
            :src="src"
            height="300px"
            :circled="circled"
            @cropend="handleCropend"
            @ready="handleReady"
          ></cropper>
        </div>
        <el-row class="flex justify-between pt-4">
          <el-upload :file-list="[]" accept="image/*" :before-upload="handleBeforeUpload">
            <template #trigger>
              <el-tooltip content="选择图片">
                <el-button type="primary" size="small">
                  <icon icon="ep:upload-filled" size="18px"></icon>
                </el-button>
              </el-tooltip>
            </template>
          </el-upload>
          <el-row>
            <el-button-group>
              <el-button type="primary" size="small" class="!px-1">
                <el-tooltip content="重置">
                  <icon
                    icon="ep:refresh"
                    size="18px"
                    color="#fff"
                    @click="handlerToolbar('reset')"
                  ></icon>
                </el-tooltip>
              </el-button>
              <el-button type="primary" size="small" class="!px-1">
                <el-tooltip content="逆时针旋转">
                  <icon
                    icon="ant-design:rotate-left-outlined"
                    size="18px"
                    @click="handlerToolbar('rotate', -45)"
                  ></icon>
                </el-tooltip>
              </el-button>
              <el-button type="primary" size="small" class="!px-1">
                <el-tooltip content="顺时针旋转">
                  <icon
                    icon="ant-design:rotate-right-outlined"
                    size="18px"
                    @click="handlerToolbar('rotate', 45)"
                  ></icon>
                </el-tooltip>
              </el-button>
              <el-button type="primary" size="small" class="!px-1">
                <el-tooltip content="水平翻转">
                  <icon
                    icon="vaadin:arrows-long-h"
                    size="18px"
                    @click="handlerToolbar('scaleX')"
                  ></icon>
                </el-tooltip>
              </el-button>
              <el-button type="primary" size="small" class="!px-1">
                <el-tooltip content="垂直翻转">
                  <icon
                    icon="vaadin:arrows-long-v"
                    size="18px"
                    @click="handlerToolbar('scaleY')"
                  ></icon>
                </el-tooltip>
              </el-button>
              <el-button type="primary" size="small" class="!px-1">
                <el-tooltip content="放大">
                  <icon
                    icon="ant-design:zoom-in-outlined"
                    size="18px"
                    @click="handlerToolbar('zoom', 0.1)"
                  ></icon>
                </el-tooltip>
              </el-button>
              <el-button type="primary" size="small" class="!px-1">
                <el-tooltip content="缩小">
                  <icon
                    icon="ant-design:zoom-out-outlined"
                    size="18px"
                    @click="handlerToolbar('zoom', -0.1)"
                  ></icon>
                </el-tooltip>
              </el-button>
            </el-button-group>
          </el-row>
        </el-row>
      </el-col>
      <el-col :span="10" class="px-4">
        <div class="preview">
          <img v-if="previewSource" :src="previewSource" alt="预览图片" />
        </div>
        <template v-if="previewSource">
          <div class="group flex justify-around items-center pt-4 mt-6">
            <el-avatar :src="previewSource" size="small" />
            <el-avatar :src="previewSource" :size="48" />
            <el-avatar :src="previewSource" :size="64" />
            <el-avatar :src="previewSource" :size="80" />
          </div>
        </template>
      </el-col>
    </el-row>
    <template v-if="footer" #footer>
      <slot name="footer">
        <span class="dialog-footer">
          <el-button @click="handleCancel">{{ cancelText }}</el-button>
          <el-button :loading="loading" type="primary" @click="handleConfirm">{{
            okText
          }}</el-button>
        </span>
      </slot>
    </template>
  </el-dialog>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { CropendResult } from './typing'
  import { isFunction } from 'lodash-es'
  import { dataURLtoBlob } from '@/utils/file/base64Conver'

  export default defineComponent({
    props: {
      modelValue: {
        type: Boolean,
        default: false
      },
      circled: { type: Boolean, default: true },
      title: {
        type: String,
        default: '图片裁剪'
      },
      action: {
        type: String,
        default: ''
      },
      image: {
        type: String,
        default: ''
      },
      footer: {
        type: Boolean,
        default: true
      },
      cancelText: {
        type: String,
        default: '取消'
      },
      okText: {
        type: String,
        default: '确定并上传'
      }
    },
    emits: ['update:modelValue', 'success'],
    setup(props, { emit }) {
      const src = ref(props?.image || '')
      const previewSource = ref('')
      const loading = ref(false)

      const cropper = ref<Cropper>()

      let filename = ''
      let scaleX = 1
      let scaleY = 1

      function handleBeforeUpload(file: File) {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        src.value = ''
        previewSource.value = ''
        reader.onload = function (e) {
          src.value = (e.target?.result as string) ?? ''
          filename = file.name
        }
        return false
      }

      function handleReady(cropperInstance: Cropper) {
        cropper.value = cropperInstance
      }

      function handleCropend({ imgBase64 }: CropendResult) {
        previewSource.value = imgBase64
      }

      function handlerToolbar(event: string, arg?: number) {
        if (event === 'scaleX') {
          scaleX = arg = scaleX === -1 ? 1 : -1
        }
        if (event === 'scaleY') {
          scaleY = arg = scaleY === -1 ? 1 : -1
        }
        cropper?.value?.[event]?.(arg)
      }

      const handleCancel = () => {
        emit('update:modelValue', false)
      }

      const handleConfirm = async () => {
        const uploadApi = props.action
        if (uploadApi && isFunction(uploadApi)) {
          const blob = dataURLtoBlob(previewSource.value)
          try {
            loading.value = true
            const result = await uploadApi({ name: 'file', file: blob, filename })
            emit('success', { source: previewSource.value, data: result.data })
            handleCancel()
          } finally {
            loading.value = false
          }
        }
      }

      const handleClose = (done: () => void) => {
        handleCancel()
        done()
      }

      return {
        cropper,
        src,
        loading,
        previewSource,
        handleReady,
        handleCropend,
        handleClose,
        handleCancel,
        handleConfirm,
        handleBeforeUpload,
        handlerToolbar
      }
    }
  })
</script>

<style lang="scss" scoped>
  .cropper {
    height: 300px;
    background: #eee;
    background-image: linear-gradient(
        45deg,
        rgb(0 0 0 / 25%) 25%,
        transparent 0,
        transparent 75%,
        rgb(0 0 0 / 25%) 0
      ),
      linear-gradient(
        45deg,
        rgb(0 0 0 / 25%) 25%,
        transparent 0,
        transparent 75%,
        rgb(0 0 0 / 25%) 0
      );
    background-position: 0 0, 12px 12px;
    background-size: 24px 24px;
  }

  .preview {
    width: 220px;
    height: 220px;
    margin: 0 auto;
    overflow: hidden;
    border: 1px solid #eee;
    border-radius: 50%;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .group {
    border-top: 1px solid #eee;
  }
</style>
