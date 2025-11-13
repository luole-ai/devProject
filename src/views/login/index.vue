<template>
  <div class="login-container">
    <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left" status-icon>
      <div class="title-container">
        <h3 class="title">后台管理系统</h3>
      </div>

      <el-alert v-if="errorMessage" type="error" :closable="false" show-icon style="margin-bottom: 16px;" :title="errorMessage" />

      <el-form-item prop="username">
        <el-input
          ref="usernameRef"
          v-model="loginForm.username"
          placeholder="用户名"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
          clearable
          @keydown.enter="handleLogin"
        >
          <template #prefix>
            <el-icon>
              <component :is="UserIcon" />
            </el-icon>
          </template>
        </el-input>
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
          clearable
          @keydown.enter="handleLogin"
        >
          <template #suffix>
            <el-icon class="eye-icon" @click="passwordVisible = !passwordVisible">
              <component :is="passwordVisible ? View : Hide" />
            </el-icon>
          </template>
          <template #prefix>
            <el-icon>
              <component :is="LockIcon" />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-button :loading="loading" :disabled="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.prevent="handleLogin">登录</el-button>
    </el-form>
  </div>
</template>

<script>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { View, Hide, User as UserIcon, Lock as LockIcon } from '@element-plus/icons-vue'
import { login } from '@/api/login'
export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()

    const loginFormRef = ref(null)
    const passwordVisible = ref(false)
    const loading = ref(false)
    const usernameRef = ref(null)
    const passwordRef = ref(null)
    const errorMessage = ref('')

    const loginForm = reactive({
      username: '',
      password: ''
    })

    const loginRules = {
      username: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
      password: [
        { required: true, trigger: 'blur', message: '请输入密码' },
        { min: 6, trigger: 'blur', message: '密码长度不能少于6位' }
      ]
    }

    onMounted(() => {
      if (loginForm.username === '') {
        usernameRef.value.focus()
      } else if (loginForm.password === '') {
        passwordRef.value.focus()
      }
    })

    const handleLogin = () => {
      errorMessage.value = ''
      loginFormRef.value.validate(valid => {
        if (valid) {
          loading.value = true
          login(
           loginForm
          ).then(res => {
            ElMessage.success('登录成功')
            const redirectPath = route.query.redirect || '/home'
            router.push(redirectPath)
            loading.value = false
          }).catch(error => {
            errorMessage.value = error?.message || '登录失败'
            ElMessage.error(errorMessage.value)
            loading.value = false
            })
        } else {
          return false
        }
      })
    }

    watch(() => [loginForm.username, loginForm.password], () => {
      errorMessage.value = ''
    })

    return {
      loginForm,
      loginRules,
      loginFormRef,
      loading,
      usernameRef,
      passwordRef,
      passwordVisible,
      handleLogin,
      errorMessage,
      View,
      Hide,
      UserIcon,
      LockIcon
    }
  }
}
</script>

<style scoped>
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