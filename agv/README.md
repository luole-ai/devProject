# AGV 物流小车监控系统

基于 Vue 3 + TypeScript 开发的物流小车实时监控系统，支持工厂地图显示、小车位置实时更新、轨迹回放等功能。

## 功能特性

- 🏭 **工厂地图显示**：支持自定义平面图，支持缩放、拖拽操作
- 🚗 **小车实时监控**：显示小车位置、状态、电量等信息
- 📍 **点击详情弹窗**：点击小车查看详细信息
- 🎬 **轨迹回放**：支持历史轨迹逐帧回放，可调节回放速度
- 🔄 **实时数据更新**：通过 WebSocket 接收后端实时数据
- 🎨 **美观界面**：基于 Element Plus 的现代化 UI 设计

## 技术栈

- **前端框架**：Vue 3 + TypeScript
- **状态管理**：Pinia
- **地图绘制**：vue-konva (基于 Konva.js)
- **UI 组件**：Element Plus
- **实时通信**：Socket.io-client
- **路由管理**：Vue Router

## 项目结构

```
src/
├── components/
│   ├── FactoryMap.vue      # 工厂地图主组件
│   └── CarTrackReplay.vue  # 轨迹回放组件
├── stores/
│   └── carStore.ts         # 小车状态管理
├── utils/
│   └── websocket.ts        # WebSocket 通信工具
├── router/
│   └── index.ts           # 路由配置
└── App.vue                # 主应用组件
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 使用说明

### 1. 工厂地图

- 使用鼠标滚轮进行缩放
- 按住鼠标左键拖拽地图
- 点击控制面板按钮进行快速缩放操作

### 2. 小车监控

- 地图上显示不同颜色的小车图标
- 绿色：在线状态
- 灰色：离线状态  
- 红色：错误状态

### 3. 小车详情

- 点击小车图标查看详细信息
- 显示小车ID、状态、位置、电量、速度等信息
- 支持查看轨迹历史

### 4. 轨迹回放

- 选择要回放的小车
- 设置回放速度（0.5x - 5x）
- 使用进度条控制回放进度
- 支持播放、暂停、停止操作

## 后端接口

系统通过 WebSocket 与后端通信，主要事件：

- `car_position_update`：小车位置更新
- `car_list_update`：小车列表更新
- `track_history`：历史轨迹数据

### 小车数据结构

```typescript
interface Car {
  id: string           // 小车ID
  x: number           // X坐标
  y: number           // Y坐标
  status: 'online' | 'offline' | 'error'  // 状态
  battery: number     // 电量百分比
  speed: number       // 速度 (m/s)
  direction: number   // 方向角度
  lastUpdate: Date    // 最后更新时间
}
```

## 配置说明

### 工厂地图

将工厂平面图文件放置到 `public/factory-map.png`，系统会自动加载。

### WebSocket 连接

默认连接到 `ws://localhost:3000`，可在 `src/utils/websocket.ts` 中修改连接地址。

## 开发说明

### 添加新功能

1. 在 `src/stores/carStore.ts` 中添加新的状态和方法
2. 在 `src/components/FactoryMap.vue` 中添加对应的 UI 组件
3. 在 `src/utils/websocket.ts` 中添加新的 WebSocket 事件处理

### 自定义样式

- 小车颜色：修改 `getCarStatusColor` 和 `getCarColor` 函数
- 地图样式：修改 CSS 样式或更换地图图片
- UI 主题：通过 Element Plus 主题配置

## 注意事项

1. 确保工厂地图图片路径正确
2. 后端需要实现对应的 WebSocket 事件
3. 小车坐标需要与地图坐标系一致
4. 建议使用现代浏览器以获得最佳体验

## 许可证

MIT License
