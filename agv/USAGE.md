# AGV 物流小车监控系统 - 使用说明

## 🚀 快速启动

### 方式一：同时启动前端和后端（推荐）

```bash
npm run start
```

这将同时启动：
- 前端服务：http://localhost:5173
- 后端服务：http://localhost:3000

### 方式二：分别启动

#### 启动后端服务
```bash
npm run server
```

#### 启动前端服务
```bash
npm run dev
```

## 📋 服务地址

- **前端应用**: http://localhost:5173
- **后端 API**: http://localhost:3000
- **WebSocket**: ws://localhost:3000
- **健康检查**: http://localhost:3000/health

## 🔧 API 接口

### REST API
- `GET /api/cars` - 获取小车列表
- `GET /api/cars/:id/track` - 获取小车轨迹

### WebSocket 事件
- `car_position_update` - 小车位置更新
- `car_list_update` - 小车列表更新
- `track_history` - 轨迹历史数据

## 🎮 功能演示

### 1. 地图操作
- **缩放**: 使用鼠标滚轮或控制面板按钮
- **拖拽**: 按住鼠标左键拖拽地图
- **重置**: 点击"重置"按钮恢复默认视图

### 2. 小车监控
- **实时位置**: 小车在地图上实时显示位置
- **状态颜色**: 
  - 🟢 绿色：在线
  - ⚪ 灰色：离线
  - 🔴 红色：错误
- **点击详情**: 点击小车查看详细信息

### 3. 模拟数据
系统包含 3 辆模拟小车：
- **AGV001**: 在线状态，随机移动
- **AGV002**: 在线状态，随机移动
- **AGV003**: 离线状态，静止不动

### 4. 实时更新
- 小车位置每 2 秒更新一次
- 小车状态每 10 秒有 10% 概率变化
- 电量随时间缓慢减少

## 🛠️ 开发说明

### 前端技术栈
- Vue 3 + TypeScript
- vue-konva (地图绘制)
- Pinia (状态管理)
- Element Plus (UI 组件)
- Socket.io-client (实时通信)

### 后端技术栈
- Node.js + Express
- Socket.io (WebSocket)
- CORS (跨域支持)

### 项目结构
```
agv-monitor/
├── src/                    # 前端源码
│   ├── components/         # 组件
│   ├── stores/            # 状态管理
│   ├── utils/             # 工具函数
│   └── router/            # 路由配置
├── server.js              # 后端服务
├── package.json           # 项目配置
└── README.md             # 项目说明
```

## 🔍 故障排除

### 1. 端口冲突
如果端口被占用，可以修改：
- 前端端口：修改 `vite.config.ts`
- 后端端口：修改 `server.js` 中的 `PORT` 变量

### 2. WebSocket 连接失败
- 确保后端服务正在运行
- 检查防火墙设置
- 确认端口 3000 未被占用

### 3. 前端无法访问
- 确保前端服务正在运行
- 检查浏览器控制台错误
- 确认端口 5173 未被占用

## 📝 自定义配置

### 修改小车数据
编辑 `server.js` 中的 `cars` 数组：

```javascript
const cars = [
  {
    id: 'AGV001',
    x: 100,
    y: 100,
    status: 'online',
    battery: 85,
    speed: 2.5,
    direction: 45,
    lastUpdate: new Date()
  }
  // 添加更多小车...
]
```

### 修改更新频率
编辑 `server.js` 中的 `setInterval` 参数：

```javascript
// 位置更新频率（毫秒）
setInterval(() => {
  // 小车移动逻辑
}, 2000) // 2秒

// 状态更新频率（毫秒）
setInterval(() => {
  // 状态变化逻辑
}, 10000) // 10秒
```

### 添加工厂地图
将工厂平面图文件放置到 `public/factory-map.png`，系统会自动加载。

## 🎯 下一步开发

1. **连接真实设备**: 修改 WebSocket 事件处理真实 AGV 数据
2. **数据库集成**: 添加 MongoDB 或 MySQL 存储历史数据
3. **用户认证**: 添加登录和权限管理
4. **告警系统**: 实现异常状态告警
5. **报表功能**: 添加数据统计和报表
6. **移动端**: 开发移动端应用

## 📞 技术支持

如有问题，请检查：
1. Node.js 版本 >= 16
2. 所有依赖已正确安装
3. 端口未被其他程序占用
4. 防火墙设置允许本地连接 