<template>
  <div class="data-visualization-3d">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'

const canvasRef = ref(null)

let scene, camera, renderer
let animationId = null
let items = [] // 第一个椭圆的轮播元素
let bottomTexts = [] // 第二个椭圆的文本元素
let arrow = null // 箭头对象
let currentAngle = 0 // 当前轮播角度
let arrowAngle = 0 // 箭头角度
let waveTime = 0 // 光波时间

// 椭圆参数
const ellipseA = 4 // 椭圆长轴
const ellipseB = 2 // 椭圆短轴
const bottomEllipseA = 5 // 底部椭圆长轴
const bottomEllipseB = 2.5 // 底部椭圆短轴

// 轮播元素数量
const itemCount = 8
// 底部文本
const bottomTextLabels = ['数据采集', '数据处理', '数据分析', '数据展示', '数据应用']

// 创建文本精灵
function createTextSprite(text, color = '#00ffff', size = 48) {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 128
  const ctx = canvas.getContext('2d')
  
  // 将颜色字符串转换为RGB
  const hexColor = color.replace('#', '')
  const r = parseInt(hexColor.substring(0, 2), 16)
  const g = parseInt(hexColor.substring(2, 4), 16)
  const b = parseInt(hexColor.substring(4, 6), 16)
  
  // 渐变背景
  const gradient = ctx.createLinearGradient(0, 0, 512, 0)
  gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 1)`)
  gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0.5)`)
  
  ctx.font = `bold ${size}px Arial`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.shadowColor = color
  ctx.shadowBlur = 20
  ctx.fillStyle = gradient
  ctx.fillText(text, 256, 64)
  
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  const material = new THREE.SpriteMaterial({ 
    map: texture, 
    transparent: true,
    blending: THREE.AdditiveBlending
  })
  return new THREE.Sprite(material)
}

// 创建光波效果
function createWaveRing(radius, color) {
  const geometry = new THREE.RingGeometry(radius - 0.1, radius + 0.1, 64)
  const material = new THREE.MeshBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0.6,
    side: THREE.DoubleSide
  })
  return new THREE.Mesh(geometry, material)
}

// 创建箭头
function createArrow() {
  const shape = new THREE.Shape()
  shape.moveTo(0, 0.3)
  shape.lineTo(0.2, 0)
  shape.lineTo(0, -0.3)
  shape.lineTo(-0.1, -0.1)
  shape.lineTo(-0.3, -0.1)
  shape.lineTo(-0.3, 0.1)
  shape.lineTo(-0.1, 0.1)
  shape.closePath()
  
  const geometry = new THREE.ShapeGeometry(shape)
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    side: THREE.DoubleSide
  })
  return new THREE.Mesh(geometry, material)
}

// 获取椭圆上的点
function getEllipsePoint(angle, a, b) {
  return {
    x: a * Math.cos(angle),
    y: b * Math.sin(angle),
    z: 0
  }
}

// 根据角度计算3D变形
function getTransform(angle, a, b) {
  const point = getEllipsePoint(angle, a, b)
  const normalAngle = angle + Math.PI / 2
  const scaleX = Math.abs(Math.cos(angle)) * 0.3 + 0.7 // 压缩效果
  const scaleY = Math.abs(Math.sin(angle)) * 0.3 + 0.7
  const rotationZ = Math.sin(angle) * 0.3 // 倾斜效果
  
  return {
    position: point,
    scale: { x: scaleX, y: scaleY, z: 1 },
    rotation: { z: rotationZ }
  }
}

// 初始化场景
function initScene() {
  // 场景
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0a0a0a)
  
  // 相机
  const width = window.innerWidth
  const height = window.innerHeight
  camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000)
  camera.position.set(0, 0, 15)
  camera.lookAt(0, 0, 0)
  
  // 渲染器
  renderer = new THREE.WebGLRenderer({ 
    canvas: canvasRef.value, 
    antialias: true,
    alpha: true
  })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)
  
  // 光源
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
  scene.add(ambientLight)
  
  const pointLight1 = new THREE.PointLight(0x00ffff, 1, 100)
  pointLight1.position.set(5, 5, 10)
  scene.add(pointLight1)
  
  const pointLight2 = new THREE.PointLight(0xff00ff, 0.8, 100)
  pointLight2.position.set(-5, -5, 10)
  scene.add(pointLight2)
  
  // 创建第一个椭圆的轮播元素
  const colors = ['#00ffff', '#ff00ff', '#ffff00', '#00ff00', '#ff0080', '#0080ff', '#80ff00', '#ff8000']
  for (let i = 0; i < itemCount; i++) {
    const angle = (i / itemCount) * Math.PI * 2
    const item = {
      sprite: createTextSprite(`项目${i + 1}`, colors[i % colors.length]),
      angle: angle,
      waveRing: createWaveRing(0.5, 0x00ffff)
    }
    item.sprite.scale.set(0.8, 0.8, 1)
    item.waveRing.visible = false
    scene.add(item.sprite)
    scene.add(item.waveRing)
    items.push(item)
  }
  
  // 创建第二个椭圆的文本
  for (let i = 0; i < bottomTextLabels.length; i++) {
    const angle = (i / bottomTextLabels.length) * Math.PI * 2
    const text = {
      sprite: createTextSprite(bottomTextLabels[i], '#00ff88', 36),
      angle: angle,
      originalColor: '#00ff88',
      highlightColor: '#ffff00'
    }
    text.sprite.scale.set(0.6, 0.6, 1)
    text.sprite.material.opacity = 0.8
    scene.add(text.sprite)
    bottomTexts.push(text)
  }
  
  // 创建箭头
  arrow = createArrow()
  arrow.scale.set(1.5, 1.5, 1)
  scene.add(arrow)
  
  // 绘制椭圆线（第一个椭圆）
  const ellipseGeometry1 = new THREE.BufferGeometry()
  const ellipsePoints1 = []
  for (let i = 0; i <= 100; i++) {
    const angle = (i / 100) * Math.PI * 2
    const point = getEllipsePoint(angle, ellipseA, ellipseB)
    ellipsePoints1.push(point.x, point.y, point.z)
  }
  ellipseGeometry1.setAttribute('position', new THREE.Float32BufferAttribute(ellipsePoints1, 3))
  const ellipseMaterial1 = new THREE.LineBasicMaterial({ 
    color: 0x00ffff, 
    transparent: true, 
    opacity: 0.3 
  })
  const ellipseLine1 = new THREE.Line(ellipseGeometry1, ellipseMaterial1)
  scene.add(ellipseLine1)
  
  // 绘制椭圆线（第二个椭圆）
  const ellipseGeometry2 = new THREE.BufferGeometry()
  const ellipsePoints2 = []
  for (let i = 0; i <= 100; i++) {
    const angle = (i / 100) * Math.PI * 2
    const point = getEllipsePoint(angle, bottomEllipseA, bottomEllipseB)
    ellipsePoints2.push(point.x, point.y - 4, point.z) // 向下偏移
  }
  ellipseGeometry2.setAttribute('position', new THREE.Float32BufferAttribute(ellipsePoints2, 3))
  const ellipseMaterial2 = new THREE.LineBasicMaterial({ 
    color: 0x00ff88, 
    transparent: true, 
    opacity: 0.3 
  })
  const ellipseLine2 = new THREE.Line(ellipseGeometry2, ellipseMaterial2)
  scene.add(ellipseLine2)
}

// 动画循环
function animate() {
  animationId = requestAnimationFrame(animate)
  
  waveTime += 0.02
  currentAngle += 0.005 // 轮播速度
  arrowAngle -= 0.01 // 箭头速度（逆时针，负值表示逆时针）
  
  // 更新第一个椭圆的轮播元素
  items.forEach((item, index) => {
    const angle = item.angle + currentAngle
    const transform = getTransform(angle, ellipseA, ellipseB)
    
    // 更新位置
    item.sprite.position.set(
      transform.position.x,
      transform.position.y,
      transform.position.z
    )
    
    // 更新变形
    item.sprite.scale.set(
      transform.scale.x * 0.8,
      transform.scale.y * 0.8,
      1
    )
    item.sprite.rotation.z = transform.rotation.z
    
    // 光波效果
    const wavePhase = waveTime + index * 0.5
    item.waveRing.position.copy(item.sprite.position)
    item.waveRing.scale.set(
      1 + Math.sin(wavePhase) * 0.3,
      1 + Math.sin(wavePhase) * 0.3,
      1
    )
    item.waveRing.material.opacity = (Math.sin(wavePhase) + 1) * 0.3
    item.waveRing.visible = Math.sin(wavePhase) > -0.5
    
    // 旋转效果
    item.sprite.rotation.y += 0.01
  })
  
  // 更新第二个椭圆的文本
  bottomTexts.forEach((text, index) => {
    const angle = text.angle
    const transform = getTransform(angle, bottomEllipseA, bottomEllipseB)
    
    // 更新位置（向下偏移）
    text.sprite.position.set(
      transform.position.x,
      transform.position.y - 4,
      transform.position.z
    )
    
    // 更新变形
    text.sprite.scale.set(
      transform.scale.x * 0.6,
      transform.scale.y * 0.6,
      1
    )
    text.sprite.rotation.z = transform.rotation.z
    
    // 检查箭头是否经过文本（高亮效果）
    // 标准化角度到 [0, 2π]
    const normalizeAngle = (a) => {
      let normalized = a % (Math.PI * 2)
      if (normalized < 0) normalized += Math.PI * 2
      return normalized
    }
    
    const arrowAngleNorm = normalizeAngle(arrowAngle)
    const textAngleNorm = normalizeAngle(angle)
    
    let angleDiff = Math.abs(arrowAngleNorm - textAngleNorm)
    if (angleDiff > Math.PI) {
      angleDiff = Math.PI * 2 - angleDiff
    }
    
    if (angleDiff < 0.4) {
      // 高亮
      const intensity = (0.4 - angleDiff) / 0.4
      // 混合颜色实现高亮效果
      const highlightColor = new THREE.Color(0xffff00)
      const normalColor = new THREE.Color(0x00ff88)
      highlightColor.lerp(normalColor, 1 - intensity)
      text.sprite.material.color.copy(highlightColor)
      text.sprite.material.opacity = 0.8 + intensity * 0.2
      text.sprite.scale.set(
        transform.scale.x * 0.6 * (1 + intensity * 0.4),
        transform.scale.y * 0.6 * (1 + intensity * 0.4),
        1
      )
    } else {
      // 恢复正常
      text.sprite.material.color.setHex(0x00ff88)
      text.sprite.material.opacity = 0.8
    }
  })
  
  // 更新箭头位置
  const arrowPoint = getEllipsePoint(arrowAngle, bottomEllipseA, bottomEllipseB)
  arrow.position.set(arrowPoint.x, arrowPoint.y - 4, arrowPoint.z)
  
  // 箭头朝向切线方向（逆时针运动，所以切线角度需要调整）
  const tangentAngle = arrowAngle + Math.PI / 2
  arrow.rotation.z = tangentAngle
  
  // 箭头发光效果（通过改变颜色和透明度）
  const glowIntensity = 0.7 + Math.sin(waveTime * 2) * 0.3
  arrow.material.color.setHex(0x00ffff)
  arrow.material.opacity = glowIntensity
  
  renderer.render(scene, camera)
}

// 窗口大小调整
function handleResize() {
  const width = window.innerWidth
  const height = window.innerHeight
  
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

onMounted(() => {
  initScene()
  animate()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', handleResize)
  
  // 清理资源
  items.forEach(item => {
    item.sprite.material.dispose()
    item.sprite.geometry?.dispose()
    item.waveRing.material.dispose()
    item.waveRing.geometry.dispose()
  })
  
  bottomTexts.forEach(text => {
    text.sprite.material.dispose()
    text.sprite.geometry?.dispose()
  })
  
  if (arrow) {
    arrow.material.dispose()
    arrow.geometry.dispose()
  }
  
  renderer?.dispose()
})
</script>

<style scoped>
.data-visualization-3d {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a0a 100%);
  overflow: hidden;
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
