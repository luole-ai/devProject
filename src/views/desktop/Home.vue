<template>
  <div class="desktop-home">
    <header class="header">
      <div class="container">
        <h1>桌面端</h1>
        <nav>
          <van-button type="primary">首页</van-button>
          <van-button type="primary">产品</van-button>
          <van-button type="primary">关于</van-button>
          <van-button type="primary">联系我们</van-button>
        </nav>
      </div>
    </header>
    
    <main class="container">
      <div class="sidebar">
        <h3>侧边栏</h3>
        <ul>
          <li><van-button block>菜单项 1</van-button></li>
          <li><van-button block>菜单项 2</van-button></li>
          <li><van-button block>菜单项 3</van-button></li>
        </ul>
      </div>
      
      <div class="content">
        <h2>桌面端首页</h2>
        <p>这是为桌面端优化的内容布局</p>
        <van-button type="primary">桌面端按钮</van-button>
      </div>
    </main>
    
    <footer class="footer">
      <div class="container">
        <p>© 2023 响应式 Vue+Vant 应用</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'DesktopHome'
}
</script>

<style scoped>
.desktop-home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

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

.content {
  flex: 1;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.footer {
  background-color: #f7f8fa;
  padding: 20px 0;
  margin-top: 20px;
}
</style> 