<template>
  <responsive-layout @device-change="onDeviceChange">
    <!-- 导航栏 -->
    <van-nav-bar
      title="响应式相机应用"
      left-text="返回"
      right-text="菜单"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
    
    <div class="content-wrapper">
      <!-- 在平板和电脑端显示的侧边菜单 -->
      <div v-if="deviceType !== 'mobile'" class="sidebar">
        <el-menu default-active="1">
          <el-menu-item index="1">
            <el-icon><icon-camera /></el-icon>
            <span>相机</span>
          </el-menu-item>
          <el-menu-item index="2">
            <el-icon><icon-picture /></el-icon>
            <span>相册</span>
          </el-menu-item>
          <el-menu-item index="3">
            <el-icon><icon-setting /></el-icon>
            <span>设置</span>
          </el-menu-item>
        </el-menu>
      </div>
      
      <!-- 内容区域 -->
      <div class="content" :class="{ 'with-sidebar': deviceType !== 'mobile' }">
        <h2>当前设备类型: {{ deviceType }}</h2>
        
        <!-- 使用Element Plus的响应式栅格 -->
        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="24" :lg="16" :xl="16">
            <el-card class="camera-card">
              <template #header>
                <div class="card-header">
                  <span>相机预览</span>
                </div>
              </template>
              <camera-component></camera-component>
            </el-card>
          </el-col>
          
          <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
            <el-card>
              <template #header>
                <div class="card-header">
                  <span>相机说明</span>
                </div>
              </template>
              <div>
                <p>这是一个响应式的相机应用，支持不同设备：</p>
                <ul>
                  <li>手机：单列布局，底部有导航栏</li>
                  <li>平板：优化布局，左侧有菜单</li>
                  <li>电脑：多列布局，更宽敞的显示区域</li>
                </ul>
                <p>点击"打开相机"启动摄像头，点击"拍照"捕获图像。</p>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
    
    <!-- 底部标签栏 - 在移动端显示，其他设备隐藏 -->
    <van-tabbar v-if="deviceType === 'mobile'" v-model="active">
      <van-tabbar-item icon="photograph">相机</van-tabbar-item>
      <van-tabbar-item icon="photo-o">相册</van-tabbar-item>
      <van-tabbar-item icon="setting-o">设置</van-tabbar-item>
    </van-tabbar>
  </responsive-layout>
</template>

<script>
import ResponsiveLayout from '@/components/ResponsiveLayout.vue';
import CameraComponent from '@/components/CameraComponent.vue';

export default {
  components: {
    ResponsiveLayout,
    CameraComponent
  },
  data() {
    return {
      deviceType: 'mobile',
      active: 0
    }
  },
  methods: {
    onDeviceChange(type) {
      this.deviceType = type;
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
.content-wrapper {
  display: flex;
  position: relative;
  min-height: calc(100vh - 46px - 50px); /* 减去导航栏和底部栏的高度 */
}

.content {
  padding: 15px;
  width: 100%;
}

.content.with-sidebar {
  margin-left: 200px;
}

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

.camera-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@media screen and (max-width: 767px) {
  .content {
    padding: 10px;
  }
}

/* 在移动设备上，底部留出tabbar的空间 */
@media screen and (max-width: 767px) {
  .content-wrapper {
    padding-bottom: 50px;
  }
}
</style>