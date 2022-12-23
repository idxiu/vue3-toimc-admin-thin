<template>
  <h2 class="border-b border-gray-200 mb-4 pb-2">基本信息</h2>
  <el-form label-position="right" label-width="100px" :model="formLabelAlign">
    <el-form-item label="姓名">
      <el-input v-model="formLabelAlign.name" />
    </el-form-item>
    <el-form-item label="介绍">
      <el-input v-model="formLabelAlign.name" />
    </el-form-item>
    <el-form-item label="头像">
      <el-upload
        class="avatar-uploader"
        action="https://jsonplaceholder.typicode.com/posts/"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <el-avatar
          v-if="formLabelAlign.imageUrl"
          shape="square"
          :size="80"
          :src="formLabelAlign.imageUrl"
        />
        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
      </el-upload>
    </el-form-item>

    <el-form-item label="电话">
      <el-input v-model="formLabelAlign.region" />
    </el-form-item>
    <el-form-item label="邮箱">
      <el-input v-model="formLabelAlign.type" />
    </el-form-item>
  </el-form>
  <div class="mt-4 py-4 px-4 flex justify-end sm:px-6">
    <el-button type="primary">保存</el-button>
  </div>
</template>

<script lang="ts">
  import type { UploadProps } from 'element-plus'
  import { ElMessage } from 'element-plus'
  import { Plus } from '@element-plus/icons-vue'
  export default defineComponent({
    name: 'SettingUserInfoForm',
    components: {
      Plus
    },
    setup() {
      const formLabelAlign = reactive({
        name: '',
        imageUrl: '',
        region: '',
        type: ''
      })
      const handleAvatarSuccess: UploadProps['onSuccess'] = (_response, uploadFile) => {
        formLabelAlign.imageUrl = URL.createObjectURL(uploadFile.raw!)
      }

      const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
        if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
          ElMessage.error('Avatar picture must be JPG format!')
          return false
        } else if (rawFile.size / 1024 / 1024 > 2) {
          ElMessage.error('Avatar picture size can not exceed 2MB!')
          return false
        }
        return true
      }
      return { formLabelAlign, handleAvatarSuccess, beforeAvatarUpload }
    }
  })
</script>

<style scoped lang="scss">
  .avatar-uploader {
    :deep(.el-upload) {
      position: relative;
      overflow: hidden;
      cursor: pointer;
      border: 1px dashed #dcdfe6;
      border-radius: 6px;
      transition: 0.2s;

      &:hover {
        border-color: #409eff;
      }

      .el-icon.avatar-uploader-icon {
        width: 80px;
        height: 80px;
        font-size: 28px;
        color: #8c939d;
        text-align: center;
      }
    }
  }
</style>
