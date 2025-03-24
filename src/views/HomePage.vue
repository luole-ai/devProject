<template>
  <responsive-layout @device-change="onDeviceChange">
    <!-- 导航栏 -->
    <van-nav-bar
      title="响应式布局示例"
      left-text="返回"
      right-text="菜单"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
    
    <!-- 内容区域 -->
    <div class="content">
      <h2>当前设备类型: {{ deviceType }}</h2>
      
      <!-- 卡片列表 - 根据设备类型调整列数 -->
      <van-grid :column-num="gridColumns" :gutter="10">
        <van-grid-item v-for="i in 6" :key="i">
          <div class="card">
            <van-image
              width="100%"
              height="120"
              :src="`https://picsum.photos/200/120?random=${i}`"
            />
            <div class="card-content">
              <h3>卡片标题 {{ i }}</h3>
              <p>这是卡片的描述内容，根据设备类型会有不同的展示效果。</p>
              <van-button type="primary" size="small">查看详情</van-button>
            </div>
          </div>
        </van-grid-item>
      </van-grid>
    </div>
    
    <!-- 底部标签栏 - 在移动端显示，其他设备隐藏 -->
    <van-tabbar v-if="deviceType === 'mobile'" v-model="active">
      <van-tabbar-item icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item icon="search">搜索</van-tabbar-item>
      <van-tabbar-item icon="friends-o">好友</van-tabbar-item>
      <van-tabbar-item icon="setting-o">设置</van-tabbar-item>
    </van-tabbar>
    
    <!-- 在平板和电脑端显示的侧边菜单 -->
    <div v-if="deviceType !== 'mobile'" class="sidebar">
      <van-cell-group>
        <van-cell title="首页" icon="home-o" is-link />
        <van-cell title="搜索" icon="search" is-link />
        <van-cell title="好友" icon="friends-o" is-link />
        <van-cell title="设置" icon="setting-o" is-link />
      </van-cell-group>
    </div>
  </responsive-layout>
</template>

<script>
import ResponsiveLayout from '@/components/ResponsiveLayout.vue';

export default {
  components: {
    ResponsiveLayout
  },
  data() {
    return {
      deviceType: 'mobile',
      active: 0,
      gridColumns: 1
    }
  },
  methods: {
    onDeviceChange(type) {
      this.deviceType = type;
      // 根据设备类型调整网格列数
      if (type === 'mobile') {
        this.gridColumns = 1;
      } else if (type === 'tablet') {
        this.gridColumns = 2;
      } else {
        this.gridColumns = 3;
      }
    },
    onClickLeft() {
      // 返回按钮点击事件
      console.log('返回按钮点击');
    },
    onClickRight() {
      // 菜单按钮点击事件
      console.log('菜单按钮点击');
    }
  }
}
</script>

<style scoped>
.content {
  padding: 15px 0;
}

.card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(100, 101, 102, 0.12);
  height: 100%;
}

.card-content {
  padding: 10px;
}

.card-content h3 {
  margin: 0 0 8px;
  font-size: 16px;
}

.card-content p {
  margin: 0 0 10px;
  font-size: 14px;
  color: #666;
}

/* 侧边栏样式 - 仅在平板和电脑端显示 */
.sidebar {
  position: fixed;
  left: 0;
  top: 46px; /* 导航栏高度 */
  bottom: 0;
  width: 200px;
  background: #fff;
  border-right: 1px solid #eee;
  z-index: 100;
}

/* 平板和电脑端内容区域左侧留出侧边栏空间 */
@media screen and (min-width: 768px) {
  .content {
    margin-left: 200px;
  }
}
</style> 