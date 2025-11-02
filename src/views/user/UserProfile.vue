<script setup>
import { ref } from 'vue'
// import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores'
import { userUpdateInfoService } from '@/api/user'

const {
  user: { username, nickname, email, id },
  getUser
} = useUserStore()

const formModel = ref({
  username,
  nickname,
  email,
  id
})

const rules = {
  nickname: [
    { required: true, message: '用户昵称不能为空', trigger: 'blur' },
    { min: 2, max: 10, message: '昵称长度应为2-10个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '邮箱不能为空', trigger: 'blur' },
    {
      type: 'email',
      message: '请输入有效的邮箱地址',
      trigger: ['blur', 'change']
    }
  ]
}

const formRef = ref()
// 通过设置 loading 属性为 true 来显示按钮加载中状态
const loading = ref(false)

const handleSubmit = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      // 这里可以提交数据到后台
      await userUpdateInfoService({
        id: formModel.value.id,
        nickname: formModel.value.nickname,
        email: formModel.value.email
      })
      // 更新用户信息到 Pinia 仓库
      getUser()
      ElMessage.success('修改成功')
      loading.value = false
    } else {
      ElMessage.error('表单验证失败，请检查输入内容')
      return false
    }
  })
}
</script>

<template>
  <page-container title="基本资料">
    <!-- 表单部分 -->
    <el-form
      :model="formModel"
      :rules="rules"
      ref="formRef"
      label-width="120px"
      style="max-width: 700px"
      size="large"
    >
      <!-- 第一行：登录名称，输入框禁用 -->
      <el-form-item label="登录名称" prop="username">
        <el-input v-model="formModel.username" disabled></el-input>
      </el-form-item>

      <!-- 第二行：用户昵称，输入框可输入，且校验 -->
      <el-form-item label="用户昵称" prop="nickname">
        <el-input
          v-model="formModel.nickname"
          placeholder="请输入用户昵称"
        ></el-input>
      </el-form-item>

      <!-- 第三行：用户邮箱，输入框可输入，且校验 -->
      <el-form-item label="用户邮箱" prop="email">
        <el-input
          v-model="formModel.email"
          placeholder="请输入用户邮箱"
        ></el-input>
      </el-form-item>

      <!-- 第四行：提交按钮 -->
      <el-form-item>
        <el-button type="primary" @click="handleSubmit" :loading="loading"
          >提交修改</el-button
        >
      </el-form-item>
    </el-form>
  </page-container>
</template>

<style scoped>
.el-form-item {
  margin-bottom: 20px;
}
</style>
