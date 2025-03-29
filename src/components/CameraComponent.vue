<template>
  <div class="camera-component">
    <video ref="video" autoplay playsinline></video>
    <div class="camera-controls">
      <van-button type="primary" @click="startCamera">打开相机</van-button>
      <van-button type="success" @click="takePhoto">拍照</van-button>
    </div>
    <canvas ref="canvas" style="display:none"></canvas>
    <div v-if="photoUrl" class="photo-preview">
      <img :src="photoUrl" alt="captured photo">
    </div>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import { showToast,showLoadingToast } from 'vant'

export default {
  name: 'CameraComponent',
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
        ElMessage.success('相机启动成功')
        showLoadingToast('相机启动成功')
      } catch (err) {
        console.error('相机启动失败:', err)
        ElMessage.error(`相机启动失败: ${err.message}`)
      }
    },
    takePhoto() {
      if (!this.stream) {
        ElMessage.warning('请先打开相机')
        return
      }
      
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
      
      ElMessage({
        message: '照片拍摄成功',
        type: 'success',
        duration: 2000
      })
    }
  },
  beforeUnmount() {
    // 组件销毁时关闭摄像头
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop())
    }
  }
}
</script>

<style scoped>
.camera-component {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

video {
  width: 100%;
  max-width: 500px;
  border-radius: 8px;
  margin-bottom: 15px;
}

.camera-controls {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.photo-preview {
  margin-top: 15px;
  width: 100%;
}

img {
  width: 100%;
  max-width: 500px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
</style> 