import { io, Socket } from 'socket.io-client'
import { useCarStore } from '../stores/carStore'

export class WebSocketManager {
  private socket: Socket | null = null
  private carStore: any = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  // 获取 carStore 实例
  private getCarStore() {
    if (!this.carStore) {
      this.carStore = useCarStore()
    }
    return this.carStore
  }

  // 连接WebSocket
  connect(url: string = 'ws://localhost:3000') {
    try {
      this.socket = io(url, {
        transports: ['websocket'],
        timeout: 10000,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay
      })

      this.setupEventListeners()
      console.log('WebSocket connected to:', url)
    } catch (error) {
      console.error('WebSocket connection failed:', error)
    }
  }

  // 设置事件监听器
  private setupEventListeners() {
    if (!this.socket) return

    // 连接成功
    this.socket.on('connect', () => {
      console.log('WebSocket connected')
      this.reconnectAttempts = 0
    })

    // 连接断开
    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason)
    })

    // 连接错误
    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error)
      this.reconnectAttempts++
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached')
      }
    })

    // 接收小车位置更新
    this.socket.on('car_position_update', (data) => {
      console.log('Received car position update:', data)
      this.getCarStore().updateCarPosition(data)
    })

    // 接收小车列表
    this.socket.on('car_list_update', (data) => {
      console.log('Received car list update:', data)
      if (Array.isArray(data)) {
        data.forEach(car => {
          this.getCarStore().updateCarPosition(car)
        })
      }
    })

    // 接收历史轨迹数据
    this.socket.on('track_history', (data) => {
      console.log('Received track history:', data)
      if (data.carId && data.track) {
        // 这里可以处理历史轨迹数据
        // 暂时直接更新小车位置
        this.getCarStore().updateCarPosition({
          id: data.carId,
          x: data.track.x,
          y: data.track.y
        })
      }
    })
  }

  // 发送消息
  send(event: string, data: any) {
    if (this.socket && this.socket.connected) {
      this.socket.emit(event, data)
    } else {
      console.warn('WebSocket not connected')
    }
  }

  // 请求小车列表
  requestCarList() {
    this.send('get_car_list', {})
  }

  // 请求小车历史轨迹
  requestCarTrack(carId: string, startTime?: Date, endTime?: Date) {
    this.send('get_car_track', {
      carId,
      startTime: startTime?.toISOString(),
      endTime: endTime?.toISOString()
    })
  }

  // 断开连接
  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  // 检查连接状态
  isConnected(): boolean {
    return this.socket?.connected || false
  }
}

// 创建全局WebSocket管理器实例
export const wsManager = new WebSocketManager() 