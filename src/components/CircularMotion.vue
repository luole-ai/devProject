<template>
  <div class="circular-motion-3d-wrapper">
    <div class="circular-motion-container" :style="container3DStyle">
      <div class="center-element">中心元素</div>
      <div
        class="ball"
        :style="{
          left: ballPosition.x + 'px',
          top: ballPosition.y + 'px',
        }"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CircularMotion',
  data() {
    return {
      angle: 0,
      radius: 80, // 小球运动半径
      center: { x: 120, y: 120 }, // 圆心坐标
      ballPosition: { x: 0, y: 0 },
      animationFrame: null,
      rotateY: 0,
      rotateX: 20, // 立体倾斜角度
    };
  },
  computed: {
    container3DStyle() {
      return {
        transform: `rotateY(${this.rotateY}deg) rotateX(${this.rotateX}deg)`,
        transformStyle: 'preserve-3d',
      };
    },
  },
  mounted() {
    this.updateBallPosition();
    this.animate();
    this.animate3D();
  },
  beforeDestroy() {
    cancelAnimationFrame(this.animationFrame);
    cancelAnimationFrame(this.animation3DFrame);
  },
  methods: {
    updateBallPosition() {
      this.ballPosition.x = this.center.x + this.radius * Math.cos(this.angle);
      this.ballPosition.y = this.center.y + this.radius * Math.sin(this.angle);
    },
    animate() {
      this.angle += 0.02;
      this.updateBallPosition();
      this.animationFrame = requestAnimationFrame(this.animate);
    },
    animate3D() {
      this.rotateY += 0.5;
      if (this.rotateY >= 360) this.rotateY = 0;
      this.animation3DFrame = requestAnimationFrame(this.animate3D);
    },
  },
};
</script>

<style scoped>
.circular-motion-3d-wrapper {
  perspective: 600px;
  width: 260px;
  height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.circular-motion-container {
  position: relative;
  width: 240px;
  height: 240px;
  border: 1px solid #ccc;
  margin: 0 auto;
  background: #f9f9f9;
  will-change: transform;
}
.center-element {
  position: absolute;
  left: 110px;
  top: 110px;
  width: 20px;
  height: 20px;
  background: #3498db;
  border-radius: 50%;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  z-index: 2;
}
.ball {
  position: absolute;
  width: 24px;
  height: 24px;
  background: #e74c3c;
  border-radius: 50%;
  z-index: 1;
  transition: box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}
</style> 