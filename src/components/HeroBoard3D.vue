<template>
  <div class="hero-board-3d">
    <canvas ref="canvas3d"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'

const canvas3d = ref(null)
let renderer, scene, camera, animationId
let heroNames = ['第一名', '第二名', '第三名']

function createTextSprite(text, color = '#fff', size = 64) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 256
  const ctx = canvas.getContext('2d')
  ctx.font = `bold ${size}px Arial`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.shadowColor = color
  ctx.shadowBlur = 16
  ctx.fillStyle = color
  ctx.fillText(text, 128, 128)
  const texture = new THREE.CanvasTexture(canvas)
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true })
  return new THREE.Sprite(material)
}

onMounted(() => {
  // 场景
  scene = new THREE.Scene()
  scene.background = null

  // 柔和光源
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
  scene.add(ambientLight)
  const pointLight = new THREE.PointLight(0x66ccff, 1.2, 100)
  pointLight.position.set(0, 0, 10)
  scene.add(pointLight)

  // 相机
  camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000)
  camera.position.set(0, 0, 12)

  // 渲染器
  renderer = new THREE.WebGLRenderer({ canvas: canvas3d.value, alpha: true, antialias: true })
  renderer.setSize(600, 600)

  // 添加粒子背景
  const particles = new THREE.BufferGeometry()
  const particleCount = 300
  const positions = []
  for (let i = 0; i < particleCount; i++) {
    positions.push((Math.random() - 0.5) * 20)
    positions.push((Math.random() - 0.5) * 20)
    positions.push((Math.random() - 0.5) * 20)
  }
  particles.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  const particleMaterial = new THREE.PointsMaterial({ color: 0x66ccff, size: 0.12, transparent: true, opacity: 0.7 })
  const particleSystem = new THREE.Points(particles, particleMaterial)
  scene.add(particleSystem)

  // 添加前三名
  const positionsArr = [
    [0, 1.5, 0], // 第一名
    [-2, -1, 0], // 第二名
    [2, -1, 0],  // 第三名
  ]
  const colors = ['#FFD700', '#C0C0C0', '#CD7F32']
  const sprites = heroNames.map((name, i) => {
    const sprite = createTextSprite(name, colors[i])
    sprite.position.set(...positionsArr[i])
    sprite.scale.set(1.2, 1.2, 1.2)
    scene.add(sprite)
    return sprite
  })

  // 第一名发光圆环
  const ringGeometry = new THREE.TorusGeometry(0.8, 0.12, 32, 120)
  const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xFFD700 })
  const ring = new THREE.Mesh(ringGeometry, ringMaterial)
  ring.position.set(...positionsArr[0])
  scene.add(ring)

  // 发光效果（环外加辉光）
  const glowGeometry = new THREE.TorusGeometry(0.95, 0.22, 32, 120)
  const glowMaterial = new THREE.MeshBasicMaterial({ color: 0xffff99, transparent: true, opacity: 0.25 })
  const glow = new THREE.Mesh(glowGeometry, glowMaterial)
  glow.position.set(...positionsArr[0])
  scene.add(glow)

  // 动画
  function animate() {
    const t = Date.now() * 0.001
    // 粒子缓慢旋转
    particleSystem.rotation.y += 0.0008
    particleSystem.rotation.x += 0.0005

    // 前三名名字悬浮和轻微旋转
    sprites[0].position.set(Math.sin(t) * 0.5, 1.5 + Math.cos(t) * 0.2, 0)
    sprites[0].rotation.z = Math.sin(t) * 0.1
    ring.position.copy(sprites[0].position)
    ring.rotation.z += 0.02
    ring.rotation.x = Math.sin(t) * 0.1
    glow.position.copy(sprites[0].position)
    glow.rotation.z += 0.02
    glow.rotation.x = Math.sin(t) * 0.1

    sprites[1].position.set(-2 + Math.cos(t) * 0.2, -1 + Math.sin(t) * 0.1, 0)
    sprites[1].rotation.z = Math.cos(t) * 0.08
    sprites[2].position.set(2 + Math.sin(t) * 0.2, -1 + Math.cos(t) * 0.1, 0)
    sprites[2].rotation.z = Math.sin(t) * 0.08

    renderer.render(scene, camera)
    animationId = requestAnimationFrame(animate)
  }
  animate()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId)
  renderer?.dispose()
})
</script>

<style scoped>
.hero-board-3d {
  width: 600px;
  height: 600px;
  margin: 0 auto;
  background: #111;
  border-radius: 20px;
  box-shadow: 0 0 40px #000a;
}
canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style> 