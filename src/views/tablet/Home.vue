<template>
  <div class="tablet-home">
    <van-nav-bar title="平板端" />
    
    <div class="content">
      <div class="sidebar">
        <van-button type="primary" block>菜单1</van-button>
        <van-button type="primary" block>菜单2</van-button>
        <van-button type="primary" block>菜单3</van-button>
      </div>
      
      <div class="main-content">
        <h1>平板端首页</h1>
        <van-button type="primary">平板端按钮</van-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TabletHome'
}
</script>

<style scoped>
.tablet-home {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  display: flex;
}

.sidebar {
  width: 200px;
  padding: 20px;
  background-color: #f7f8fa;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.main-content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style> 