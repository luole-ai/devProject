<template>
  <div class="reports-page">
    <h2>报表中心</h2>
    <p>这里展示业务报表列表，可以在此处添加图表或统计信息。</p>
  </div>
</template>

<script setup>
defineOptions({
  name: 'LayoutReports'
})
</script>

<style scoped>
.reports-page {
  padding: 24px;
  background-color: #fff;
  min-height: calc(100vh - 160px);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(31, 41, 55, 0.08);
}

.reports-page h2 {
  margin-bottom: 12px;
}
</style>

