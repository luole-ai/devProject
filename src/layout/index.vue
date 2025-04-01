<template>
  <div class="app-wrapper" :class="{ mobile: isMobile }">
    <div v-if="device === 'mobile' && sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <div class="fixed-header">
        <navbar />
      </div>
      <app-main />
    </div>
  </div>
</template>

<script>
import { computed, onBeforeMount, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Sidebar from './components/Sidebar/index.vue'
import AppMain from './components/AppMain.vue'
import ResizeMixin from './mixins/resize'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  setup() {
    const store = useStore()
    const route = useRoute()

    const sidebar = computed(() => store.state.app.sidebar)
    const device = computed(() => store.state.app.device)
    const isMobile = computed(() => device.value === 'mobile')

    const handleClickOutside = () => {
      store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }

    // 监听窗口大小变化
    const { $_initResizeEvent, $_destroyResizeEvent, $_resizeHandler } = ResizeMixin()
    
    onBeforeMount(() => {
      $_initResizeEvent()
      $_resizeHandler()
    })
    
    onMounted(() => {
      if (isMobile.value) {
        store.dispatch('app/closeSideBar', { withoutAnimation: true })
      }
    })
    
    onBeforeUnmount(() => {
      $_destroyResizeEvent()
    })

    return {
      sidebar,
      device,
      isMobile,
      handleClickOutside
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../styles/variables.scss";

.app-wrapper {
  position: relative;
  height: 100vh;
  width: 100%;
  
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}

.sidebar-container {
  transition: width 0.28s;
  width: $sideBarWidth !important;
  height: 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
  
  // reset element-ui css
  .horizontal-collapse-transition {
    transition: 0s width ease-in-out, 0s padding-left ease-in-out, 0s padding-right ease-in-out;
  }

  .el-scrollbar__bar.is-vertical {
    right: 0px;
  }

  .el-scrollbar {
    height: 100%;
  }

  &.has-logo {
    .el-scrollbar {
      height: calc(100% - 50px);
    }
  }

  .is-horizontal {
    display: none;
  }

  a {
    display: inline-block;
    width: 100%;
    overflow: hidden;
  }

  .el-menu {
    border: none;
    height: 100%;
    width: 100% !important;
  }
}

.main-container {
  min-height: 100%;
  transition: margin-left .28s;
  margin-left: $sideBarWidth;
  position: relative;
  padding-top: 50px;
}

.hideSidebar {
  .sidebar-container {
    width: 54px !important;
  }

  .main-container {
    margin-left: 54px;
  }

  .submenu-title-noDropdown {
    padding: 0 !important;
    position: relative;

    .el-tooltip {
      padding: 0 !important;
    }
  }

  .el-submenu {
    overflow: hidden;

    & > .el-submenu__title {
      padding: 0 !important;

      .el-submenu__icon-arrow {
        display: none;
      }
    }
  }
}

.mobile {
  .main-container {
    margin-left: 0px;
  }

  .sidebar-container {
    transition: transform .28s;
    width: $sideBarWidth !important;
  }

  &.hideSidebar {
    .sidebar-container {
      pointer-events: none;
      transition-duration: 0.3s;
      transform: translate3d(-$sideBarWidth, 0, 0);
    }
  }
}
</style>

<style lang="scss">
@import "../styles/variables.scss";

// 当菜单收起时
.hideSidebar {
  .el-menu--collapse {
    .el-submenu {
      & > .el-submenu__title {
        & > span {
          height: 0;
          width: 0;
          overflow: hidden;
          visibility: hidden;
          display: inline-block;
        }
      }
    }
  }
}
</style> 