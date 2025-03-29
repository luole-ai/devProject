// 设备类型检测工具
import { ref, onMounted, onUnmounted, readonly } from 'vue'

// 设备类型常量
export const DEVICE_TYPE = {
  MOBILE: 'mobile',
  TABLET: 'tablet',
  DESKTOP: 'desktop'
}

// 设备方向常量
export const ORIENTATION = {
  PORTRAIT: 'portrait',
  LANDSCAPE: 'landscape'
}

// 断点配置
const BREAKPOINTS = {
  MOBILE_MAX: 767,
  TABLET_MIN: 768,
  TABLET_MAX: 1023,
  DESKTOP_MIN: 1024
}

// 获取设备类型
export function getDeviceType() {
  const width = window.innerWidth
  
  if (width < BREAKPOINTS.MOBILE_MAX) {
    return DEVICE_TYPE.MOBILE
  } else if (width >= BREAKPOINTS.TABLET_MIN && width <= BREAKPOINTS.TABLET_MAX) {
    return DEVICE_TYPE.TABLET
  } else {
    return DEVICE_TYPE.DESKTOP
  }
}

// 获取设备方向
export function getOrientation() {
  return window.innerHeight > window.innerWidth 
    ? ORIENTATION.PORTRAIT 
    : ORIENTATION.LANDSCAPE
}

// 在现有代码中添加节流函数
function throttle(fn, delay) {
  let lastCall = 0;
  return function (...args) {
    const now = new Date().getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return fn(...args);
  };
}

// 响应式设备信息 hook
export function useDeviceInfo() {
  const deviceType = ref(getDeviceType())
  const orientation = ref(getOrientation())
  const isMobile = ref(deviceType.value === DEVICE_TYPE.MOBILE)
  const isTablet = ref(deviceType.value === DEVICE_TYPE.TABLET)
  const isDesktop = ref(deviceType.value === DEVICE_TYPE.DESKTOP)
  const isPortrait = ref(orientation.value === ORIENTATION.PORTRAIT)
  const isLandscape = ref(orientation.value === ORIENTATION.LANDSCAPE)
  
  // 使用防抖处理窗口大小变化
  let resizeTimeout = null
  
  const updateDeviceInfo = () => {
    if (resizeTimeout) {
      clearTimeout(resizeTimeout)
    }
    
    resizeTimeout = setTimeout(() => {
      const newDeviceType = getDeviceType()
      const newOrientation = getOrientation()
      
      deviceType.value = newDeviceType
      orientation.value = newOrientation
      isMobile.value = newDeviceType === DEVICE_TYPE.MOBILE
      isTablet.value = newDeviceType === DEVICE_TYPE.TABLET
      isDesktop.value = newDeviceType === DEVICE_TYPE.DESKTOP
      isPortrait.value = newOrientation === ORIENTATION.PORTRAIT
      isLandscape.value = newOrientation === ORIENTATION.LANDSCAPE
    }, 150) // 150ms 防抖
  }
  
  onMounted(() => {
    const throttledUpdateDeviceInfo = throttle(updateDeviceInfo, 100);
    window.addEventListener('resize', throttledUpdateDeviceInfo);
    window.addEventListener('orientationchange', throttledUpdateDeviceInfo);
    // 初始化
    updateDeviceInfo();
  })
  
  onUnmounted(() => {
    window.removeEventListener('resize', updateDeviceInfo)
    window.removeEventListener('orientationchange', updateDeviceInfo)
    if (resizeTimeout) {
      clearTimeout(resizeTimeout)
    }
  })
  
  return {
    deviceType: readonly(deviceType),
    orientation: readonly(orientation),
    isMobile: readonly(isMobile),
    isTablet: readonly(isTablet),
    isDesktop: readonly(isDesktop),
    isPortrait: readonly(isPortrait),
    isLandscape: readonly(isLandscape)
  }
} 