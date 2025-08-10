import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// 小车数据结构
export interface Car {
  id: string
  x: number
  y: number
  status: 'online' | 'offline' | 'error'
  battery: number
  speed: number
  direction: number
  lastUpdate: Date
}

// 历史轨迹点
export interface TrackPoint {
  id: string
  x: number
  y: number
  timestamp: Date
}

export const useCarStore = defineStore('car', () => {
  // 小车列表
  const cars = ref<Car[]>([])
  
  // 历史轨迹数据
  const trackHistory = ref<Map<string, TrackPoint[]>>(new Map())
  
  // 轨迹回放相关
  const isReplaying = ref(false)
  const replaySpeed = ref(1) // 回放速度倍数
  const currentReplayTime = ref(0)
  
  // 计算属性
  const onlineCars = computed(() => cars.value.filter(car => car.status === 'online'))
  const offlineCars = computed(() => cars.value.filter(car => car.status === 'offline'))
  
  // 更新小车位置
  function updateCarPosition(carData: Partial<Car>) {
    const existingCarIndex = cars.value.findIndex(car => car.id === carData.id)
    
    if (existingCarIndex !== -1) {
      // 更新现有小车
      const oldCar = cars.value[existingCarIndex]
      cars.value[existingCarIndex] = {
        ...oldCar,
        ...carData,
        lastUpdate: new Date()
      }
      
      // 添加到历史轨迹
      addTrackPoint(carData.id!, carData.x!, carData.y!)
    } else {
      // 添加新小车
      cars.value.push({
        id: carData.id!,
        x: carData.x!,
        y: carData.y!,
        status: carData.status || 'online',
        battery: carData.battery || 100,
        speed: carData.speed || 0,
        direction: carData.direction || 0,
        lastUpdate: new Date()
      })
      
      // 初始化轨迹历史
      trackHistory.value.set(carData.id!, [])
      addTrackPoint(carData.id!, carData.x!, carData.y!)
    }
  }
  
  // 添加轨迹点
  function addTrackPoint(carId: string, x: number, y: number) {
    if (!trackHistory.value.has(carId)) {
      trackHistory.value.set(carId, [])
    }
    
    const track = trackHistory.value.get(carId)!
    track.push({
      id: carId,
      x,
      y,
      timestamp: new Date()
    })
    
    // 限制历史轨迹长度（保留最近1000个点）
    if (track.length > 1000) {
      track.splice(0, track.length - 1000)
    }
  }
  
  // 获取小车历史轨迹
  function getCarTrack(carId: string): TrackPoint[] {
    return trackHistory.value.get(carId) || []
  }
  
  // 开始轨迹回放
  function startReplay() {
    isReplaying.value = true
    currentReplayTime.value = 0
  }
  
  // 停止轨迹回放
  function stopReplay() {
    isReplaying.value = false
    currentReplayTime.value = 0
  }
  
  // 设置回放速度
  function setReplaySpeed(speed: number) {
    replaySpeed.value = speed
  }
  
  // 清除小车数据
  function clearCars() {
    cars.value = []
    trackHistory.value.clear()
  }
  
  return {
    cars,
    trackHistory,
    isReplaying,
    replaySpeed,
    currentReplayTime,
    onlineCars,
    offlineCars,
    updateCarPosition,
    addTrackPoint,
    getCarTrack,
    startReplay,
    stopReplay,
    setReplaySpeed,
    clearCars
  }
}) 