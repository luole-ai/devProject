<template>
  <div class="dashboard-container">
    <div class="dashboard-text">欢迎: {{ name }}</div>
    <div class="dashboard-content">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>系统信息</span>
          </div>
        </template>
        <div class="dashboard-info">
          <p>这是系统仪表盘页面，可以展示系统概览、统计数据等内容</p>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'Dashboard',
  setup() {
    const store = useStore()
    const name = computed(() => store.getters.name)

    return {
      name
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}
.dashboard-text {
  font-size: 24px;
  line-height: 46px;
  color: #606266;
  margin-bottom: 20px;
}
.dashboard-content {
  margin-top: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.dashboard-info {
  font-size: 16px;
  color: #606266;
  line-height: 1.5;
}
</style> 