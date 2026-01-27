import { createStore } from 'vuex'
import { DEVICE_TYPE, ORIENTATION, getDeviceType, getOrientation } from '../utils/device'
import gettersFromFile from './getters'  // 重命名避免冲突
import app from './modules/app'
import user from './modules/user'
import task from './modules/task'

// 合并所有 getters
const allGetters = {
  ...gettersFromFile,
  isMobile: state => state.deviceType === DEVICE_TYPE.MOBILE,
  isTablet: state => state.deviceType === DEVICE_TYPE.TABLET,
  isDesktop: state => state.deviceType === DEVICE_TYPE.DESKTOP,
  isPortrait: state => state.orientation === ORIENTATION.PORTRAIT,
  isLandscape: state => state.orientation === ORIENTATION.LANDSCAPE,
  isDarkTheme: state => state.theme === 'dark'
}

export default createStore({
  state: {
    deviceType: getDeviceType(),
    orientation: getOrientation(),
    theme: 'light',
    loading: false
  },
  mutations: {
    setDeviceType(state, type) {
      state.deviceType = type
    },
    setOrientation(state, orientation) {
      state.orientation = orientation
    },
    setTheme(state, theme) {
      state.theme = theme
      // 保存主题到本地存储
      localStorage.setItem('app-theme', theme)
      // 应用主题到 HTML 元素
      document.documentElement.setAttribute('data-theme', theme)
    },
    setLoading(state, status) {
      state.loading = status
    }
  },
  actions: {
    detectDevice({ commit }) {
      commit('setDeviceType', getDeviceType())
      commit('setOrientation', getOrientation())
    },
    initTheme({ commit }) {
      // 从本地存储获取主题
      const savedTheme = localStorage.getItem('app-theme') || 'light'
      commit('setTheme', savedTheme)
    },
    toggleTheme({ commit, state }) {
      const newTheme = state.theme === 'light' ? 'dark' : 'light'
      commit('setTheme', newTheme)
    }
  },
  getters: allGetters,
  modules: {
    app,
    user,
    task
  }
}) 