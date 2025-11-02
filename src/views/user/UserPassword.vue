<script setup>
import { ref } from 'vue'
// import { ElMessage } from 'element-plus'
import { userUpdatePasswordService } from '@/api/user'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

// 表单数据
const pwdForm = ref({
  old_pwd: '',
  new_pwd: '',
  re_pwd: ''
})

// 表单引用
const formRef = ref()

// 自定义校验函数
const validateOldPwd = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入原密码'))
  } else if (value.length < 6 || value.length > 15) {
    callback(new Error('密码长度需为6-15位'))
  } else if (value === pwdForm.value.new_pwd) {
    callback(new Error('新密码不能与原密码相同'))
  } else {
    callback()
  }
}

const validateNewPwd = (rule, value, callback) => {
  if (!value) {
    // value 是输入框的值, callback 是回调函数
    callback(new Error('请输入新密码'))
  } else if (value.length < 6 || value.length > 15) {
    callback(new Error('密码长度需为6-15位'))
  } else if (value === pwdForm.value.old_pwd) {
    callback(new Error('新密码不能与原密码相同'))
  } else {
    callback()
  }
}

const validateRePwd = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请确认新密码'))
  } else if (value.length < 6 || value.length > 15) {
    callback(new Error('密码长度需为6-15位'))
  } else if (value !== pwdForm.value.new_pwd) {
    callback(new Error('两次输入的新密码不一致'))
  } else {
    callback()
  }
}

// 校验规则
const rules = {
  old_pwd: [{ validator: validateOldPwd, trigger: 'blur' }],
  new_pwd: [{ validator: validateNewPwd, trigger: 'blur' }],
  re_pwd: [{ validator: validateRePwd, trigger: 'blur' }]
}

// 提交函数
const handleSubmit = async () => {
  await formRef.value.validate(async (valid) => {
    if (valid) {
      // 这里可以发送请求给后端 API
      await userUpdatePasswordService(pwdForm.value)
      // valid 为 true 表示校验通过
      ElMessage.success('密码修改成功')

      // 密码修改成功后，退出重新登录
      // 清空本地存储的 token 和 个人信息
      userStore.setToken('') // 清空 Pinia 仓库中的 token
      userStore.setUser({}) // 清空 Pinia 仓库中的用户信息
      // 跳转到登录页面
      router.push('/login')
    } else {
      ElMessage.error('请检查输入内容')
    }
  })
}

// 重置函数
const handleReset = () => {
  // 通过调用表单的 resetFields 方法来重置表单
  formRef.value.resetFields()
}
</script>

<template>
  <page-container title="重置密码">
    <el-form
      :model="pwdForm"
      :rules="rules"
      ref="formRef"
      label-width="100px"
      status-icon
      style="max-width: 700px"
      size="large"
    >
      <!-- 第一行：原密码 -->
      <el-form-item label="原密码" prop="old_pwd">
        <el-input
          v-model="pwdForm.old_pwd"
          type="password"
          placeholder="请输入原密码"
          show-password
        />
      </el-form-item>

      <!-- 第二行：新密码 -->
      <el-form-item label="新密码" prop="new_pwd">
        <el-input
          v-model="pwdForm.new_pwd"
          type="password"
          placeholder="请输入新密码"
          show-password
        />
      </el-form-item>

      <!-- 第三行：确认密码 -->
      <el-form-item label="确认密码" prop="re_pwd">
        <el-input
          v-model="pwdForm.re_pwd"
          type="password"
          placeholder="请再次输入新密码"
          show-password
        />
      </el-form-item>

      <!-- 第四行：两个按钮 -->
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">修改密码</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
  </page-container>
</template>

<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 20px;
}
</style>
