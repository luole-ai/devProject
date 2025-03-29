<template>
  <div>
    <video ref="video" autoplay playsinline></video>
    <el-button @click="startCamera">打开相机</el-button>
    <!-- <el-button @click="takePhoto">拍照</el-button> -->
    <canvas ref="canvas" style="display:none"></canvas>
    <img v-if="photoUrl" :src="photoUrl" alt="captured photo">
  </div>
</template>

<script>
export default {
  data() {
    return {
      stream: null,
      photoUrl: ''
    }
  },
  methods: {
    async startCamera() {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment' // 使用后置摄像头，'user'为前置
          },
          audio: false
        })
        this.$refs.video.srcObject = this.stream
      } catch (err) {
        console.error('相机启动失败:', err)
      }
    },
    takePhoto() {
      const video = this.$refs.video
      const canvas = this.$refs.canvas
      
      // 设置canvas尺寸与视频一致
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      // 将视频帧绘制到canvas
      const context = canvas.getContext('2d')
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      
      // 将canvas转换为图片URL
      this.photoUrl = canvas.toDataURL('image/jpeg')
      
      // 如果需要转换为文件上传
      // canvas.toBlob((blob) => {
      //   const formData = new FormData()
      //   formData.append('image', blob, 'photo.jpg')
      //   // 这里可以添加上传逻辑
      // }, 'image/jpeg')
    }
  },
  beforeDestroy() {
    // 组件销毁时关闭摄像头
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop())
    }
  }
}
</script>

<style scoped>
video {
  width: 100%;
  max-width: 500px;
}
img {
  width: 100%;
  max-width: 500px;
}
</style> 