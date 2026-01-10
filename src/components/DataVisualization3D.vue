<template>
  <div class="data-visualization-3d">
    <!-- 第一个椭圆：轮播元素 -->
    <div class="ellipse-container ellipse-top">
      <!-- 中间圆柱体（放在同一个3D容器中） -->
      <div class="cylinder-container">
        <div class="cylinder">
          <div class="cylinder-top"></div>
          <div class="cylinder-body"></div>
          <div class="cylinder-bottom"></div>
        </div>
      </div>
      
      <!-- 第一个椭圆线（分段绘制以实现遮挡效果） -->
      <div class="ellipse-line-container ellipse-line-top">
        <div
          v-for="(segment, index) in topEllipseSegments"
          :key="index"
          class="ellipse-segment"
          :style="segment.style"
        ></div>
      </div>
      <div 
        v-for="(item, index) in topItems" 
        :key="index"
        class="carousel-item"
        :class="{ 'behind-cylinder': isBehindCylinder(item) }"
        :style="getItemStyle(item)"
      >
        <div class="item-text">{{ item.text }}</div>
        <div 
          class="wave-ring"
          :style="getWaveStyle(item, index)"
        ></div>
      </div>
    </div>

    <!-- 第二个椭圆：固定文本和箭头 -->
    <div class="ellipse-container ellipse-bottom">
      <!-- 第二个椭圆线（分段绘制以实现遮挡效果） -->
      <div class="ellipse-line-container ellipse-line-bottom">
        <div
          v-for="(segment, index) in bottomEllipseSegments"
          :key="index"
          class="ellipse-segment"
          :style="segment.style"
        ></div>
      </div>
      
      <div
        v-for="(text, index) in bottomTexts"
        :key="index"
        class="bottom-text-item"
        :class="{ 'highlight': text.isHighlighted }"
        :style="getBottomTextStyle(text, index)"
      >
        {{ text.label }}
      </div>

      <!-- 箭头 -->
      <div 
        class="arrow"
        :style="getArrowStyle()"
      >
        <svg width="30" height="30" viewBox="0 0 30 30">
          <path d="M 15 5 L 20 15 L 15 25 L 10 15 Z" fill="#00ffff"/>
          <path d="M 5 12 L 10 15 L 5 18 Z" fill="#00ffff"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

// 椭圆参数（使用 vw 单位）
const ellipseA = 20 // 椭圆长轴 (vw)
const ellipseB = 10 // 椭圆短轴 (vw)
const bottomEllipseA = 25 // 底部椭圆长轴 (vw)
const bottomEllipseB = 12.5 // 底部椭圆短轴 (vw)

// 轮播元素数量
const itemCount = 8
const colors = ['#00ffff', '#ff00ff', '#ffff00', '#00ff00', '#ff0080', '#0080ff', '#80ff00', '#ff8000']

// 底部文本
const bottomTextLabels = ['数据采集', '数据处理', '数据分析', '数据展示', '数据应用']

// 状态
const currentAngle = ref(0) // 当前轮播角度
const arrowAngle = ref(0) // 箭头角度
const waveTime = ref(0) // 光波时间
const animationId = ref(null)

// 椭圆线段数量（用于分段绘制）
const segmentCount = 60

// 顶部轮播元素数据
const topItems = ref(
  Array.from({ length: itemCount }, (_, i) => ({
    text: `项目${i + 1}`,
    color: colors[i % colors.length],
    initialAngle: (i / itemCount) * Math.PI * 2
  }))
)

// 底部文本数据
const bottomTexts = ref(
  bottomTextLabels.map((label, i) => ({
    label,
    angle: (i / bottomTextLabels.length) * Math.PI * 2,
    isHighlighted: false
  }))
)

// 获取椭圆上的点（返回 vw 单位）
function getEllipsePoint(angle, a, b) {
  return {
    x: a * Math.cos(angle),
    y: b * Math.sin(angle)
  }
}

// 根据角度计算3D变形
function getTransform(angle, a, b) {
  const point = getEllipsePoint(angle, a, b)
  const scaleX = Math.abs(Math.cos(angle)) * 0.3 + 0.7 // 压缩效果
  const scaleY = Math.abs(Math.sin(angle)) * 0.3 + 0.7
  const rotationZ = Math.sin(angle) * 0.3 // 倾斜效果（弧度转角度）
  const rotationZdeg = rotationZ * (180 / Math.PI)
  
  return {
    x: point.x,
    y: point.y,
    scaleX,
    scaleY,
    rotationZ: rotationZdeg
  }
}

// 判断元素是否在圆柱后面
function isBehindCylinder(item) {
  const angle = item.initialAngle + currentAngle.value
  // 计算元素的z深度（与getItemStyle中的计算保持一致）
  const translateZ = Math.sin(angle) * 100
  // 圆柱体的中心z位置是0，半径大约是60px
  // 如果元素的z值小于-40（在圆柱后面），则被遮挡
  return translateZ < -40
}

// 获取轮播元素样式
function getItemStyle(item) {
  const angle = item.initialAngle + currentAngle.value
  const transform = getTransform(angle, ellipseA, ellipseB)
  
  // 计算3D透视效果和深度
  // 增加深度范围，使环绕效果更明显
  const translateZ = Math.sin(angle) * 100 // 深度效果（增大范围）
  
  return {
    transform: `
      translate(${transform.x}vw, ${transform.y}vh)
      translateZ(${translateZ}px)
      scale(${transform.scaleX * 0.8}, ${transform.scaleY * 0.8})
      rotateZ(${transform.rotationZ}deg)
    `,
    color: item.color,
    '--item-color': item.color
    // 不设置zIndex，完全依赖translateZ来控制深度排序
  }
}

// 获取光波样式
function getWaveStyle(item, index) {
  const angle = item.initialAngle + currentAngle.value
  const transform = getTransform(angle, ellipseA, ellipseB)
  const wavePhase = waveTime.value + index * 0.5
  const scale = 1 + Math.sin(wavePhase) * 0.3
  const opacity = (Math.sin(wavePhase) + 1) * 0.3
  const translateZ = Math.sin(angle) * 100
  
  return {
    transform: `
      translate(${transform.x}vw, ${transform.y}vh)
      translateZ(${translateZ}px)
      scale(${scale})
    `,
    opacity: opacity > 0 ? opacity : 0,
    zIndex: translateZ > -50 ? 9 : 0 // 光波也要考虑深度
  }
}

// 获取底部文本样式
function getBottomTextStyle(text, index) {
  const transform = getTransform(text.angle, bottomEllipseA, bottomEllipseB)
  const highlightScale = text.isHighlighted ? 1.2 : 1
  
  return {
    transform: `
      translate(${transform.x}vw, ${transform.y - 4}vh)
      scale(${transform.scaleX * 0.6 * highlightScale}, ${transform.scaleY * 0.6 * highlightScale})
      rotateZ(${transform.rotationZ}deg)
    `
  }
}

// 获取箭头样式
function getArrowStyle() {
  const point = getEllipsePoint(arrowAngle.value, bottomEllipseA, bottomEllipseB)
  const tangentAngle = arrowAngle.value + Math.PI / 2
  const rotationDeg = tangentAngle * (180 / Math.PI)
  const glowIntensity = 0.7 + Math.sin(waveTime.value * 2) * 0.3
  
  return {
    transform: `
      translate(${point.x}vw, ${point.y - 4}vh)
      rotate(${rotationDeg}deg)
    `,
    opacity: glowIntensity
  }
}

// 判断角度对应的z深度是否在圆柱体后面
function isAngleBehindCylinder(angle) {
  const translateZ = Math.sin(angle) * 100
  return translateZ < -40
}

// 计算第一个椭圆的线段
const topEllipseSegments = computed(() => {
  const segments = []
  const segmentAngle = (Math.PI * 2) / segmentCount
  
  for (let i = 0; i < segmentCount; i++) {
    const startAngle = i * segmentAngle
    const endAngle = (i + 1) * segmentAngle
    
    // 计算线段的中点角度
    const midAngle = (startAngle + endAngle) / 2
    const isBehind = isAngleBehindCylinder(midAngle)
    
    // 计算椭圆上的点（使用vw/vh单位）
    const startPoint = getEllipsePoint(startAngle, ellipseA, ellipseB)
    const endPoint = getEllipsePoint(endAngle, ellipseA, ellipseB)
    
    // 计算translateZ
    const translateZ = Math.sin(midAngle) * 100
    
    // 计算线段长度和角度
    const dx = endPoint.x - startPoint.x
    const dy = endPoint.y - startPoint.y
    const segmentLength = Math.sqrt(dx * dx + dy * dy)
    const angle = Math.atan2(dy, dx) * 180 / Math.PI
    
    segments.push({
      style: {
        position: 'absolute',
        left: `calc(50% + ${startPoint.x}vw)`,
        top: `calc(50% + ${startPoint.y}vh)`,
        width: `${segmentLength}vw`,
        height: '2px',
        backgroundColor: '#00ffff',
        boxShadow: '0 0 4px rgba(0, 255, 255, 0.5)',
        transformOrigin: '0 50%',
        transform: `
          translate(-50%, -50%)
          translateZ(${translateZ}px)
          rotate(${angle}deg)
        `,
        transformStyle: 'preserve-3d',
        opacity: isBehind ? 0.1 : 0.3,
        transition: 'opacity 0.2s ease'
      }
    })
  }
  
  return segments
})

// 计算第二个椭圆的线段
const bottomEllipseSegments = computed(() => {
  const segments = []
  const segmentAngle = (Math.PI * 2) / segmentCount
  
  for (let i = 0; i < segmentCount; i++) {
    const startAngle = i * segmentAngle
    const endAngle = (i + 1) * segmentAngle
    
    // 计算线段的中点角度
    const midAngle = (startAngle + endAngle) / 2
    // 底部椭圆在z=0平面，根据x坐标判断是否在圆柱体后面
    const midPoint = getEllipsePoint(midAngle, bottomEllipseA, bottomEllipseB)
    const isBehind = Math.abs(midPoint.x) < 3 && midPoint.y > 0 // 在圆柱体后面
    
    // 计算椭圆上的点（使用vw/vh单位，向下偏移）
    const startPoint = getEllipsePoint(startAngle, bottomEllipseA, bottomEllipseB)
    const endPoint = getEllipsePoint(endAngle, bottomEllipseA, bottomEllipseB)
    
    // 计算线段长度和角度
    const dx = endPoint.x - startPoint.x
    const dy = endPoint.y - startPoint.y
    const segmentLength = Math.sqrt(dx * dx + dy * dy)
    const angle = Math.atan2(dy, dx) * 180 / Math.PI
    
    segments.push({
      style: {
        position: 'absolute',
        left: `calc(50% + ${startPoint.x}vw)`,
        top: `calc(50% + ${startPoint.y - 4}vh)`,
        width: `${segmentLength}vw`,
        height: '2px',
        backgroundColor: '#00ff88',
        boxShadow: '0 0 4px rgba(0, 255, 136, 0.5)',
        transformOrigin: '0 50%',
        transform: `
          translate(-50%, -50%)
          translateZ(0px)
          rotate(${angle}deg)
        `,
        transformStyle: 'preserve-3d',
        opacity: isBehind ? 0.1 : 0.3,
        transition: 'opacity 0.2s ease'
      }
    })
  }
  
  return segments
})

// 动画循环
function animate() {
  animationId.value = requestAnimationFrame(animate)
  
  waveTime.value += 0.02
  currentAngle.value += 0.005 // 轮播速度
  arrowAngle.value -= 0.01 // 箭头速度（逆时针）
  
  // 检查箭头是否经过文本（高亮效果）
  bottomTexts.value.forEach((text) => {
    const normalizeAngle = (a) => {
      let normalized = a % (Math.PI * 2)
      if (normalized < 0) normalized += Math.PI * 2
      return normalized
    }
    
    const arrowAngleNorm = normalizeAngle(arrowAngle.value)
    const textAngleNorm = normalizeAngle(text.angle)
    
    let angleDiff = Math.abs(arrowAngleNorm - textAngleNorm)
    if (angleDiff > Math.PI) {
      angleDiff = Math.PI * 2 - angleDiff
    }
    
    text.isHighlighted = angleDiff < 0.4
  })
}

onMounted(() => {
  animate()
})

onBeforeUnmount(() => {
  if (animationId.value) {
    cancelAnimationFrame(animationId.value)
  }
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
  perspective: 1000px;
  perspective-origin: center center;
}

.ellipse-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  transform-style: preserve-3d;
  /* 不设置z-index，让3D transform自动处理深度排序 */
}

.ellipse-top {
  display: flex;
  align-items: center;
  justify-content: center;
}

.ellipse-bottom {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 椭圆线容器 */
.ellipse-line-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  transform-style: preserve-3d;
  z-index: 1;
}

.ellipse-segment {
  position: absolute;
  pointer-events: none;
  transform-style: preserve-3d;
  transition: opacity 0.2s ease;
}

/* 中间圆柱体 */
.cylinder-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-style: preserve-3d;
  /* 不设置z-index，完全依赖translateZ来控制深度 */
  pointer-events: none;
}

.cylinder {
  position: relative;
  width: 120px;
  height: 250px;
  transform-style: preserve-3d;
  transform: translateZ(0) translateY(0); /* 圆柱体在z=0位置 */
}

/* 圆柱体主体 */
.cylinder-body {
  position: absolute;
  width: 120px;
  height: 250px;
  background: linear-gradient(
    90deg,
    #003d7a 0%,
    #0052a3 15%,
    #0066cc 30%,
    #0080ff 50%,
    #4a9eff 70%,
    #0080ff 85%,
    #0066cc 100%
  );
  border-radius: 60px;
  box-shadow: 
    0 0 50px rgba(0, 102, 204, 1),
    0 0 80px rgba(74, 158, 255, 0.6),
    inset -25px 0 50px rgba(0, 0, 0, 0.5),
    inset 25px 0 50px rgba(255, 255, 255, 0.3),
    inset 0 -15px 40px rgba(0, 0, 0, 0.4),
    inset 0 15px 40px rgba(255, 255, 255, 0.2);
  top: 0;
  left: 0;
  border: 2px solid rgba(74, 158, 255, 0.5);
}

/* 圆柱体顶部 */
.cylinder-top {
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 30% 30%,
    #66b3ff 0%,
    #4a9eff 30%,
    #0080ff 60%,
    #0066cc 100%
  );
  top: -60px;
  left: 0;
  box-shadow: 
    0 0 40px rgba(0, 102, 204, 1),
    0 0 60px rgba(74, 158, 255, 0.6),
    inset 0 0 50px rgba(102, 179, 255, 0.5),
    inset -15px -15px 30px rgba(0, 0, 0, 0.4);
  transform: translateZ(0);
  border: 2px solid rgba(74, 158, 255, 0.6);
}

/* 圆柱体底部 */
.cylinder-bottom {
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 30% 30%,
    #0066cc 0%,
    #0080ff 40%,
    #4a9eff 70%,
    #66b3ff 100%
  );
  bottom: -60px;
  left: 0;
  box-shadow: 
    0 0 40px rgba(0, 102, 204, 1),
    0 0 60px rgba(74, 158, 255, 0.6),
    inset 0 0 50px rgba(102, 179, 255, 0.5),
    inset 15px 15px 30px rgba(0, 0, 0, 0.4);
  transform: translateZ(0);
  border: 2px solid rgba(74, 158, 255, 0.6);
}

/* 轮播元素 */
.carousel-item {
  position: absolute;
  width: 120px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-style: preserve-3d;
  transition: transform 0.1s linear, opacity 0.2s ease;
  will-change: transform, opacity;
}

.carousel-item.behind-cylinder {
  opacity: 0.2; /* 后面的元素半透明，表示被遮挡 */
  z-index: 1 !important; /* 后面的元素z-index更低 */
  filter: blur(2px); /* 添加模糊效果，增强被遮挡的感觉 */
}

.item-text {
  font-size: 18px;
  font-weight: bold;
  color: var(--item-color);
  text-shadow: 
    0 0 10px var(--item-color),
    0 0 20px var(--item-color),
    0 0 30px var(--item-color);
  white-space: nowrap;
  z-index: 2;
  /* 移除自旋转动画 */
}

/* 光波效果 */
.wave-ring {
  position: absolute;
  width: 80px;
  height: 80px;
  border: 2px solid #00ffff;
  border-radius: 50%;
  pointer-events: none;
  box-shadow: 
    0 0 10px #00ffff,
    0 0 20px #00ffff,
    inset 0 0 10px #00ffff;
  transition: transform 0.1s linear, opacity 0.1s linear;
  will-change: transform, opacity;
}

/* 底部文本 */
.bottom-text-item {
  position: absolute;
  font-size: 16px;
  font-weight: bold;
  color: #00ff88;
  text-shadow: 
    0 0 10px #00ff88,
    0 0 20px #00ff88;
  white-space: nowrap;
  transition: all 0.2s ease;
  will-change: transform, color, text-shadow;
}

.bottom-text-item.highlight {
  color: #ffff00;
  text-shadow: 
    0 0 15px #ffff00,
    0 0 30px #ffff00,
    0 0 45px #ffff00;
  transform: scale(1.2) !important;
}

/* 箭头 */
.arrow {
  position: absolute;
  width: 30px;
  height: 30px;
  pointer-events: none;
  filter: drop-shadow(0 0 5px #00ffff) drop-shadow(0 0 10px #00ffff);
  transition: transform 0.1s linear, opacity 0.1s linear;
  will-change: transform, opacity;
  z-index: 10;
}

.arrow svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 0 3px #00ffff);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .item-text {
    font-size: 14px;
  }
  
  .bottom-text-item {
    font-size: 12px;
  }
  
  .carousel-item {
    width: 100px;
    height: 50px;
  }
  
  .wave-ring {
    width: 60px;
    height: 60px;
  }
}
</style>