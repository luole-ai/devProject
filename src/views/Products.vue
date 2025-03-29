<template>
  <div class="products-page">
    <!-- 移动端布局 -->
    <template v-if="isMobile">
      <van-nav-bar title="产品展示" left-arrow @click-left="goBack" />
      
      <div class="content mobile-content">
        <h1>产品展示</h1>
        <p>这是产品页面的移动端版本</p>
        <van-button type="primary" @click="goBack">返回首页</van-button>
      </div>
      
      <van-tabbar v-model="activeTab">
        <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
        <van-tabbar-item icon="search">产品</van-tabbar-item>
        <van-tabbar-item icon="friends-o">关于</van-tabbar-item>
        <van-tabbar-item icon="setting-o">联系</van-tabbar-item>
      </van-tabbar>
    </template>
    
    <!-- 平板端和桌面端布局可以类似 Home.vue 实现 -->
    <template v-else>
      <h1>产品展示</h1>
      <p>这是产品页面的平板/桌面端版本</p>
      <van-button type="primary" @click="goBack">返回首页</van-button>
    </template>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDeviceInfo } from '../utils/device'

export default {
  name: 'ProductsPage',
  setup() {
    const router = useRouter()
    const activeTab = ref(1) // 产品页面对应的标签索引
    const { isMobile } = useDeviceInfo()
    
    const goBack = () => {
      router.push('/')
    }
    
    return {
      activeTab,
      isMobile,
      goBack
    }
  }
}
</script>

<style scoped>
.products-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.mobile-content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
}
</style> 