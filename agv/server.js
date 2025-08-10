import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
})

// 启用 CORS
app.use(cors())

// 模拟小车数据
const cars = [
  {
    id: 'AGV001',
    x: 600,
    y: 300,
    status: 'online',
    battery: 85,
    speed: 2.5,
    direction: 45,
    lastUpdate: new Date()
  },
  {
    id: 'AGV002',
    x: 600,
    y: 400,
    status: 'online',
    battery: 92,
    speed: 1.8,
    direction: 90,
    lastUpdate: new Date()
  },
  {
    id: 'AGV003',
    x: 500,
    y: 300,
    status: 'online',
    battery: 75,
    speed: 1.5,
    direction: 0,
    lastUpdate: new Date()
  }
]

// 小车历史轨迹数据
const trackHistory = new Map()

// 初始化轨迹历史
cars.forEach(car => {
  trackHistory.set(car.id, [])
})

// WebSocket 连接处理
io.on('connection', (socket) => {
  console.log('客户端连接:', socket.id)

  // 发送小车列表
  socket.emit('car_list_update', cars)

  // 处理获取小车列表请求
  socket.on('get_car_list', () => {
    socket.emit('car_list_update', cars)
  })

  // 处理获取小车轨迹请求
  socket.on('get_car_track', (data) => {
    const { carId, startTime, endTime } = data
    const track = trackHistory.get(carId) || []
    socket.emit('track_history', { carId, track })
  })

  // 断开连接
  socket.on('disconnect', () => {
    console.log('客户端断开连接:', socket.id)
  })
})

// 模拟小车移动
setInterval(() => {
  cars.forEach(car => {
    if (car.status === 'online') {
      // 更复杂的移动模式
      const time = Date.now() * 0.001 // 当前时间（秒）
      const carIndex = cars.indexOf(car)
      
      // 为每个小车设置不同的移动模式
      if (carIndex === 0) {
        // AGV001: 圆形路径
        const radius = 100
        const centerX = 600
        const centerY = 400
        const speed = 0.5
        car.x = centerX + radius * Math.cos(time * speed)
        car.y = centerY + radius * Math.sin(time * speed)
        car.direction = (time * speed * 180 / Math.PI) % 360
      } else if (carIndex === 1) {
        // AGV002: 8字形路径
        const a = 150
        const b = 80
        const speed = 0.3
        car.x = 600 + a * Math.sin(time * speed)
        car.y = 400 + b * Math.sin(time * speed * 2)
        car.direction = (Math.atan2(b * 2 * Math.cos(time * speed * 2), a * Math.cos(time * speed)) * 180 / Math.PI) % 360
      } else if (carIndex === 2) {
        // AGV003: 方形路径
        const size = 200
        const speed = 0.2
        const t = (time * speed) % 4
        if (t < 1) {
          car.x = 500 + size * t
          car.y = 300
          car.direction = 0
        } else if (t < 2) {
          car.x = 700
          car.y = 300 + size * (t - 1)
          car.direction = 90
        } else if (t < 3) {
          car.x = 700 - size * (t - 2)
          car.y = 500
          car.direction = 180
        } else {
          car.x = 500
          car.y = 500 - size * (t - 3)
          car.direction = 270
        }
      }
      
      car.speed = Math.random() * 2 + 1
      car.battery = Math.max(0, car.battery - 0.05)
      car.lastUpdate = new Date()

      // 添加到轨迹历史
      if (!trackHistory.has(car.id)) {
        trackHistory.set(car.id, [])
      }
      const track = trackHistory.get(car.id)
      track.push({
        id: car.id,
        x: car.x,
        y: car.y,
        timestamp: new Date()
      })

      // 限制轨迹长度（增加保留点数）
      if (track.length > 2000) {
        track.splice(0, track.length - 2000)
      }

      // 发送位置更新
      io.emit('car_position_update', car)
    }
  })
}, 100) // 更频繁的更新

// 模拟小车状态变化
setInterval(() => {
  cars.forEach(car => {
    if (Math.random() < 0.1) { // 10% 概率改变状态
      const statuses = ['online', 'offline', 'error']
      car.status = statuses[Math.floor(Math.random() * statuses.length)]
      car.lastUpdate = new Date()
      io.emit('car_position_update', car)
    }
  })
}, 10000)

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    cars: cars.length,
    connections: io.engine.clientsCount
  })
})

// 获取小车列表的 REST API
app.get('/api/cars', (req, res) => {
  res.json(cars)
})

// 获取小车轨迹的 REST API
app.get('/api/cars/:id/track', (req, res) => {
  const carId = req.params.id
  const track = trackHistory.get(carId) || []
  res.json(track)
})

const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
  console.log(`🚀 AGV 后端服务已启动`)
  console.log(`📍 服务地址: http://localhost:${PORT}`)
  console.log(`🔌 WebSocket: ws://localhost:${PORT}`)
  console.log(`📊 健康检查: http://localhost:${PORT}/health`)
  console.log(`📋 API 文档:`)
  console.log(`   GET /api/cars - 获取小车列表`)
  console.log(`   GET /api/cars/:id/track - 获取小车轨迹`)
  console.log(`   WebSocket 事件:`)
  console.log(`     - car_position_update: 小车位置更新`)
  console.log(`     - car_list_update: 小车列表更新`)
  console.log(`     - track_history: 轨迹历史数据`)
}) 