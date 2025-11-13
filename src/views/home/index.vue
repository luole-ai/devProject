<template>
  <div class="home-container">
    <h2>首页</h2>
    <p>登录成功，欢迎进入首页。</p>
  </div>
</template>

<script>
import { pageComplaint } from '@/api/serviceApply'
export default {
  name: 'LayoutHome',
  setup() {
    pageComplaint({
      applyServiceType: 0,
      applyStatus: 0,
      current: 0,
      endTime: '',
      likeStr: '',
      oneselfFlag: true,
      size: 0,
      startTime: ''
    }).then(res => {
      console.log(res)
    })
  }
}
</script>

<style scoped>
.home-container {
  padding: 24px;
}

h2 {
  margin: 0 0 12px;
}
</style>


