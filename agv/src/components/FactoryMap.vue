<template>
  <div class="factory-map-container">
    <!-- 地图控制面板 -->
    <div class="map-controls">
      <el-button-group>
        <el-button @click="resetZoom" size="small">重置</el-button>
        <el-button @click="zoomIn" size="small">放大</el-button>
        <el-button @click="zoomOut" size="small">缩小</el-button>
      </el-button-group>
      
      <el-button-group>
        <el-button 
          @click="toggleReplay" 
          :type="isReplaying ? 'danger' : 'primary'"
          size="small"
        >
          {{ isReplaying ? '停止回放' : '开始回放' }}
        </el-button>
        <el-select v-model="replaySpeed" @change="setReplaySpeed" size="small" style="width: 100px">
          <el-option label="0.5x" :value="0.5" />
          <el-option label="1x" :value="1" />
          <el-option label="2x" :value="2" />
          <el-option label="5x" :value="5" />
        </el-select>
      </el-button-group>
    </div>

    <!-- 地图画布 -->
    <div class="map-wrapper">
      <v-stage
        ref="stageRef"
        :width="stageWidth"
        :height="stageHeight"
        @wheel="handleWheel"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
      >
        <v-layer ref="backgroundLayer">
          <!-- 工厂地图背景 -->
          <v-image
            v-if="factoryMapImage"
            :image="factoryMapImage"
            :x="backgroundX"
            :y="backgroundY"
            :scale-x="scale"
            :scale-y="scale"
          />
        </v-layer>
        
        <v-layer ref="carsLayer">
          <!-- 小车轨迹线 -->
          <v-line
            v-for="(track, carId) in carTracks"
            :key="`track-${carId}`"
            :points="getTrackScreenPoints(track)"
            :stroke="getCarColor(carId)"
            :stroke-width="2 * scale"
            :opacity="0.6"
          />
          
          <!-- 小车图标 -->
          <v-group
            v-for="car in cars"
            :key="car.id"
            :x="worldToScreen(car.x, car.y).x"
            :y="worldToScreen(car.x, car.y).y"
            @click="showCarDetail(car)"
          >
            <!-- 小车主体 -->
            <v-circle
              :radius="15 * scale"
              :fill="getCarStatusColor(car.status)"
              :stroke="'#333'"
              :stroke-width="2 * scale"
            />
            
            <!-- 小车方向指示器 -->
            <v-line
              :points="[0, 0, 0, -20 * scale]"
              :stroke="'#333'"
              :stroke-width="3 * scale"
              :rotation="car.direction"
            />
            
            <!-- 小车ID标签 -->
            <v-text
              :text="car.id"
              :x="-20 * scale"
              :y="25 * scale"
              :font-size="12 * scale"
              :fill="'#333'"
              :align="'center'"
            />
          </v-group>
        </v-layer>
      </v-stage>
    </div>

    <!-- 小车详情弹窗 -->
    <el-dialog
      v-model="showDetailDialog"
      :title="`小车详情 - ${selectedCar?.id}`"
      width="400px"
    >
      <div v-if="selectedCar" class="car-detail">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="小车ID">{{ selectedCar.id }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(selectedCar.status)">
              {{ getStatusText(selectedCar.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="位置">
            X: {{ selectedCar.x.toFixed(2) }}, Y: {{ selectedCar.y.toFixed(2) }}
          </el-descriptions-item>
          <el-descriptions-item label="电量">
            <el-progress :percentage="selectedCar.battery" />
          </el-descriptions-item>
          <el-descriptions-item label="速度">{{ selectedCar.speed }} m/s</el-descriptions-item>
          <el-descriptions-item label="方向">{{ selectedCar.direction }}°</el-descriptions-item>
          <el-descriptions-item label="最后更新">
            {{ formatTime(selectedCar.lastUpdate) }}
          </el-descriptions-item>
        </el-descriptions>
        
        <div class="car-actions">
          <el-button @click="requestCarTrack(selectedCar.id)" type="primary">
            查看轨迹历史
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useCarStore, type Car } from '../stores/carStore'
import { wsManager } from '../utils/websocket'

// 响应式数据
const stageRef = ref()
const backgroundLayer = ref()
const carsLayer = ref()
const showDetailDialog = ref(false)
const selectedCar = ref<Car | null>(null)

// 地图相关
const stageWidth = ref(1200)
const stageHeight = ref(800)
const scale = ref(0.8)
const backgroundX = ref(100)
const backgroundY = ref(100)
const isDragging = ref(false)
const lastPos = ref({ x: 0, y: 0 })

// 工厂地图图片
const factoryMapImage = ref<HTMLImageElement | null>(null)

// 创建工厂地图背景
function createFactoryBackground() {
  const canvas = document.createElement('canvas')
  canvas.width = 1200
  canvas.height = 800
  const ctx = canvas.getContext('2d')
  if (ctx) {
    // 绘制简单的工厂背景
    ctx.fillStyle = '#f0f0f0'
    ctx.fillRect(0, 0, 1200, 800)
    
    // 绘制网格
    ctx.strokeStyle = '#ddd'
    ctx.lineWidth = 1
    for (let i = 0; i < 1200; i += 50) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, 800)
      ctx.stroke()
    }
    for (let i = 0; i < 800; i += 50) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(1200, i)
      ctx.stroke()
    }
    
    // 添加标题
    ctx.fillStyle = '#333'
    ctx.font = '24px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('工厂地图', 600, 50)
    ctx.font = '16px Arial'
    ctx.fillText('AGV 监控系统', 600, 80)
    
    // 添加一些工厂元素
    ctx.fillStyle = '#666'
    ctx.fillRect(100, 150, 200, 100) // 仓库
    ctx.fillStyle = '#333'
    ctx.font = '12px Arial'
    ctx.fillText('仓库', 200, 200)
    
    ctx.fillStyle = '#666'
    ctx.fillRect(900, 150, 200, 100) // 生产线
    ctx.fillStyle = '#333'
    ctx.fillText('生产线', 1000, 200)
    
    ctx.fillStyle = '#666'
    ctx.fillRect(500, 350, 200, 100) // 装卸区
    ctx.fillStyle = '#333'
    ctx.fillText('装卸区', 600, 400)
    
    // 添加路径标识
    ctx.strokeStyle = '#999'
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    
    // 圆形路径
    ctx.beginPath()
    ctx.arc(600, 400, 100, 0, 2 * Math.PI)
    ctx.stroke()
    
    // 8字形路径
    ctx.beginPath()
    ctx.ellipse(600, 400, 150, 80, 0, 0, 2 * Math.PI)
    ctx.stroke()
    
    // 方形路径
    ctx.beginPath()
    ctx.rect(400, 200, 200, 200)
    ctx.stroke()
    
    ctx.setLineDash([])
  }
  
  // 将 canvas 转换为图片
  const img = new Image()
  img.onload = () => {
    factoryMapImage.value = img
  }
  img.src = canvas.toDataURL()
}

// 使用小车状态管理
const carStore = useCarStore()
const cars = computed(() => carStore.cars)
const isReplaying = computed(() => carStore.isReplaying)
const replaySpeed = computed({
  get: () => carStore.replaySpeed,
  set: (value) => carStore.setReplaySpeed(value)
})

// 计算小车轨迹线
const carTracks = computed(() => {
  const tracks: Record<string, number[]> = {}
  carStore.cars.forEach(car => {
    const track = carStore.getCarTrack(car.id)
    if (track.length > 1) {
      tracks[car.id] = track.reduce((acc, point) => {
        acc.push(point.x, point.y)
        return acc
      }, [] as number[])
    }
  })
  return tracks
})

// 获取小车状态颜色
function getCarStatusColor(status: string): string {
  switch (status) {
    case 'online': return '#67C23A'
    case 'offline': return '#909399'
    case 'error': return '#F56C6C'
    default: return '#909399'
  }
}

// 获取小车轨迹颜色
function getCarColor(carId: string): string {
  const colors = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399']
  const index = carId.charCodeAt(0) % colors.length
  return colors[index]
}

// 获取状态类型
function getStatusType(status: string): string {
  switch (status) {
    case 'online': return 'success'
    case 'offline': return 'info'
    case 'error': return 'danger'
    default: return 'info'
  }
}

// 获取状态文本
function getStatusText(status: string): string {
  switch (status) {
    case 'online': return '在线'
    case 'offline': return '离线'
    case 'error': return '错误'
    default: return '未知'
  }
}

// 格式化时间
function formatTime(date: Date): string {
  return date.toLocaleString('zh-CN')
}

// 地图缩放控制
function zoomIn() {
  scale.value = Math.min(scale.value * 1.2, 5)
}

function zoomOut() {
  scale.value = Math.max(scale.value / 1.2, 0.1)
}

function resetZoom() {
  scale.value = 1
  backgroundX.value = 0
  backgroundY.value = 0
}

// 鼠标事件处理
function handleWheel(e: any) {
  e.evt.preventDefault()
  const stage = e.target.getStage()
  const oldScale = scale.value
  
  const pointer = stage.getPointerPosition()
  const mousePointTo = {
    x: (pointer.x - backgroundX.value) / oldScale,
    y: (pointer.y - backgroundY.value) / oldScale
  }
  
  const newScale = e.evt.deltaY > 0 ? oldScale / 1.1 : oldScale * 1.1
  scale.value = Math.max(0.1, Math.min(5, newScale))
  
  const newPos = {
    x: pointer.x - mousePointTo.x * scale.value,
    y: pointer.y - mousePointTo.y * scale.value
  }
  
  backgroundX.value = newPos.x
  backgroundY.value = newPos.y
}

function handleMouseDown(e: any) {
  // 只有在背景层上才允许拖拽
  if (e.target === e.target.getStage() || e.target.getParent() === backgroundLayer.value) {
    isDragging.value = true
    lastPos.value = e.target.getStage().getPointerPosition()
  }
}

function handleMouseMove(e: any) {
  if (!isDragging.value) return
  
  const stage = e.target.getStage()
  const pos = stage.getPointerPosition()
  const dx = pos.x - lastPos.value.x
  const dy = pos.y - lastPos.value.y
  
  backgroundX.value += dx
  backgroundY.value += dy
  
  lastPos.value = pos
}

function handleMouseUp() {
  isDragging.value = false
}

// 坐标转换函数
function worldToScreen(worldX: number, worldY: number) {
  return {
    x: worldX * scale.value + backgroundX.value,
    y: worldY * scale.value + backgroundY.value
  }
}

function screenToWorld(screenX: number, screenY: number) {
  return {
    x: (screenX - backgroundX.value) / scale.value,
    y: (screenY - backgroundY.value) / scale.value
  }
}

// 获取轨迹屏幕坐标点
function getTrackScreenPoints(track: number[]): number[] {
  const screenPoints: number[] = []
  for (let i = 0; i < track.length; i += 2) {
    const worldX = track[i]
    const worldY = track[i + 1]
    const screenPoint = worldToScreen(worldX, worldY)
    screenPoints.push(screenPoint.x, screenPoint.y)
  }
  return screenPoints
}

// 显示小车详情
function showCarDetail(car: Car) {
  selectedCar.value = car
  showDetailDialog.value = true
}

// 请求小车轨迹历史
function requestCarTrack(carId: string) {
  wsManager.requestCarTrack(carId)
}

// 切换轨迹回放
function toggleReplay() {
  if (isReplaying.value) {
    carStore.stopReplay()
  } else {
    carStore.startReplay()
  }
}

// 设置回放速度
function setReplaySpeed(speed: number) {
  carStore.setReplaySpeed(speed)
}

// 生命周期
onMounted(() => {
  // 连接WebSocket
  wsManager.connect()
  
  // 请求小车列表
  wsManager.requestCarList()
  
  // 设置画布尺寸
  const container = document.querySelector('.map-wrapper')
  if (container) {
    const rect = container.getBoundingClientRect()
    stageWidth.value = rect.width
    stageHeight.value = rect.height
  }

  // 初始化工厂背景
  createFactoryBackground()
})

onUnmounted(() => {
  wsManager.disconnect()
})
</script>

<style scoped>
.factory-map-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.map-controls {
  padding: 10px;
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;
  display: flex;
  gap: 10px;
  align-items: center;
}

.map-wrapper {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.car-detail {
  padding: 10px 0;
}

.car-actions {
  margin-top: 15px;
  text-align: center;
}
</style> 