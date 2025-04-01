<template>
  <div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :active-text-color="variables.menuActiveText"
        :unique-opened="false"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import variables from '../../../styles/variables.scss'
import SidebarItem from './SidebarItem.vue'

export default {
  components: { SidebarItem },
  setup() {
    const route = useRoute()
    const store = useStore()

    const routes = computed(() => {
      return store.getters.permission_routes
    })

    const activeMenu = computed(() => {
      const { meta, path } = route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    })

    const isCollapse = computed(() => {
      return !store.state.app.sidebar.opened
    })

    return {
      routes,
      activeMenu,
      isCollapse,
      variables
    }
  }
}
</script> 