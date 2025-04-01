<template>
  <div class="app-container">
    <el-card>
      <div class="profile-header">
        <div class="avatar-container">
          <el-avatar :size="100" :src="userInfo.avatar"></el-avatar>
        </div>
        <div class="info-container">
          <h2>{{ userInfo.name }}</h2>
          <p>
            <el-tag v-for="role in userInfo.roles" :key="role" class="role-tag">
              {{ role }}
            </el-tag>
          </p>
        </div>
      </div>
      
      <el-divider></el-divider>
      
      <div class="profile-content">
        <h3>个人信息</h3>
        <el-form label-width="100px">
          <el-form-item label="用户名">
            <span>{{ userInfo.name }}</span>
          </el-form-item>
          <el-form-item label="角色">
            <span>{{ userInfo.roles.join(', ') }}</span>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'UserProfile',
  setup() {
    const store = useStore()
    
    const state = reactive({
      userInfo: {
        avatar: store.getters.avatar,
        name: store.getters.name,
        roles: store.getters.roles
      }
    })
    
    return {
      ...toRefs(state)
    }
  }
}
</script>

<style scoped>
.profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.avatar-container {
  margin-right: 20px;
}

.role-tag {
  margin-right: 5px;
}

.profile-content {
  padding: 10px 0;
}
</style> 