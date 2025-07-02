<template>
  <div 
    class="floating-ball" 
    :class="{ 'is-expanded': isExpanded }" 
    :style="ballStyle"
    @mousedown.prevent="startDrag"
    @touchstart.prevent="startDrag"
    @click="toggleMenu"
  >
    <div class="main-ball">
      <i class="el-icon-plus" v-if="!isExpanded"></i>
      <i class="el-icon-close" v-else></i>
    </div>
    <transition name="menu">
      <div class="sub-menu" v-show="isExpanded" :class="menuPositionClass">
        <div class="sub-menu-item" v-for="(item, index) in menuItems" :key="index" @click.stop="handleMenuItemClick(item)">
          <i :class="item.icon"></i>
          <span>{{ item.label }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'FloatingBall',
  data() {
    return {
      isExpanded: false,
      menuItems: [
        { label: '首页', icon: 'el-icon-s-home', action: 'home' },
        { label: '消息', icon: 'el-icon-message', action: 'message' },
        { label: '设置', icon: 'el-icon-setting', action: 'settings' }
      ],
      position: {
        x: window.innerWidth - 80,
        y: window.innerHeight - 80
      },
      isDragging: false,
      dragOffset: { x: 0, y: 0 },
      snapThreshold: 50, // 吸附阈值
      isSnapped: false
    }
  },
  computed: {
    ballStyle() {
      return {
        left: this.position.x + 'px',
        top: this.position.y + 'px'
      }
    },
    menuPositionClass() {
      const { x, y } = this.position
      const classes = []
      
      // 处理水平方向
      if (x < 200) {
        classes.push('menu-right')
      } else {
        classes.push('menu-left')
      }
      
      // 处理垂直方向
      if (y < 200) {
        classes.push('menu-bottom')
      } else {
        classes.push('menu-top')
      }
      
      return classes
    }
  },
  mounted() {
    window.addEventListener('resize', this.updatePosition)
    this.updatePosition()
    // 添加点击外部关闭菜单的事件监听
    document.addEventListener('click', this.handleOutsideClick)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updatePosition)
    document.removeEventListener('click', this.handleOutsideClick)
    this.removeDragListeners()
  },
  methods: {
    handleOutsideClick(e) {
      // 如果点击的不是悬浮球或其子元素，则关闭菜单
      if (!this.$el.contains(e.target)) {
        this.isExpanded = false
      }
    },
    getEventPosition(e) {
      if (e.touches && e.touches[0]) {
        return {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        }
      }
      return {
        x: e.clientX,
        y: e.clientY
      }
    },
    toggleMenu(e) {
      if (!this.isDragging) {
        e.stopPropagation() // 阻止事件冒泡
        this.isExpanded = !this.isExpanded
      }
    },
    handleMenuItemClick(item) {
      this.$emit('menu-item-click', item.action)
      this.isExpanded = false
    },
    startDrag(e) {
      this.isDragging = true
      this.isExpanded = false
      
      const pos = this.getEventPosition(e)
      this.dragOffset = {
        x: pos.x - this.position.x,
        y: pos.y - this.position.y
      }
      
      document.addEventListener('mousemove', this.onDrag)
      document.addEventListener('touchmove', this.onDrag)
      document.addEventListener('mouseup', this.stopDrag)
      document.addEventListener('touchend', this.stopDrag)
    },
    onDrag(e) {
      if (!this.isDragging) return
      
      e.preventDefault()
      const pos = this.getEventPosition(e)
      
      this.position = {
        x: pos.x - this.dragOffset.x,
        y: pos.y - this.dragOffset.y
      }
      
      this.checkSnap()
    },
    stopDrag() {
      this.isDragging = false
      this.removeDragListeners()
      this.snapToEdge()
    },
    removeDragListeners() {
      document.removeEventListener('mousemove', this.onDrag)
      document.removeEventListener('touchmove', this.onDrag)
      document.removeEventListener('mouseup', this.stopDrag)
      document.removeEventListener('touchend', this.stopDrag)
    },
    checkSnap() {
      const { x, y } = this.position
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight
      
      // 检查是否靠近左边缘
      if (x < this.snapThreshold) {
        this.isSnapped = true
        this.position.x = 0
      }
      // 检查是否靠近右边缘
      else if (x > windowWidth - 70 - this.snapThreshold) {
        this.isSnapped = true
        this.position.x = windowWidth - 70
      }
      // 检查是否靠近上边缘
      else if (y < this.snapThreshold) {
        this.isSnapped = true
        this.position.y = 0
      }
      // 检查是否靠近下边缘
      else if (y > windowHeight - 70 - this.snapThreshold) {
        this.isSnapped = true
        this.position.y = windowHeight - 70
      }
      else {
        this.isSnapped = false
      }
    },
    snapToEdge() {
      if (this.isSnapped) {
        const { x, y } = this.position
        const windowWidth = window.innerWidth
        const windowHeight = window.innerHeight
        
        // 确定最近的边缘
        const distances = {
          left: x,
          right: windowWidth - x - 70,
          top: y,
          bottom: windowHeight - y - 70
        }
        
        const minDistance = Math.min(...Object.values(distances))
        const nearestEdge = Object.keys(distances).find(key => distances[key] === minDistance)
        
        // 吸附到最近的边缘
        switch (nearestEdge) {
          case 'left':
            this.position.x = 0
            break
          case 'right':
            this.position.x = windowWidth - 70
            break
          case 'top':
            this.position.y = 0
            break
          case 'bottom':
            this.position.y = windowHeight - 70
            break
        }
      }
    },
    updatePosition() {
      // 确保悬浮球不会超出屏幕边界
      this.position.x = Math.min(
        Math.max(0, this.position.x),
        window.innerWidth - 70
      )
      this.position.y = Math.min(
        Math.max(0, this.position.y),
        window.innerHeight - 70
      )
    }
  }
}
</script>

<style scoped>
.floating-ball {
  position: fixed;
  z-index: 1000;
  user-select: none;
  touch-action: none;
}

.main-ball {
  width: 50px;
  height: 50px;
  background-color: #409EFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: move;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.main-ball:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.2);
}

.main-ball i {
  color: white;
  font-size: 24px;
  transition: transform 0.3s ease;
}

.is-expanded .main-ball i {
  transform: rotate(45deg);
}

.sub-menu {
  position: absolute;
  background-color: white;
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.1);
  min-width: 160px;
}

/* 菜单动画 */
.menu-enter-active,
.menu-leave-active {
  transition: all 0.3s ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.menu-enter-to,
.menu-leave-from {
  opacity: 1;
  transform: scale(1);
}

/* 菜单位置样式 */
.menu-left {
  right: 60px;
  bottom: 0;
}

.menu-right {
  left: 60px;
  bottom: 0;
}

.menu-top {
  bottom: 60px;
}

.menu-bottom {
  top: 60px;
}

.sub-menu-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  margin: 4px 0;
}

.sub-menu-item:hover {
  background-color: #f5f7fa;
  transform: translateX(4px);
}

.sub-menu-item i {
  margin-right: 12px;
  color: #409EFF;
  font-size: 18px;
}

.sub-menu-item span {
  color: #606266;
  font-size: 14px;
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
  .main-ball {
    width: 40px;
    height: 40px;
  }

  .main-ball i {
    font-size: 20px;
  }

  .sub-menu {
    min-width: 140px;
  }

  .sub-menu-item {
    padding: 10px 14px;
  }

  .sub-menu-item i {
    font-size: 16px;
  }

  .sub-menu-item span {
    font-size: 13px;
  }
}
</style> 