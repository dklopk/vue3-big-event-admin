<script setup>
import { artGetDetailService } from '@/api/article'
import { ref } from 'vue'
// 时间格式化工具
import { formatTime } from '@/utils/format'
import { baseURL } from '@/utils/request'
// 控制抽屉显示隐藏
const visibleDrawer = ref(false)

// 存放文章详细数据
const articleDetail = ref({})

const open = async (row) => {
  visibleDrawer.value = true
  // 这里可以基于 row.id 发请求，获取文章的详细内容
  const res = await artGetDetailService(row.id)
  articleDetail.value = res.data.data
  console.log(articleDetail.value)
}

defineExpose({
  open
})
</script>

<template>
  <!-- 抽屉 -->
  <el-drawer
    title="文章预览"
    v-model="visibleDrawer"
    direction="rtl"
    size="50%"
  >
    <!-- 这里展示文章的详细内容 -->
    <h2>{{ articleDetail.title }}</h2>
    <p>作者：{{ articleDetail.nickname }}</p>
    <p>发布时间：{{ formatTime(articleDetail.pub_date) }}</p>
    <!-- 文章分类 -->
    <p>分类：{{ articleDetail.cate_name }}</p>
    <!-- 文章状态 -->
    <p>状态：{{ articleDetail.state }}</p>
    <!-- 文章封面 -->
    <div v-if="articleDetail.cover_img">
      <p>封面：</p>
      <img
        :src="baseURL + articleDetail.cover_img"
        alt="封面图片"
        style="max-width: 100%"
      />
    </div>
    <!-- 文章内容 -->
    <div v-html="articleDetail.content"></div>
  </el-drawer>
</template>
