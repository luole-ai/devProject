<template>
  <div class="not-found">
    <div class="content">
      <h1>500</h1>
      <h2>服务器错误</h2>
      <p>抱歉，服务器出现了问题</p>
      <el-button type="primary" @click="goHome">返回首页</el-button>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'Page500',
  setup() {
    const router = useRouter()

    const goHome = () => {
      router.push('/')
    }

    return {
      goHome
    }
  }
}
</script>

<style scoped>
.not-found {
  background-color: #f5f7f9;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content {
  text-align: center;
}

h1 {
  font-size: 120px;
  color: #E6A23C;
  line-height: 1;
  margin: 0;
}

h2 {
  font-size: 30px;
  color: #333;
  margin: 15px 0;
}

p {
  font-size: 16px;
  color: #777;
  margin-bottom: 30px;
}
</style> 