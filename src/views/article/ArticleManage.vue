<template>
  <!-- 页面中直接使用测试 page-container ( unplugin-vue-components 会自动注册) -->
  <page-container title="文章管理">
    <template #extra>
      <el-button type="primary"> 发布文章 </el-button>
    </template>

    主体部分，是表格 + 分页
  </page-container>
</template>
