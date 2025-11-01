<script setup>
import { ref, nextTick } from 'vue'
import ChannelSelect from './ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
// pnpm add @vueup/vue-quill@latest 安装富文本编辑器 [ vue-quill ] 官网 https://vueup.github.io/vue-quill/
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import {
  artEditService,
  artGetDetailService,
  artPublishService
} from '@/api/article'
// import { ElMessage } from 'element-plus'
import { baseURL } from '@/utils/request'
import axios from 'axios'

// 控制抽屉显示隐藏
const visibleDrawer = ref(false)

// 默认数据
const defaultForm = {
  title: '', // 标题
  cate_id: '', // 分类id
  cover_img: '', // 封面图片 file 对象
  content: '', // string 内容
  state: '' // 状态
}

// 准备数据
const formModel = ref({ ...defaultForm })

// 表单数据验证
const rules = {
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { max: 10, message: '标题最多不能超过10个字符', trigger: 'blur' }
  ],
  cate_id: [{ required: true, message: '请选择文章分类', trigger: 'change' }],
  cover_img: [{ required: true, message: '请上传封面图片', trigger: 'change' }],
  content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }]
}

// 图片上传相关逻辑
const imageUrl = ref('')
const onUploadFile = (uploadFile) => {
  // console.log(uploadFile.raw)
  // console.log(URL.createObjectURL(uploadFile.raw))
  // URL.createObjectURL() 是一个用于创建对象 URL 的 Web API 方法，它可以将 Blob、File 或 MediaSource 对象转换为一个特殊的 URL 字符串。
  imageUrl.value = URL.createObjectURL(uploadFile.raw) // 预览图片
  // 立刻将图片对象，存入 formModel.value.cover_img 将来用于提交
  formModel.value.cover_img = uploadFile.raw
}

// 发布文章
const emit = defineEmits(['success'])
// const onPublish = async (state) => {
//   await formRef.value.validate()
//   // 将已发布还是草稿状态，存入 formModel
//   formModel.value.state = state

//   // 转换 formData 数据
//   // 注意：当前接口，需要的是 formData 对象
//   // 将普通对象 => 转换成 => formData对象
//   const fd = new FormData()
//   // for...in 用于遍历对象的属性名（键）
//   for (let key in formModel.value) {
//     // fd.append(键, 值) 键值对
//     fd.append(key, formModel.value[key])
//   }

//   // 发请求
//   if (formModel.value.id) {
//     // 编辑操作
//     await artEditService(fd)
//     ElMessage.success('编辑成功')
//     visibleDrawer.value = false
//     emit('success', 'edit')
//   } else {
//     // 添加请求
//     await artPublishService(fd)
//     ElMessage.success('添加成功')
//     visibleDrawer.value = false
//     // 通知到父组件，添加成功了
//     emit('success', 'add')
//   }
// }

const onPublish = async (state) => {
  // 先进行表单验证
  formRef.value.validate(async (valid) => {
    if (valid) {
      // 将已发布还是草稿状态，存入 formModel
      formModel.value.state = state

      // 转换 formData 数据
      const fd = new FormData()
      for (let key in formModel.value) {
        fd.append(key, formModel.value[key])
      }

      try {
        // 发请求
        if (formModel.value.id) {
          // 编辑操作
          await artEditService(fd)
          ElMessage.success('编辑成功')
          visibleDrawer.value = false
          emit('success', 'edit')
        } else {
          // 添加请求
          await artPublishService(fd)
          ElMessage.success('添加成功')
          visibleDrawer.value = false
          // 通知到父组件，添加成功了
          emit('success', 'add')
        }
      } catch (error) {
        console.log(error)
        ElMessage.error('请求失败，请重试')
      }
    } else {
      ElMessage.error('表单验证失败，请检查输入的内容')
    }
  })
}

const formRef = ref()
const editorRef = ref()

// 组件对外暴露一个方法 open，基于open传来的参数，区分添加还是编辑
// open({})  => 表单无需渲染，说明是添加
// open({ id, ..., ... })  => 表单需要渲染，说明是编辑
// open调用后，可以打开抽屉
const open = async (row) => {
  visibleDrawer.value = true
  // console.log(row)

  // 等待 Vue 完成 DOM 更新，否则 editorRef.value.setHTML('') 时编辑器可能还没渲染完成而报错
  await nextTick()

  if (row.id) {
    // console.log('编辑回显')
    // 需要基于 row.id 发送请求，获取编辑对应的详情数据，进行回显
    const res = await artGetDetailService(row.id)
    // console.log(res)
    formModel.value = res.data.data
    // 图片需要单独处理回显
    imageUrl.value = baseURL + formModel.value.cover_img
    // 提交给后台，需要的是 file 格式的，将网络图片，转成 file 格式
    // 网络图片转成 file 对象, 需要转换一下,转换成 file对象，存储起来, 将来便于提交
    // 使用 AI 封装的转换函数
    formModel.value.cover_img = await urlToFile(
      imageUrl.value,
      formModel.value.cover_img
    )
  } else {
    // console.log('添加功能')
    formModel.value = { ...defaultForm } // 基于默认的数据，重置form数据
    // 这里重置了表单的数据，但是图片上传img地址，富文本编辑器内容 => 需要手动重置
    imageUrl.value = ''
    editorRef.value.setHTML('')
  }
}

// 将网络图片地址转换为 File 对象的函数
// chatGPT prompt：封装一个函数，基于 axios 获取网络图片地址，转成 File 对象，请注意：写中文注释
async function urlToFile(imageUrl, fileName) {
  try {
    // 通过 axios 请求获取图片数据，返回类型为 'arraybuffer' 以便处理二进制数据
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' })

    // 获取图片的二进制数据
    const arrayBuffer = response.data

    // 创建一个 Blob 对象，类型为图片的 MIME 类型，默认为 'image/jpeg'
    const blob = new Blob([arrayBuffer], { type: 'image/jpeg' })

    // 将 Blob 对象转换成 File 对象，并指定文件名
    const file = new File([blob], fileName, { type: blob.type })

    // 返回 File 对象
    return file
  } catch (error) {
    console.error('图片转换失败:', error)
    throw error // 如果请求失败，抛出错误
  }
}

defineExpose({
  open
})
</script>

<template>
  <!-- 抽屉 -->
  <el-drawer
    v-model="visibleDrawer"
    :title="formModel.id ? '编辑文章' : '添加文章'"
    direction="rtl"
    size="50%"
  >
    <!-- 发表文章表单 -->
    <el-form
      :model="formModel"
      :rules="rules"
      ref="formRef"
      label-width="100px"
    >
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <channel-select
          v-model="formModel.cate_id"
          width="100%"
        ></channel-select>
      </el-form-item>
      <el-form-item label="文章封面" prop="cover_img">
        <!-- 此处需要关闭 element-plus 的自动上传，不需要配置 action 等参数
             只需要做前端的本地预览图片即可，无需在提交前上传图标
             语法：URL.createObjectURL(...) 创建本地预览的地址，来预览
        -->
        <el-upload
          class="avatar-uploader"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="onUploadFile"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <quill-editor
            theme="snow"
            v-model:content="formModel.content"
            content-type="html"
            ref="editorRef"
          ></quill-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onPublish('已发布')">发布</el-button>
        <el-button type="info" @click="onPublish('草稿')">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    /* :deep()在 Vue 3 的 <style scoped> 中使用的深度选择器
    用于穿透作用域样式，影响子组件的样式 */
    .avatar {
      width: 178px;
      height: 178px;
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
      /* var(--el-*) 是 Element Plus 的设计系统变量  CSS 自定义属性 */
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    /* .ql-editor: Quill 编辑器的内容编辑区域类名 */
    min-height: 200px;
  }
}
</style>
