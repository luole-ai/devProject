<template>
  <div id="app">
    <router-view />
    <!-- <FloatingBall @menu-item-click="handleMenuItemClick" />
    <HeroBoard3D />
    <CircularMotion /> -->
  </div>
</template>

<script setup>
import FloatingBall from './components/FloatingBall.vue'
import HeroBoard3D from './components/HeroBoard3D.vue'
import CircularMotion from './components/CircularMotion.vue'

const handleMenuItemClick = (action) => {
  switch (action) {
    case 'home':
      // 处理首页点击
      console.log('首页')
      break
    case 'message':
      // 处理消息点击
      console.log('消息')
      break
    case 'settings':
      // 处理设置点击
      console.log('设置')
      break
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: #f7f8fa;
}

#app {
  min-height: 100vh;
  background: #222;
  /* display: flex; */
  align-items: center;
  justify-content: center;
}
</style> 