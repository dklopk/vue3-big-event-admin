<script setup>
import { ref } from 'vue'
import { Plus, Upload } from '@element-plus/icons-vue'
// 基于 store 的数据，初始化头像显示
import { useUserStore } from '@/stores'
import { userUpdateAvatarService } from '@/api/user'

const userStore = useUserStore()
const imageUrl = ref(userStore.user.user_pic)
const uploadRef = ref()
const loading = ref(false)

const onSelectFile = (file) => {
  // createObjectURL(file)创建的是一个临时的本地 URL，可以直接用于 img 标签的 src 属性，从而实现图片预览功能。
  // 这里后端需要base64格式的图片，所以改用FileReader读取
  // 基于 FileReader 读取图片做预览
  const reader = new FileReader() // 创建一个 FileReader 实例
  reader.readAsDataURL(file.raw) // 读取文件内容，结果将以 Data URL 的形式返回
  reader.onload = (e) => {
    // 读取完成后触发 onload 事件
    imageUrl.value = e.target.result // 将读取到的 Data URL 赋值给 imageUrl，用于预览
  }
}

const onUpdateAvatar = async () => {
  loading.value = true
  // 发送请求更新头像
  await userUpdateAvatarService(imageUrl.value)
  // 更新 Pinia 仓库中的用户信息
  await userStore.getUser()
  // 提示用户更新成功
  ElMessage.success('头像更新成功')
  loading.value = false
}
</script>

<template>
  <page-container title="更换头像">
    <el-upload
      ref="uploadRef"
      :auto-upload="false"
      class="avatar-uploader"
      :show-file-list="false"
      :on-change="onSelectFile"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>

    <br />

    <!-- `$el`	指向组件的根 DOM 元素
    uploadRef 引用的是组件实例，不是 DOM 元素
     组件实例没有原生的 click() 方法
     所以不能使用uploadRef.click() -->
    <el-button
      type="primary"
      @click="uploadRef.$el.querySelector('input').click()"
      :icon="Plus"
      size="large"
      >选择图片</el-button
    >
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <el-button
      type="success"
      @click="onUpdateAvatar"
      :icon="Upload"
      size="large"
      :loading="loading"
      >上传头像</el-button
    >
  </page-container>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 278px;
      height: 278px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 278px;
      height: 278px;
      text-align: center;
    }
  }
}
</style>
