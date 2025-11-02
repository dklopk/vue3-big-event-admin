<script setup>
import { Edit, Delete } from '@element-plus/icons-vue'
import { ref } from 'vue'
import ChannelSelect from './components/ChannelSelect.vue'
import { artDelService, artGetListService } from '@/api/article'
import { formatTime } from '@/utils/format'
import ArticleEdit from './components/ArticleEdit.vue'
import ArticleDetail from './components/ArticleDetail.vue'
// import { ElMessage } from 'element-plus'
// import { ElMessageBox } from 'element-plus'

// 定义请求参数对象
const params = ref({
  pagenum: 1, // 当前页
  pagesize: 5, // 当前生效的每页条数
  cate_id: '',
  state: ''
})

const articleList = ref([]) // 文章列表
const total = ref(0) // 总条数

// 引用文章预览组件
const articleDetailRef = ref()

const loading = ref(false) // loading状态

// 基于params参数，获取文章列表
const getArticleList = async () => {
  loading.value = true
  const res = await artGetListService(params.value)
  articleList.value = res.data.data
  total.value = res.data.total
  // console.log(articleList.value, total.value)
  loading.value = false
}

getArticleList()

// 假数据
// const articleList = ref([
//   {
//     id: 1111,
//     title: '新的文章啊',
//     pub_date: '2022-07-10 14:52:53.604',
//     state: '已发布',
//     cate_name: '体育'
//   },
//   {
//     id: 2222,
//     title: '旧的文章啊',
//     pub_date: '2022-04-11 14:52:51.304',
//     state: null,
//     cate_name: '体育'
//   }
// ])

// 处理分页逻辑
const onSizeChange = (size) => {
  // 只要是每页条数变化了，那么原本正在访问的当前页意义不大了，数据大概率已经不在原来那一页了
  // 重新从第一页渲染即可
  params.value.pagenum = 1
  params.value.pagesize = size
  // 基于最新的当前页 和 每页条数，渲染数据
  getArticleList()
}
const onCurrentChange = (page) => {
  // 更新当前页
  params.value.pagenum = page
  // 基于最新的当前页，渲染数据
  getArticleList()
}

// 搜索逻辑 => 按照最新的条件，重新检索，从第一页开始展示
const onSearch = () => {
  params.value.pagenum = 1 // 重置页面
  getArticleList()
}
// 重置逻辑 => 将筛选条件清空，重新检索，从第一页开始展示
const onReset = () => {
  params.value.pagenum = 1 // 重置页面
  params.value.cate_id = ''
  params.value.state = ''
  getArticleList()
}

const articleEditRef = ref()
// 添加逻辑
const onAddArticle = () => {
  articleEditRef.value.open({})
}

// 编辑逻辑
const onEditArticle = (row) => {
  articleEditRef.value.open(row)
  // console.log(row)
}

// 删除逻辑
// const onDeleteArticle = async (row) => {
//   // console.log(row)
//   // 提示用户是否要删除
//   await ElMessageBox.confirm('你确认删除该文章信息吗？', '温馨提示', {
//     type: 'warning',
//     confirmButtonText: '确认',
//     cancelButtonText: '取消'
//   })
//   await artDelService(row.id)
//   ElMessage({ type: 'success', message: '删除成功' })
//   // 重新渲染列表
//   await getArticleList()
// }

// 删除逻辑
const onDeleteArticle = async (row) => {
  try {
    // console.log('删除文章:', row)

    // 确认对话框
    await ElMessageBox.confirm('你确认删除该文章信息吗？', '温馨提示', {
      type: 'warning',
      confirmButtonText: '确认',
      cancelButtonText: '取消'
    })

    // 执行删除
    await artDelService(row.id)

    // 成功提示
    ElMessage({
      type: 'success',
      message: '删除成功'
    })

    // 刷新列表
    await getArticleList()
  } catch (error) {
    // 处理用户取消操作
    if (error === 'cancel' || error?.action === 'cancel') {
      console.log('用户取消了删除操作')
      return // 正常取消，不需要提示
    }

    // 处理网络错误或其他错误
    console.error('删除文章失败:', error)
    ElMessage({
      type: 'error',
      message: `删除失败: ${error.message || '请稍后重试'}`
    })
  }
}

// 添加或者编辑 成功的回调
const onSuccess = (type) => {
  if (type === 'add') {
    // 如果是添加，需要跳转渲染最后一页，编辑直接渲染当前页
    const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)
    // 更新成最大页码数，再渲染
    params.value.pagenum = lastPage
  }
  getArticleList()
}
</script>

<template>
  <!-- 页面中直接使用测试 page-container ( unplugin-vue-components 会自动注册) -->
  <page-container title="文章管理">
    <template #extra>
      <el-button type="primary" @click="onAddArticle"> 发布文章 </el-button>
    </template>

    <!-- 表单区域 -->
    <el-form inline>
      <el-form-item label="文章分类：">
        <!-- Vue2 => v-model :value 和 @input 的简写 -->
        <!-- Vue3 => v-model :modelValue 和 @update:modelValue 的简写 -->
        <!-- <ChannelSelect></ChannelSelect> -->
        <channel-select v-model="params.cate_id" width="200px"></channel-select>
        <!-- <el-select style="width: 200px">
          <el-option label="数学" value="111"></el-option>
          <el-option label="语文" value="222"></el-option>
        </el-select> -->
      </el-form-item>
      <el-form-item label="发布状态：">
        <!-- 这里后台标记发布状态，就是通过中文标记的，已发布 / 草稿 -->
        <el-select v-model="params.state" style="width: 200px">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="articleList" style="width: 100%" v-loading="loading">
      <el-table-column label="文章标题" width="400">
        <template #default="{ row }">
          <!-- el-link点击标题后打开预览： -->
          <el-link
            type="primary"
            underline="never"
            @click="articleDetailRef.open(row)"
            >{{ row.title }}</el-link
          >
          <!-- <el-link type="primary" underline="never">{{ row.title }}</el-link> -->
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="cate_name"></el-table-column>
      <el-table-column label="发表时间" prop="pub_date">
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <!-- 利用作用域插槽 row 可以获取当前行的数据 => v-for 遍历 item -->
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="onEditArticle(row)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="onDeleteArticle(row)"
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
    </el-table>

    <!-- 分页区域 -->
    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2, 3, 4, 5, 10]"
      layout="jumper, total, sizes, prev, pager, next"
      background
      :total="total"
      style="margin-top: 20px; justify-content: flex-end"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
    />

    <!-- 弹窗 --><!-- 添加编辑的抽屉 -->
    <article-edit ref="articleEditRef" @success="onSuccess"></article-edit>

    <!-- 文章预览的抽屉 -->
    <article-detail ref="articleDetailRef"></article-detail>
  </page-container>
</template>
