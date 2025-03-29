<template>
  <div class="home-page">
    <!-- 移动端布局 -->
    <template v-if="isMobile">
      <van-nav-bar title="移动端">
        <template #right>
          <theme-toggle />
        </template>
      </van-nav-bar>
      
      <div class="content mobile-content">
        <h1>移动端首页</h1>
        <responsive-card title="移动端卡片">
          <p>这是为移动设备优化的内容</p>
        </responsive-card>
        <van-button type="primary">移动端按钮</van-button>
      </div>
      
      <van-tabbar v-model="activeTab">
        <van-tabbar-item icon="home-o">首页</van-tabbar-item>
        <van-tabbar-item icon="search">产品</van-tabbar-item>
        <van-tabbar-item icon="friends-o">关于</van-tabbar-item>
        <van-tabbar-item icon="setting-o">联系</van-tabbar-item>
      </van-tabbar>
    </template>
    
    <!-- 平板端布局 -->
    <template v-else-if="isTablet">
      <van-nav-bar title="平板端">
        <template #right>
          <theme-toggle />
        </template>
      </van-nav-bar>
      
      <div class="content tablet-content">
        <div class="sidebar">
          <van-button type="primary" block to="/">首页</van-button>
          <van-button type="primary" block>产品</van-button>
          <van-button type="primary" block>关于</van-button>
          <van-button type="primary" block>联系</van-button>
        </div>
        
        <div class="main-content">
          <h1>平板端首页</h1>
          <responsive-card title="平板端卡片">
            <p>这是为平板设备优化的内容</p>
          </responsive-card>
          <van-button type="primary">平板端按钮</van-button>
        </div>
      </div>
    </template>
    
    <!-- 桌面端布局 -->
    <template v-else>
      <header class="header">
        <div class="container">
          <h1>桌面端</h1>
          <div class="header-right">
            <nav>
              <van-button type="primary" to="/">首页</van-button>
              <van-button type="primary">产品</van-button>
              <van-button type="primary">关于</van-button>
              <van-button type="primary">联系我们</van-button>
            </nav>
            <theme-toggle />
          </div>
        </div>
      </header>
      
      <main class="container">
        <div class="sidebar">
          <h3>侧边栏</h3>
          <ul>
            <li><van-button block to="/">首页</van-button></li>
            <li><van-button block>产品</van-button></li>
            <li><van-button block>关于</van-button></li>
          </ul>
        </div>
        
        <div class="content desktop-content">
          <h2>桌面端首页</h2>
          <div class="card-grid">
            <responsive-card title="桌面端卡片 1">
              <p>这是为桌面设备优化的内容</p>
            </responsive-card>
            <responsive-card title="桌面端卡片 2">
              <p>这是为桌面设备优化的内容</p>
            </responsive-card>
            <responsive-card title="桌面端卡片 3">
              <p>这是为桌面设备优化的内容</p>
            </responsive-card>
          </div>
          <van-button type="primary">桌面端按钮</van-button>
        </div>
      </main>
      
      <footer class="footer">
        <div class="container">
          <p>© 2023 响应式 Vue+Vant 应用</p>
        </div>
      </footer>
    </template>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useDeviceInfo } from '../utils/device'
import ResponsiveCard from '../components/ResponsiveCard.vue'
import ThemeToggle from '../components/ThemeToggle.vue'
import { useStore } from 'vuex'

export default {
  name: 'HomePage',
  components: {
    ResponsiveCard,
    ThemeToggle
  },
  setup() {
    const activeTab = ref(0)
    const { isMobile, isTablet, isDesktop, isPortrait, isLandscape } = useDeviceInfo()
    const store = useStore()
    
    onMounted(() => {
      // 初始化主题
      store.dispatch('initTheme')
    })
    
    return {
      activeTab,
      isMobile,
      isTablet,
      isDesktop,
      isPortrait,
      isLandscape
    }
  }
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 移动端样式 */
.mobile-content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

/* 平板端样式 */
.tablet-content {
  flex: 1;
  display: flex;
}

.tablet-content .sidebar {
  width: 200px;
  padding: 20px;
  background-color: #f7f8fa;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tablet-content .main-content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

/* 桌面端样式 */
.header {
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 15px 0;
}

.header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

nav {
  display: flex;
  gap: 10px;
}

main.container {
  flex: 1;
  display: flex;
  padding: 20px 0;
}

.sidebar {
  width: 250px;
  padding-right: 20px;
}

.sidebar ul {
  list-style: none;
  margin-top: 20px;
}

.sidebar li {
  margin-bottom: 10px;
}

.desktop-content {
  flex: 1;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.footer {
  background-color: #f7f8fa;
  padding: 20px 0;
  margin-top: 20px;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

/* 横屏特殊处理 */
@media (orientation: landscape) and (max-width: 767px) {
  .mobile-content {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
  }
}
</style> 