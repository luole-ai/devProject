<template>
  <div class="workspace-page">
    <h2>工作台</h2>
    <p>在这里可以集成常用工具、快捷入口以及流程提醒。</p>
    <input type="text">
  </div>
</template>

<script setup>
defineOptions({
  name: 'LayoutWorkspace'
})
</script>

<style scoped>
.workspace-page {
  padding: 24px;
  background-color: #fff;
  min-height: calc(100vh - 160px);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(31, 41, 55, 0.08);
}

.workspace-page h2 {
  margin-bottom: 12px;
}
</style>

