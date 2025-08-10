<template>
  <div class="track-replay-container">
    <div class="replay-controls">
      <el-button-group>
        <el-button 
          @click="startReplay" 
          :disabled="isReplaying"
          type="primary"
          size="small"
        >
          开始回放
        </el-button>
        <el-button 
          @click="pauseReplay" 
          :disabled="!isReplaying"
          type="warning"
          size="small"
        >
          暂停
        </el-button>
        <el-button 
          @click="stopReplay" 
          :disabled="!isReplaying"
          type="danger"
          size="small"
        >
          停止
        </el-button>
      </el-button-group>
      
      <el-select v-model="selectedCarId" placeholder="选择小车" size="small" style="width: 150px">
        <el-option 
          v-for="car in cars" 
          :key="car.id" 
          :label="car.id" 
          :value="car.id" 
        />
      </el-select>
      
      <el-select v-model="replaySpeed" @change="setReplaySpeed" size="small" style="width: 100px">
        <el-option label="0.5x" :value="0.5" />
        <el-option label="1x" :value="1" />
        <el-option label="2x" :value="2" />
        <el-option label="5x" :value="5" />
      </el-select>
    </div>
    
    <div class="replay-progress">
      <el-slider
        v-model="currentFrame"
        :min="0"
        :max="maxFrames"
        :step="1"
        @change="seekToFrame"
        :disabled="!selectedCarId"
      />
      <span class="progress-text">
        {{ currentFrame }} / {{ maxFrames }} ({{ formatTime(currentTime) }})
      </span>
    </div>
    
    <div class="replay-info">
      <el-descriptions :column="3" border size="small">
        <el-descriptions-item label="回放状态">
          <el-tag :type="isReplaying ? 'success' : 'info'">
            {{ isReplaying ? '回放中' : '已停止' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="当前小车">
          {{ selectedCarId || '未选择' }}
        </el-descriptions-item>
        <el-descriptions-item label="轨迹点数">
          {{ trackPoints.length }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { useCarStore, type TrackPoint } from '../stores/carStore'

// 响应式数据
const selectedCarId = ref('')
const currentFrame = ref(0)
const maxFrames = ref(0)
const currentTime = ref(0)
const replaySpeed = ref(1)
const isReplaying = ref(false)
const trackPoints = ref<TrackPoint[]>([])
const replayInterval = ref<number | null>(null)

// 使用小车状态管理
const carStore = useCarStore()
const cars = computed(() => carStore.cars)

// 监听小车选择变化
watch(selectedCarId, (newCarId) => {
  if (newCarId) {
    loadTrackData(newCarId)
  } else {
    resetReplay()
  }
})

// 加载轨迹数据
function loadTrackData(carId: string) {
  trackPoints.value = carStore.getCarTrack(carId)
  maxFrames.value = trackPoints.value.length - 1
  currentFrame.value = 0
  currentTime.value = 0
  
  if (trackPoints.value.length > 0) {
    currentTime.value = trackPoints.value[0].timestamp.getTime()
  }
}

// 重置回放
function resetReplay() {
  trackPoints.value = []
  maxFrames.value = 0
  currentFrame.value = 0
  currentTime.value = 0
  stopReplay()
}

// 开始回放
function startReplay() {
  if (!selectedCarId.value || trackPoints.value.length === 0) return
  
  isReplaying.value = true
  const interval = 1000 / replaySpeed.value // 每秒帧数
  
  replayInterval.value = window.setInterval(() => {
    if (currentFrame.value < maxFrames.value) {
      currentFrame.value++
      updateCurrentTime()
      updateCarPosition()
    } else {
      stopReplay()
    }
  }, interval)
}

// 暂停回放
function pauseReplay() {
  isReplaying.value = false
  if (replayInterval.value) {
    clearInterval(replayInterval.value)
    replayInterval.value = null
  }
}

// 停止回放
function stopReplay() {
  isReplaying.value = false
  if (replayInterval.value) {
    clearInterval(replayInterval.value)
    replayInterval.value = null
  }
  currentFrame.value = 0
  updateCurrentTime()
  updateCarPosition()
}

// 跳转到指定帧
function seekToFrame(frame: number) {
  currentFrame.value = frame
  updateCurrentTime()
  updateCarPosition()
}

// 设置回放速度
function setReplaySpeed(speed: number) {
  replaySpeed.value = speed
  if (isReplaying.value) {
    pauseReplay()
    startReplay()
  }
}

// 更新当前时间
function updateCurrentTime() {
  if (trackPoints.value.length > currentFrame.value) {
    currentTime.value = trackPoints.value[currentFrame.value].timestamp.getTime()
  }
}

// 更新小车位置（模拟实时更新）
function updateCarPosition() {
  if (trackPoints.value.length > currentFrame.value) {
    const point = trackPoints.value[currentFrame.value]
    carStore.updateCarPosition({
      id: point.id,
      x: point.x,
      y: point.y
    })
  }
}

// 格式化时间
function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('zh-CN')
}

// 生命周期
onUnmounted(() => {
  if (replayInterval.value) {
    clearInterval(replayInterval.value)
  }
})
</script>

<style scoped>
.track-replay-container {
  padding: 15px;
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.replay-controls {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 15px;
}

.replay-progress {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.progress-text {
  font-size: 12px;
  color: #666;
  min-width: 120px;
}

.replay-info {
  margin-top: 10px;
}
</style> 