# SVG 学习指南

## 目录
1. [SVG 简介](#svg-简介)
2. [SVG 基本语法](#svg-基本语法)
3. [常用 SVG 元素](#常用-svg-元素)
4. [SVG 属性详解](#svg-属性详解)
5. [SVG 动画](#svg-动画)
6. [在 Vue 中使用 SVG](#在-vue-中使用-svg)
7. [实战示例](#实战示例)
8. [最佳实践](#最佳实践)

---

## SVG 简介

**SVG (Scalable Vector Graphics)** 是一种基于 XML 的矢量图形格式，用于在网页上显示图形。

### SVG 的优势
- **可缩放性**：无损缩放，不会失真
- **文件体积小**：相比位图，文件更小
- **可编辑性**：可以用文本编辑器编辑
- **可交互性**：支持 JavaScript 操作和 CSS 样式
- **可访问性**：支持屏幕阅读器

### SVG vs Canvas vs 位图
| 特性 | SVG | Canvas | 位图 |
|------|-----|--------|------|
| 缩放 | 无损 | 有损 | 有损 |
| 文件大小 | 小 | 中等 | 大 |
| 交互性 | 高 | 中 | 低 |
| 编辑性 | 容易 | 困难 | 困难 |

---

## SVG 基本语法

### 基本结构

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
  <!-- SVG 内容 -->
</svg>
```

### 关键属性说明
- `xmlns`: XML 命名空间，必须包含
- `width`: SVG 画布宽度
- `height`: SVG 画布高度
- `viewBox`: 定义 SVG 的坐标系统和宽高比（格式：`x y width height`）

### viewBox 详解

```xml
<!-- viewBox="x y width height" -->
<svg viewBox="0 0 100 100" width="200" height="200">
  <!-- 内部坐标系统是 100x100，但显示为 200x200 -->
</svg>
```

---

## 常用 SVG 元素

### 1. 矩形 `<rect>`

```xml
<svg width="200" height="200">
  <!-- 基本矩形 -->
  <rect x="10" y="10" width="100" height="50" fill="blue" />
  
  <!-- 圆角矩形 -->
  <rect x="10" y="70" width="100" height="50" rx="10" ry="10" fill="green" />
  
  <!-- 带边框的矩形 -->
  <rect x="10" y="130" width="100" height="50" 
        fill="red" stroke="black" stroke-width="2" />
</svg>
```

**属性说明：**
- `x`, `y`: 左上角坐标
- `width`, `height`: 宽度和高度
- `rx`, `ry`: 圆角半径
- `fill`: 填充颜色
- `stroke`: 边框颜色
- `stroke-width`: 边框宽度

### 2. 圆形 `<circle>`

```xml
<svg width="200" height="200">
  <circle cx="100" cy="100" r="50" fill="blue" />
  <circle cx="100" cy="100" r="40" fill="none" stroke="red" stroke-width="3" />
</svg>
```

**属性说明：**
- `cx`, `cy`: 圆心坐标
- `r`: 半径

### 3. 椭圆 `<ellipse>`

```xml
<svg width="200" height="200">
  <ellipse cx="100" cy="100" rx="80" ry="40" fill="purple" />
</svg>
```

**属性说明：**
- `cx`, `cy`: 椭圆中心坐标
- `rx`: 水平半径
- `ry`: 垂直半径

### 4. 直线 `<line>`

```xml
<svg width="200" height="200">
  <line x1="10" y1="10" x2="190" y2="190" 
        stroke="black" stroke-width="2" />
  <line x1="190" y1="10" x2="10" y2="190" 
        stroke="red" stroke-width="3" stroke-dasharray="5,5" />
</svg>
```

**属性说明：**
- `x1`, `y1`: 起点坐标
- `x2`, `y2`: 终点坐标
- `stroke-dasharray`: 虚线样式（格式：`dash, gap`）

### 5. 折线 `<polyline>`

```xml
<svg width="200" height="200">
  <polyline points="10,10 50,50 90,10 130,50 170,10" 
            fill="none" stroke="blue" stroke-width="2" />
</svg>
```

**属性说明：**
- `points`: 点的坐标列表（格式：`x1,y1 x2,y2 x3,y3 ...`）

### 6. 多边形 `<polygon>`

```xml
<svg width="200" height="200">
  <!-- 三角形 -->
  <polygon points="100,10 150,90 50,90" fill="yellow" />
  
  <!-- 五角星 -->
  <polygon points="100,20 120,60 160,60 130,85 140,125 100,105 60,125 70,85 40,60 80,60" 
           fill="gold" />
</svg>
```

### 7. 路径 `<path>`

`<path>` 是 SVG 中最强大的元素，可以绘制任意形状。

```xml
<svg width="200" height="200">
  <!-- M = Move to (移动到) -->
  <!-- L = Line to (画线到) -->
  <!-- H = Horizontal line (水平线) -->
  <!-- V = Vertical line (垂直线) -->
  <!-- Z = Close path (闭合路径) -->
  
  <path d="M 10 10 L 50 50 L 90 10 Z" fill="blue" />
  
  <!-- 曲线 -->
  <!-- Q = Quadratic Bezier (二次贝塞尔曲线) -->
  <!-- C = Cubic Bezier (三次贝塞尔曲线) -->
  <path d="M 10 100 Q 50 50 90 100" fill="none" stroke="red" stroke-width="2" />
  
  <!-- 弧线 -->
  <!-- A = Arc (弧线) -->
  <path d="M 10 150 A 50 30 0 0 1 90 150" fill="none" stroke="green" stroke-width="2" />
</path>
```

**路径命令详解：**

| 命令 | 说明 | 示例 |
|------|------|------|
| `M x y` | 移动到点 (x, y) | `M 10 10` |
| `L x y` | 画线到点 (x, y) | `L 50 50` |
| `H x` | 水平线到 x | `H 100` |
| `V y` | 垂直线到 y | `V 100` |
| `Z` | 闭合路径 | `Z` |
| `Q x1 y1 x y` | 二次贝塞尔曲线 | `Q 50 50 100 100` |
| `C x1 y1 x2 y2 x y` | 三次贝塞尔曲线 | `C 20 20 80 20 100 100` |
| `A rx ry rotation large-arc sweep x y` | 弧线 | `A 50 30 0 0 1 100 100` |

### 8. 文本 `<text>`

```xml
<svg width="200" height="200">
  <!-- 基本文本 -->
  <text x="10" y="30" fill="black" font-size="20">Hello SVG</text>
  
  <!-- 文本样式 -->
  <text x="10" y="60" fill="blue" font-size="24" font-weight="bold">
    Bold Text
  </text>
  
  <!-- 文本路径 -->
  <path id="textPath" d="M 10 100 Q 50 50 90 100" fill="none" stroke="gray" />
  <text>
    <textPath href="#textPath">Curved Text</textPath>
  </text>
</svg>
```

**属性说明：**
- `x`, `y`: 文本位置
- `font-size`: 字体大小
- `font-weight`: 字体粗细
- `font-family`: 字体族
- `text-anchor`: 文本对齐方式（`start`, `middle`, `end`）

### 9. 图像 `<image>`

```xml
<svg width="200" height="200">
  <image href="image.jpg" x="10" y="10" width="100" height="100" />
</svg>
```

### 10. 分组 `<g>`

`<g>` 用于将多个元素组合在一起，可以统一应用变换和样式。

```xml
<svg width="200" height="200">
  <g fill="blue" stroke="black" stroke-width="2">
    <circle cx="50" cy="50" r="20" />
    <rect x="80" y="30" width="40" height="40" />
  </g>
  
  <!-- 嵌套分组 -->
  <g transform="translate(100, 100)">
    <g fill="red">
      <circle cx="0" cy="0" r="15" />
    </g>
  </g>
</svg>
```

### 11. 定义和引用 `<defs>` 和 `<use>`

```xml
<svg width="200" height="200">
  <defs>
    <!-- 定义可重用元素 -->
    <circle id="myCircle" cx="0" cy="0" r="20" fill="blue" />
  </defs>
  
  <!-- 引用定义的元素 -->
  <use href="#myCircle" x="50" y="50" />
  <use href="#myCircle" x="100" y="50" />
  <use href="#myCircle" x="150" y="50" />
</svg>
```

---

## SVG 属性详解

### 填充和描边

```xml
<svg width="200" height="200">
  <!-- fill: 填充颜色 -->
  <circle cx="50" cy="50" r="30" fill="blue" />
  
  <!-- fill-opacity: 填充透明度 (0-1) -->
  <circle cx="100" cy="50" r="30" fill="blue" fill-opacity="0.5" />
  
  <!-- stroke: 描边颜色 -->
  <circle cx="150" cy="50" r="30" fill="none" stroke="red" stroke-width="3" />
  
  <!-- stroke-dasharray: 虚线样式 -->
  <circle cx="50" cy="120" r="30" fill="none" 
          stroke="green" stroke-width="3" 
          stroke-dasharray="5,5" />
  
  <!-- stroke-linecap: 线帽样式 (butt, round, square) -->
  <line x1="10" y1="170" x2="50" y2="170" 
        stroke="black" stroke-width="10" stroke-linecap="round" />
  
  <!-- stroke-linejoin: 连接样式 (miter, round, bevel) -->
  <polyline points="60,170 80,150 100,170" 
            fill="none" stroke="black" stroke-width="10" 
            stroke-linejoin="round" />
</svg>
```

### 变换 Transform

```xml
<svg width="300" height="300">
  <!-- translate: 平移 -->
  <rect x="0" y="0" width="50" height="50" fill="blue" 
        transform="translate(50, 50)" />
  
  <!-- rotate: 旋转 (角度, 中心x, 中心y) -->
  <rect x="0" y="0" width="50" height="50" fill="red" 
        transform="rotate(45 25 25) translate(100, 50)" />
  
  <!-- scale: 缩放 (x, y) -->
  <rect x="0" y="0" width="50" height="50" fill="green" 
        transform="scale(1.5, 0.5) translate(150, 50)" />
  
  <!-- skewX, skewY: 倾斜 -->
  <rect x="0" y="0" width="50" height="50" fill="purple" 
        transform="skewX(20) translate(200, 50)" />
  
  <!-- 组合变换 -->
  <rect x="0" y="0" width="50" height="50" fill="orange" 
        transform="translate(50, 150) rotate(30) scale(1.2)" />
</svg>
```

### 渐变 `<linearGradient>` 和 `<radialGradient>`

```xml
<svg width="300" height="200">
  <defs>
    <!-- 线性渐变 -->
    <linearGradient id="linearGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:red;stop-opacity:1" />
      <stop offset="50%" style="stop-color:yellow;stop-opacity:1" />
      <stop offset="100%" style="stop-color:blue;stop-opacity:1" />
    </linearGradient>
    
    <!-- 径向渐变 -->
    <radialGradient id="radialGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:white;stop-opacity:1" />
      <stop offset="100%" style="stop-color:blue;stop-opacity:1" />
    </radialGradient>
  </defs>
  
  <rect x="10" y="10" width="100" height="80" fill="url(#linearGrad)" />
  <circle cx="200" cy="50" r="40" fill="url(#radialGrad)" />
</svg>
```

### 滤镜 `<filter>`

```xml
<svg width="300" height="200">
  <defs>
    <!-- 阴影滤镜 -->
    <filter id="shadow">
      <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
      <feOffset dx="2" dy="2" result="offsetblur"/>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    
    <!-- 模糊滤镜 -->
    <filter id="blur">
      <feGaussianBlur stdDeviation="5"/>
    </filter>
  </defs>
  
  <rect x="10" y="10" width="100" height="80" fill="blue" filter="url(#shadow)" />
  <rect x="150" y="10" width="100" height="80" fill="red" filter="url(#blur)" />
</svg>
```

### 裁剪路径 `<clipPath>`

```xml
<svg width="200" height="200">
  <defs>
    <clipPath id="circleClip">
      <circle cx="100" cy="100" r="50" />
    </clipPath>
  </defs>
  
  <rect x="50" y="50" width="100" height="100" 
        fill="blue" clip-path="url(#circleClip)" />
</svg>
```

### 遮罩 `<mask>`

```xml
<svg width="200" height="200">
  <defs>
    <mask id="fadeMask">
      <rect width="200" height="200" fill="white" />
      <circle cx="100" cy="100" r="50" fill="black" />
    </mask>
  </defs>
  
  <rect x="0" y="0" width="200" height="200" 
        fill="blue" mask="url(#fadeMask)" />
</svg>
```

---

## SVG 动画

### CSS 动画

```xml
<svg width="200" height="200">
  <style>
    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .rotating {
      animation: rotate 2s linear infinite;
      transform-origin: center;
    }
  </style>
  
  <rect x="75" y="75" width="50" height="50" fill="blue" class="rotating" />
</svg>
```

### SVG 动画元素

```xml
<svg width="200" height="200">
  <!-- animate: 属性动画 -->
  <circle cx="100" cy="100" r="30" fill="blue">
    <animate attributeName="r" from="30" to="50" 
             dur="2s" repeatCount="indefinite" />
  </circle>
  
  <!-- animateTransform: 变换动画 -->
  <rect x="75" y="75" width="50" height="50" fill="red">
    <animateTransform attributeName="transform" 
                     type="rotate" 
                     from="0 100 100" 
                     to="360 100 100" 
                     dur="3s" 
                     repeatCount="indefinite" />
  </rect>
  
  <!-- animateMotion: 路径动画 -->
  <circle cx="0" cy="0" r="10" fill="green">
    <animateMotion path="M 10 10 L 190 10 L 190 190 L 10 190 Z" 
                   dur="4s" 
                   repeatCount="indefinite" />
  </circle>
</svg>
```

---

## 在 Vue 中使用 SVG

### 1. 内联 SVG

```vue
<template>
  <div>
    <svg width="200" height="200">
      <circle :cx="cx" :cy="cy" :r="radius" :fill="color" />
    </svg>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cx: 100,
      cy: 100,
      radius: 50,
      color: 'blue'
    }
  }
}
</script>
```

### 2. SVG 组件

```vue
<!-- CircleIcon.vue -->
<template>
  <svg :width="size" :height="size" viewBox="0 0 100 100">
    <circle cx="50" cy="50" :r="radius" :fill="fillColor" />
  </svg>
</template>

<script>
export default {
  name: 'CircleIcon',
  props: {
    size: {
      type: Number,
      default: 100
    },
    radius: {
      type: Number,
      default: 40
    },
    fillColor: {
      type: String,
      default: 'blue'
    }
  }
}
</script>
```

### 3. 动态 SVG

```vue
<template>
  <div>
    <svg width="400" height="200" viewBox="0 0 400 200">
      <!-- 使用 v-for 生成多个元素 -->
      <circle 
        v-for="(point, index) in points" 
        :key="index"
        :cx="point.x" 
        :cy="point.y" 
        :r="point.r" 
        :fill="point.color"
        @click="handleClick(index)"
      />
    </svg>
    
    <button @click="addPoint">添加点</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      points: [
        { x: 50, y: 50, r: 20, color: 'blue' },
        { x: 150, y: 50, r: 25, color: 'red' },
        { x: 250, y: 50, r: 30, color: 'green' }
      ]
    }
  },
  methods: {
    addPoint() {
      const colors = ['blue', 'red', 'green', 'yellow', 'purple']
      this.points.push({
        x: Math.random() * 300 + 50,
        y: Math.random() * 150 + 25,
        r: Math.random() * 20 + 15,
        color: colors[Math.floor(Math.random() * colors.length)]
      })
    },
    handleClick(index) {
      console.log('点击了第', index, '个点')
    }
  }
}
</script>
```

### 4. SVG 动画示例

```vue
<template>
  <div>
    <svg width="200" height="200" viewBox="0 0 200 200">
      <circle 
        cx="100" 
        cy="100" 
        :r="radius" 
        fill="blue"
        :style="{ transition: 'r 0.3s ease' }"
      />
    </svg>
    
    <button @click="toggleSize">切换大小</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      radius: 30
    }
  },
  methods: {
    toggleSize() {
      this.radius = this.radius === 30 ? 50 : 30
    }
  }
}
</template>
```

### 5. 使用 SVG 作为图标

```vue
<template>
  <div>
    <!-- 方法1: 直接内联 -->
    <svg class="icon" viewBox="0 0 24 24">
      <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
    </svg>
    
    <!-- 方法2: 使用组件 -->
    <IconShield :size="24" color="#42b983" />
  </div>
</template>

<script>
// IconShield.vue
export default {
  name: 'IconShield',
  props: {
    size: {
      type: Number,
      default: 24
    },
    color: {
      type: String,
      default: 'currentColor'
    }
  }
}
</script>

<style scoped>
.icon {
  width: 24px;
  height: 24px;
  fill: currentColor;
}
</style>
```

---

## 实战示例

### 示例1: 进度条

```vue
<template>
  <div>
    <svg width="300" height="20" viewBox="0 0 300 20">
      <!-- 背景 -->
      <rect x="0" y="0" width="300" height="20" fill="#e0e0e0" rx="10" />
      <!-- 进度 -->
      <rect 
        x="0" 
        y="0" 
        :width="progress * 3" 
        height="20" 
        fill="#42b983" 
        rx="10"
        :style="{ transition: 'width 0.3s ease' }"
      />
    </svg>
    <input type="range" v-model="progress" min="0" max="100" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      progress: 50
    }
  }
}
</script>
```

### 示例2: 饼图

```vue
<template>
  <div>
    <svg width="200" height="200" viewBox="0 0 200 200">
      <circle 
        cx="100" 
        cy="100" 
        r="80" 
        fill="none" 
        stroke="#e0e0e0" 
        stroke-width="40"
      />
      <circle 
        cx="100" 
        cy="100" 
        r="80" 
        fill="none" 
        stroke="#42b983" 
        stroke-width="40"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="offset"
        transform="rotate(-90 100 100)"
        :style="{ transition: 'stroke-dashoffset 0.5s ease' }"
      />
    </svg>
    <input type="range" v-model="percentage" min="0" max="100" />
    <p>{{ percentage }}%</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      percentage: 75
    }
  },
  computed: {
    circumference() {
      return 2 * Math.PI * 80
    },
    offset() {
      return this.circumference - (this.percentage / 100) * this.circumference
    }
  }
}
</script>
```

### 示例3: 交互式图表

```vue
<template>
  <div>
    <svg width="400" height="300" viewBox="0 0 400 300">
      <!-- 坐标轴 -->
      <line x1="50" y1="250" x2="350" y2="250" stroke="black" stroke-width="2" />
      <line x1="50" y1="250" x2="50" y2="50" stroke="black" stroke-width="2" />
      
      <!-- 数据点 -->
      <circle 
        v-for="(point, index) in dataPoints" 
        :key="index"
        :cx="point.x" 
        :cy="point.y" 
        r="5" 
        fill="blue"
        @mouseenter="showTooltip(index, $event)"
        @mouseleave="hideTooltip"
      />
      
      <!-- 连接线 -->
      <polyline 
        :points="polylinePoints" 
        fill="none" 
        stroke="blue" 
        stroke-width="2"
      />
      
      <!-- 提示框 -->
      <g v-if="tooltip.show">
        <rect 
          :x="tooltip.x - 30" 
          :y="tooltip.y - 40" 
          width="60" 
          height="30" 
          fill="rgba(0,0,0,0.8)" 
          rx="5"
        />
        <text 
          :x="tooltip.x" 
          :y="tooltip.y - 20" 
          fill="white" 
          text-anchor="middle"
          font-size="12"
        >
          {{ tooltip.value }}
        </text>
      </g>
    </svg>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: [20, 35, 45, 60, 50, 70, 80],
      tooltip: {
        show: false,
        x: 0,
        y: 0,
        value: 0
      }
    }
  },
  computed: {
    dataPoints() {
      const spacing = 300 / (this.data.length - 1)
      return this.data.map((value, index) => ({
        x: 50 + index * spacing,
        y: 250 - (value / 100) * 200,
        value
      }))
    },
    polylinePoints() {
      return this.dataPoints.map(p => `${p.x},${p.y}`).join(' ')
    }
  },
  methods: {
    showTooltip(index, event) {
      const point = this.dataPoints[index]
      this.tooltip = {
        show: true,
        x: point.x,
        y: point.y - 10,
        value: point.value
      }
    },
    hideTooltip() {
      this.tooltip.show = false
    }
  }
}
</script>
```

---

## 最佳实践

### 1. 使用 viewBox 实现响应式

```vue
<template>
  <!-- 使用 viewBox 而不是固定的 width/height -->
  <svg viewBox="0 0 100 100" class="responsive-svg">
    <!-- SVG 内容 -->
  </svg>
</template>

<style>
.responsive-svg {
  width: 100%;
  height: auto;
  max-width: 500px;
}
</style>
```

### 2. 优化 SVG 代码

- **移除不必要的属性**：删除编辑器生成的冗余代码
- **合并路径**：将多个路径合并为一个
- **使用 `<use>` 复用元素**：避免重复代码
- **压缩 SVG**：使用工具如 SVGO 压缩文件

### 3. 性能优化

```vue
<template>
  <!-- 对于大量元素，使用 v-show 而不是 v-if -->
  <g v-show="visible">
    <circle v-for="item in items" :key="item.id" />
  </g>
  
  <!-- 使用 CSS 变换而不是改变属性 -->
  <g :style="{ transform: `translate(${x}px, ${y}px)` }">
    <!-- 内容 -->
  </g>
</template>
```

### 4. 可访问性

```vue
<template>
  <svg role="img" :aria-label="description">
    <title>{{ description }}</title>
    <!-- SVG 内容 -->
  </svg>
</template>
```

### 5. 常用工具和资源

- **SVG 编辑器**：
  - Inkscape（免费）
  - Adobe Illustrator
  - Figma
  - SVG-Edit（在线）

- **优化工具**：
  - SVGO（命令行工具）
  - SVGOMG（在线工具）

- **图标库**：
  - Heroicons
  - Feather Icons
  - Material Icons
  - Font Awesome

- **学习资源**：
  - MDN SVG 文档：https://developer.mozilla.org/zh-CN/docs/Web/SVG
  - SVG 教程：https://www.w3schools.com/graphics/svg_intro.asp

---

## 总结

SVG 是一个强大的图形技术，掌握其基本语法和常用元素后，可以创建各种复杂的图形和动画。在 Vue 项目中，SVG 可以很好地与响应式数据结合，创建动态的、交互式的图形界面。

### 关键要点

1. **基本结构**：`<svg>` 标签 + `viewBox` 属性
2. **常用元素**：`<rect>`, `<circle>`, `<path>`, `<text>` 等
3. **样式控制**：`fill`, `stroke`, `transform` 等属性
4. **动画**：CSS 动画或 SVG 动画元素
5. **Vue 集成**：使用 `v-bind` 绑定数据，`v-for` 生成列表

### 下一步学习

- 深入学习 `<path>` 元素的复杂路径
- 学习 SVG 滤镜和特效
- 探索 SVG 与 Canvas 的结合使用
- 学习 D3.js 等 SVG 可视化库

---

**文档版本**: 1.0  
**最后更新**: 2024

