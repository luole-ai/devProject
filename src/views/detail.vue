<template>
    <div class="login-container">
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">
        <!-- <div class="title-container">
          <h3 class="title">后台管理系统</h3>
        </div> -->
        <input type="file" id="fileInput" class="file-upload" accept="image/*" capture="camera" @change="handleImage">
        <input type="file" @change="fn">
        <div class="imgBox">
          <div v-for="(item, index) in srcList" :key="index" class="image-container">
            <el-image
              style="width: 100px; height: 100px"
              :src="item"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              :preview-src-list="srcList"
              show-progress
              :initial-index="4"
              fit="cover"
            />
            <div class="delete-button" @click="deleteImage(index)">
              <el-icon><Delete /></el-icon>
            </div>
          </div>
        </div>
        <el-form-item prop="username">
          <el-input
            ref="usernameRef"
            v-model="loginForm.username"
            placeholder="用户名"
            name="username"
            type="text"
            tabindex="1"
            autocomplete="on"
          />
        </el-form-item>
  
        <el-form-item prop="password">
          <el-input
            ref="passwordRef"
            v-model="loginForm.password"
            placeholder="密码"
            name="password"
            tabindex="2"
            autocomplete="on"
            :type="passwordVisible ? 'text' : 'password'"
          >
            <template #suffix>
              <el-icon class="eye-icon" @click="passwordVisible = !passwordVisible">
                <component :is="passwordVisible ? 'View' : 'Hide'" />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
  
        <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.prevent="handleLogin">登录</el-button>
      </el-form>
    </div>
  </template>
  
  <script>
  import { ref, reactive, onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useStore } from 'vuex'
  import { ElMessage } from 'element-plus'
  import { Delete } from '@element-plus/icons-vue'
  import {router} from 'vue-router'
  export default {
    name: 'Login',
    components: {
      Delete
    },
    setup() {
      const fn = (event) => {
        console.log('File input changed:', event.target.files[0]);
        // Add file handling logic here if needed
      }
      
      const handleImage = (event) => {
        console.log('Image uploaded:', event.target.files[0]);
        if (event.target.files && event.target.files[0]) {
          const file = event.target.files[0];
          const imageUrl = URL.createObjectURL(file);
          srcList.value.push(imageUrl);
          // 保存原始文件对象以便后续上传
          imageFiles.value.push(file);
        }
      }

      const router = useRouter()
      const route = useRoute()
      const store = useStore()
      const srcList = ref([])
      // 存储原始文件对象
      const imageFiles = ref([])
      const loginFormRef = ref(null)
      const passwordVisible = ref(false)
      const loading = ref(false)
      const usernameRef = ref(null)
      const passwordRef = ref(null)
  
      const loginForm = reactive({
        username: 'admin',
        password: '123456'
      })
  
      const loginRules = {
        username: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
        password: [{ required: true, trigger: 'blur', message: '请输入密码' }]
      }
      
      onMounted(() => {
        if (loginForm.username === '') {
          usernameRef.value.focus()
        } else if (loginForm.password === '') {
          passwordRef.value.focus()
        }
      })

      const handleLogin = () => {
        // 创建FormData对象
        const formData = new FormData();
        
        // 添加登录信息
        formData.append('username', loginForm.username);
        formData.append('password', loginForm.password);
        
        // 批量添加图片文件
        if (imageFiles.value.length > 0) {
          imageFiles.value.forEach((file, index) => {
            formData.append(`image${index}`, file);
          });
          
          // 添加图片数量
          formData.append('imageCount', imageFiles.value.length);
        }
        
        // 打印FormData内容（仅用于调试）
        console.log('FormData创建成功');
        for (let pair of formData.entries()) {
          console.log(pair[0] + ': ' + pair[1]);
        }
        
        // loginFormRef.value.validate(valid => {
        //   if (valid) {
        //     loading.value = true
        //     store.dispatch('user/login', loginForm)
        //       .then(() => {
        //         const redirectPath = route.query.redirect || '/'
        //         router.push(redirectPath)
        //         loading.value = false
        //       })
        //       .catch(error => {
        //         ElMessage.error(error.message || '登录失败')
        //         loading.value = false
        //       })
        //   } else {
        //     return false
        //   }
        // })
        
        // 这里可以添加发送FormData到服务器的代码
        // 例如：
        // axios.post('/api/login-with-images', formData)
        //   .then(response => {
        //     console.log('上传成功', response);
        //     router.push('/detail');
        //   })
        //   .catch(error => {
        //     console.error('上传失败', error);
        //   });
        
        router.push('/detail')
      }

      // 删除图片函数
      const deleteImage = (index) => {
        srcList.value.splice(index, 1);
        imageFiles.value.splice(index, 1);
      }
  
      return {
        loginForm,
        loginRules,
        loginFormRef,
        loading,
        usernameRef,
        passwordRef,
        passwordVisible,
        handleLogin,
        fn,
        handleImage,
        srcList,
        imageFiles,
        deleteImage
      }
    }
  }
  </script>
  
  <style scoped>
  .imgBox{
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .image-container {
    position: relative;
    width: 100px;
    height: 100px;
  }

  .delete-button {
    position: absolute;
    top: 5px;
    right: 5px;
    background-color: rgba(255, 0, 0, 0.7);
    color: white;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .login-container {
    min-height: 100%;
    width: 100%;
    background-color: #f5f7f9;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 35px 35px 15px;
    margin: 0 auto;
    overflow: hidden;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 0 35px 0 rgba(0, 0, 0, 0.1);
  }
  
  .title-container {
    position: relative;
    text-align: center;
  }
  
  .title {
    font-size: 24px;
    color: #333;
    margin: 0 auto 30px;
    font-weight: bold;
  }
  
  .eye-icon {
    cursor: pointer;
  }
  </style> 