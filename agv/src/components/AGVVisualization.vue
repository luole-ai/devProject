<template>
  <div class="agv-visualization">
    <div class="factory-container" ref="factoryContainer">
      <!-- 背景图片 -->
      <div class="background-image" :style="backgroundStyle">
        <img src="/bg.png" alt="Factory Background" />
      </div>
      
      <!-- AGV小车容器 -->
      <div class="agv-container" :style="agvContainerStyle">
        <div
          v-for="agv in agvList"
          :key="agv.id"
          class="agv-vehicle"
          :style="getAGVStyle(agv)"
          :class="{ 'agv-active': agv.status === 'active', 'agv-following': followingAGV === agv.id }"
          @click="followAGV(agv.id)"
        >
          <div class="agv-body">
            <div class="agv-direction" :style="{ transform: `rotate(${agv.direction || 0}deg)` }"></div>
          </div>
          <div class="agv-info">
            <span class="agv-id">{{ agv.id }}</span>
            <span class="agv-status">{{ agv.status }}</span>
          </div>
        </div>
      </div>
      
      <!-- 缩放控制面板 -->
      <div class="zoom-controls">
        <button class="zoom-btn" @click="zoomIn" title="放大">
          <span>+</span>
        </button>
        <div class="zoom-level">{{ Math.round(zoom * 100) }}%</div>
        <button class="zoom-btn" @click="zoomOut" title="缩小">
          <span>-</span>
        </button>
        <button class="zoom-btn reset-btn" @click="resetView" title="重置视图">
          <span>⟲</span>
        </button>
      </div>
      
      <!-- 信息面板 -->
      <div class="info-panel">
        <h3>AGV 状态信息</h3>
        <div class="agv-count">在线AGV: {{ agvList.length }}</div>
        <div class="zoom-info">缩放: {{ Math.round(zoom * 100) }}%</div>
        <div v-if="followingAGV" class="following-info">
          跟随AGV: {{ followingAGV }}
          <button class="stop-follow-btn" @click="stopFollowing">停止跟随</button>
        </div>
        <div class="agv-details">
          <div v-for="agv in agvList" :key="agv.id" class="agv-detail">
            <span>AGV-{{ agv.id }}: ({{ agv.x.toFixed(1) }}, {{ agv.y.toFixed(1) }}) - {{ agv.status }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AGVVisualization',
  data() {
    return {
      agvList: [],
      // 坐标缩放参数
      scaleConfig: {
        // 实际工厂尺寸（米）
        factoryWidth: 100,
        factoryHeight: 80,
        // 显示区域尺寸（像素）
        displayWidth: 1200,
        displayHeight: 800,
        // 缩放比例
        scaleX: 1,
        scaleY: 1
      },
      // 视图控制
      zoom: 1,
      minZoom: 0.5,
      maxZoom: 3,
      viewOffsetX: 0,
      viewOffsetY: 0,
      isDragging: false,
      lastMouseX: 0,
      lastMouseY: 0,
      // AGV跟随
      followingAGV: null,
      followInterval: null
    }
  },
  computed: {
    backgroundStyle() {
      return {
        transform: `scale(${this.zoom}) translate(${this.viewOffsetX / this.zoom}px, ${this.viewOffsetY / this.zoom}px)`,
        transformOrigin: '0 0'
      };
    },
    agvContainerStyle() {
      return {
        transform: `scale(${this.zoom}) translate(${this.viewOffsetX / this.zoom}px, ${this.viewOffsetY / this.zoom}px)`,
        transformOrigin: '0 0'
      };
    }
  },
  mounted() {
    this.initScaleConfig();
    this.exposeMethods();
    this.setupEventListeners();
  },
  beforeUnmount() {
    this.cleanupEventListeners();
    this.stopFollowing();
  },
  methods: {
    // 初始化缩放配置
    initScaleConfig() {
      this.scaleConfig.scaleX = this.scaleConfig.displayWidth / this.scaleConfig.factoryWidth;
      this.scaleConfig.scaleY = this.scaleConfig.displayHeight / this.scaleConfig.factoryHeight;
    },
    
    // 设置事件监听器
    setupEventListeners() {
      const container = this.$refs.factoryContainer;
      if (container) {
        container.addEventListener('wheel', this.handleWheel);
        container.addEventListener('mousedown', this.handleMouseDown);
        container.addEventListener('mousemove', this.handleMouseMove);
        container.addEventListener('mouseup', this.handleMouseUp);
        container.addEventListener('mouseleave', this.handleMouseUp);
      }
    },
    
    // 清理事件监听器
    cleanupEventListeners() {
      const container = this.$refs.factoryContainer;
      if (container) {
        container.removeEventListener('wheel', this.handleWheel);
        container.removeEventListener('mousedown', this.handleMouseDown);
        container.removeEventListener('mousemove', this.handleMouseMove);
        container.removeEventListener('mouseup', this.handleMouseUp);
        container.removeEventListener('mouseleave', this.handleMouseUp);
      }
    },
    
    // 处理鼠标滚轮缩放
    handleWheel(event) {
      event.preventDefault();
      const delta = event.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoom * delta));
      
      // 计算缩放中心点
      const rect = event.currentTarget.getBoundingClientRect();
      const centerX = event.clientX - rect.left;
      const centerY = event.clientY - rect.top;
      
      this.zoomAt(centerX, centerY, newZoom);
    },
    
    // 处理鼠标按下
    handleMouseDown(event) {
      if (event.button === 0) { // 左键
        this.isDragging = true;
        this.lastMouseX = event.clientX;
        this.lastMouseY = event.clientY;
        event.currentTarget.style.cursor = 'grabbing';
      }
    },
    
    // 处理鼠标移动
    handleMouseMove(event) {
      if (this.isDragging) {
        const deltaX = event.clientX - this.lastMouseX;
        const deltaY = event.clientY - this.lastMouseY;
        
        this.viewOffsetX += deltaX;
        this.viewOffsetY += deltaY;
        
        this.lastMouseX = event.clientX;
        this.lastMouseY = event.clientY;
      }
    },
    
    // 处理鼠标释放
    handleMouseUp(event) {
      this.isDragging = false;
      if (event.currentTarget) {
        event.currentTarget.style.cursor = 'grab';
      }
    },
    
    // 在指定点缩放
    zoomAt(centerX, centerY, newZoom) {
      const zoomRatio = newZoom / this.zoom;
      
      // 计算新的偏移量，保持缩放中心点不变
      this.viewOffsetX = centerX - (centerX - this.viewOffsetX) * zoomRatio;
      this.viewOffsetY = centerY - (centerY - this.viewOffsetY) * zoomRatio;
      
      this.zoom = newZoom;
    },
    
    // 放大
    zoomIn() {
      const newZoom = Math.min(this.maxZoom, this.zoom * 1.2);
      this.zoomAt(window.innerWidth / 2, window.innerHeight / 2, newZoom);
    },
    
    // 缩小
    zoomOut() {
      const newZoom = Math.max(this.minZoom, this.zoom / 1.2);
      this.zoomAt(window.innerWidth / 2, window.innerHeight / 2, newZoom);
    },
    
    // 重置视图
    resetView() {
      this.zoom = 1;
      this.viewOffsetX = 0;
      this.viewOffsetY = 0;
      this.stopFollowing();
    },
    
    // 跟随AGV
    followAGV(agvId) {
      this.followingAGV = agvId;
      this.startFollowing();
    },
    
    // 开始跟随
    startFollowing() {
      this.stopFollowing(); // 先停止之前的跟随
      
      this.followInterval = setInterval(() => {
        if (this.followingAGV) {
          const agv = this.agvList.find(a => a.id === this.followingAGV);
          if (agv) {
            this.centerOnAGV(agv);
          }
        }
      }, 100); // 每100ms更新一次
    },
    
    // 停止跟随
    stopFollowing() {
      if (this.followInterval) {
        clearInterval(this.followInterval);
        this.followInterval = null;
      }
      this.followingAGV = null;
    },
    
    // 将视图中心对准AGV
    centerOnAGV(agv) {
      const coords = this.transformCoordinates(agv.x, agv.y);
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      this.viewOffsetX = centerX - coords.x * this.zoom;
      this.viewOffsetY = centerY - coords.y * this.zoom;
    },
    
    // 坐标转换：将实际坐标转换为显示坐标
    transformCoordinates(x, y) {
      return {
        x: x * this.scaleConfig.scaleX,
        y: this.scaleConfig.displayHeight - (y * this.scaleConfig.scaleY) // 翻转Y轴
      };
    },
    
    // 获取AGV样式
    getAGVStyle(agv) {
      const coords = this.transformCoordinates(agv.x, agv.y);
      return {
        left: `${coords.x}px`,
        top: `${coords.y}px`,
        transform: `translate(-50%, -50%) rotate(${agv.direction || 0}deg)`
      };
    },
    
    // 更新AGV位置（供Android WebView调用）
    updateAGVPosition(agvData) {
      const { id, x, y, direction, status } = agvData;
      
      // 查找现有AGV
      const existingAGV = this.agvList.find(agv => agv.id === id);
      
      if (existingAGV) {
        // 更新现有AGV
        existingAGV.x = x;
        existingAGV.y = y;
        existingAGV.direction = direction || existingAGV.direction;
        existingAGV.status = status || existingAGV.status;
        existingAGV.timestamp = Date.now();
      } else {
        // 添加新AGV
        this.agvList.push({
          id,
          x,
          y,
          direction: direction || 0,
          status: status || 'active',
          timestamp: Date.now()
        });
      }
    },
    
    // 移除AGV（供Android WebView调用）
    removeAGV(agvId) {
      const index = this.agvList.findIndex(agv => agv.id === agvId);
      if (index !== -1) {
        this.agvList.splice(index, 1);
        // 如果被移除的AGV正在被跟随，停止跟随
        if (this.followingAGV === agvId) {
          this.stopFollowing();
        }
      }
    },
    
    // 批量更新AGV数据（供Android WebView调用）
    updateAGVList(agvDataList) {
      this.agvList = agvDataList.map(agv => ({
        ...agv,
        timestamp: Date.now()
      }));
    },
    
    // 清除所有AGV（供Android WebView调用）
    clearAllAGV() {
      this.agvList = [];
      this.stopFollowing();
    },
    
    // 设置缩放配置（供Android WebView调用）
    setScaleConfig(config) {
      this.scaleConfig = { ...this.scaleConfig, ...config };
      this.initScaleConfig();
    },
    
    // 暴露方法给全局作用域，供Android WebView调用
    exposeMethods() {
      window.AGVVisualization = {
        updateAGVPosition: this.updateAGVPosition.bind(this),
        removeAGV: this.removeAGV.bind(this),
        updateAGVList: this.updateAGVList.bind(this),
        clearAllAGV: this.clearAllAGV.bind(this),
        setScaleConfig: this.setScaleConfig.bind(this),
        // 新增的视图控制方法
        zoomIn: this.zoomIn.bind(this),
        zoomOut: this.zoomOut.bind(this),
        resetView: this.resetView.bind(this),
        followAGV: this.followAGV.bind(this),
        stopFollowing: this.stopFollowing.bind(this)
      };
    }
  }
}
</script>

<style scoped>
.agv-visualization {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.factory-container {
  width: 100%;
  height: 100%;
  position: relative;
  background: #f0f0f0;
  cursor: grab;
  user-select: none;
}

.factory-container:active {
  cursor: grabbing;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  transition: transform 0.1s ease;
}

.background-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.agv-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  pointer-events: none;
  transition: transform 0.1s ease;
}

.agv-vehicle {
  position: absolute;
  width: 40px;
  height: 40px;
  transition: all 0.3s ease;
  pointer-events: auto;
  cursor: pointer;
}

.agv-vehicle:hover {
  transform: scale(1.1);
}

.agv-body {
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #2196F3, #21CBF3);
  border-radius: 50%;
  border: 3px solid #fff;
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.agv-direction {
  width: 8px;
  height: 20px;
  background: #fff;
  border-radius: 4px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: transform 0.3s ease;
}

.agv-active .agv-body {
  background: linear-gradient(45deg, #4CAF50, #8BC34A);
  animation: pulse 2s infinite;
}

.agv-following .agv-body {
  background: linear-gradient(45deg, #FF9800, #FFC107);
  border: 3px solid #FF5722;
  animation: following-pulse 1s infinite;
}

.agv-info {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.agv-vehicle:hover .agv-info {
  opacity: 1;
}

.agv-id {
  font-weight: bold;
  margin-right: 4px;
}

.agv-status {
  color: #4CAF50;
}

/* 缩放控制面板 */
.zoom-controls {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(255,255,255,0.95);
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 30;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.zoom-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: #2196F3;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;
}

.zoom-btn:hover {
  background: #1976D2;
}

.reset-btn {
  background: #757575;
}

.reset-btn:hover {
  background: #616161;
}

.zoom-level {
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  color: #333;
  padding: 5px 0;
}

.info-panel {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255,255,255,0.95);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 20;
  max-width: 300px;
  max-height: 400px;
  overflow-y: auto;
}

.info-panel h3 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 16px;
}

.agv-count {
  font-weight: bold;
  color: #2196F3;
  margin-bottom: 10px;
}

.zoom-info {
  font-weight: bold;
  color: #FF9800;
  margin-bottom: 10px;
}

.following-info {
  background: #FFF3E0;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 10px;
  border-left: 4px solid #FF9800;
}

.stop-follow-btn {
  background: #FF5722;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 10px;
  margin-left: 10px;
}

.stop-follow-btn:hover {
  background: #D32F2F;
}

.agv-details {
  font-size: 12px;
}

.agv-detail {
  margin-bottom: 5px;
  padding: 4px 0;
  border-bottom: 1px solid #eee;
}

@keyframes pulse {
  0% {
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  }
  50% {
    box-shadow: 0 4px 16px rgba(76, 175, 80, 0.6);
  }
  100% {
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  }
}

@keyframes following-pulse {
  0% {
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  }
  50% {
    box-shadow: 0 4px 16px rgba(255, 87, 34, 0.6);
  }
  100% {
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .info-panel {
    top: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
  }
  
  .zoom-controls {
    top: 10px;
    left: 10px;
  }
  
  .agv-vehicle {
    width: 30px;
    height: 30px;
  }
  
  .agv-direction {
    width: 6px;
    height: 15px;
  }
}
</style>
