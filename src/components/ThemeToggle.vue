<template>
  <div class="theme-toggle">
    <van-button 
      :icon="isDarkTheme ? 'sunny-o' : 'moon-o'" 
      size="small" 
      @click="toggleTheme"
      :class="{ 'dark': isDarkTheme }"
    >
      {{ isDarkTheme ? '亮色模式' : '暗色模式' }}
    </van-button>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'ThemeToggle',
  setup() {
    const store = useStore()
    
    const isDarkTheme = computed(() => store.getters.isDarkTheme)
    
    const toggleTheme = () => {
      store.dispatch('toggleTheme')
    }
    
    return {
      isDarkTheme,
      toggleTheme
    }
  }
}
</script>

<style scoped>
.theme-toggle {
  margin: 10px;
}

.theme-toggle .van-button {
  transition: all 0.3s ease;
}

.theme-toggle .van-button.dark {
  background-color: #333;
  color: #fff;
}
</style> 