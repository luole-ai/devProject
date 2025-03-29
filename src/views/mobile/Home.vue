<template>
  <div class="mobile-home">
    <van-nav-bar title="移动端" />
    
    <div class="content">
      <h1>移动端首页</h1>
      <van-button type="primary">移动端按钮</van-button>
    </div>
    
    <van-tabbar v-model="active">
      <van-tabbar-item icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item icon="search">搜索</van-tabbar-item>
      <van-tabbar-item icon="friends-o">好友</van-tabbar-item>
      <van-tabbar-item icon="setting-o">设置</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'MobileHome',
  setup() {
    const active = ref(0)
    
    return {
      active
    }
  }
}
</script>

<style scoped>
.mobile-home {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style> 