<script setup>
import { ref } from 'vue'
import { artDelChannelService, artGetChannelsService } from '@/api/article'
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelEdit from './components/ChannelEdit.vue'

const channelList = ref([])

// el-table 表格 loading 效果  定义变量，v-loading绑定
const loading = ref(false)

const dialog = ref()

const getChannelList = async () => {
  // 发送请求前开启，请求结束关闭
  loading.value = true
  const res = await artGetChannelsService()
  channelList.value = res.data.data
  loading.value = false
}

getChannelList()

const onAddChannel = () => {
  dialog.value.open({})
}

const onEditChannel = (row) => {
  dialog.value.open(row)
}

const onSuccess = () => {
  getChannelList()
}

const onDelChannel = async (row) => {
  await ElMessageBox.confirm('你确认要删除该分类么', '温馨提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
  await artDelChannelService(row.id)
  ElMessage.success('删除成功')
  getChannelList()
}
</script>

<template>
  <!-- 页面中直接使用测试 page-container ( unplugin-vue-components 会自动注册) -->
  <page-container title="文章分类">
    <template #extra>
      <el-button type="primary" @click="onAddChannel"> 添加分类 </el-button>
    </template>

    <el-table :data="channelList" style="width: 100%" v-loading="loading">
      <el-table-column label="序号" width="100" type="index" />
      <el-table-column label="分类名称" prop="cate_name" />
      <el-table-column label="分类别名" prop="cate_alias" />
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="onEditChannel(row)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="onDelChannel(row)"
          >
          </el-button>
        </template>
      </el-table-column>

      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
    </el-table>
    <channel-edit ref="dialog" @success="onSuccess"></channel-edit>
  </page-container>
</template>
