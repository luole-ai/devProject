<template>
  <div class="responsive-card" :class="deviceType">
    <div class="card-header">
      <h3>{{ title }}</h3>
    </div>
    <div class="card-content">
      <slot></slot>
    </div>
    <div class="card-footer">
      <van-button size="small" v-if="isMobile">{{ mobileActionText }}</van-button>
      <van-button type="primary" v-if="isTablet || isDesktop">{{ actionText }}</van-button>
    </div>
  </div>
</template>

<script>
import { useDeviceInfo } from '../utils/device'

export default {
  name: 'ResponsiveCard',
  props: {
    title: {
      type: String,
      required: true
    },
    actionText: {
      type: String,
      default: '查看详情'
    },
    mobileActionText: {
      type: String,
      default: '点击'
    }
  },
  setup() {
    const { deviceType, isMobile, isTablet, isDesktop } = useDeviceInfo()
    
    return {
      deviceType,
      isMobile,
      isTablet,
      isDesktop
    }
  }
}
</script>

<style scoped>
.responsive-card {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.card-header {
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.card-content {
  padding: 15px;
}

.card-footer {
  padding: 15px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
}

/* 移动端样式 */
.responsive-card.mobile {
  margin-bottom: 10px;
  width: 100%;
}

/* 平板端样式 */
.responsive-card.tablet {
  margin-bottom: 15px;
  width: 100%;
}

/* 桌面端样式 */
.responsive-card.desktop {
  margin-bottom: 20px;
}

.responsive-card.desktop:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

/* 横屏移动设备特殊处理 */
@media (orientation: landscape) and (max-width: 767px) {
  .responsive-card.mobile {
    width: calc(50% - 20px);
  }
}
</style> 