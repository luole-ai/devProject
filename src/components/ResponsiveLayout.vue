<template>
  <div class="responsive-layout">
    <div class="container">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResponsiveLayout',
  data() {
    return {
      deviceType: 'mobile'
    }
  },
  mounted() {
    this.checkDeviceType();
    window.addEventListener('resize', this.checkDeviceType);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkDeviceType);
  },
  methods: {
    checkDeviceType() {
      const width = window.innerWidth;
      if (width < 768) {
        this.deviceType = 'mobile';
      } else if (width >= 768 && width < 1200) {
        this.deviceType = 'tablet';
      } else {
        this.deviceType = 'desktop';
      }
      // 将设备类型作为自定义事件发送出去
      this.$emit('device-change', this.deviceType);
    }
  }
}
</script>

<style scoped>
@import '../assets/styles/responsive.css';

.responsive-layout {
  width: 100%;
}
</style> 