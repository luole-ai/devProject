<template>

  <div class="layout-shell">
    {{ isActiveIframe }} {{ activeTab }}
    <header class="layout-header">
      <div class="layout-brand">企业管理系统</div>
      <el-menu
        mode="horizontal"
        :default-active="activeNav"
        :ellipsis="false"
        @select="handleNavSelect"
      >
        <el-menu-item
          v-for="item in navItems"
          :key="item.key"
          :index="item.path"
        >
          {{ item.title }}
        </el-menu-item>
      </el-menu>
    </header>

    <section class="layout-tabs" v-if="tabs.length">
      <el-tabs
        v-model="activeTab"
        type="card"
        closable
        @tab-remove="handleTabRemove"
      >
        <el-tab-pane
          v-for="tab in tabs"
          :key="tab.fullPath"
          :label="tab.title"
          :name="tab.fullPath"
          :closable="tab.closable !== false"
        />
      </el-tabs>
    </section>

    <section class="layout-content">
      <div class="content-router" v-show="!isActiveIframe">
        <router-view v-slot="{ Component, route }">
          <keep-alive :include="cachedComponentNames">
            <component
              :is="Component"
              :key="route.meta.keepAliveName || route.name || route.fullPath"
            />
          </keep-alive>
        </router-view>
      </div>
      <div class="content-iframes" v-show="isActiveIframe">
        <IframePage
          v-for="panel in iframePanels"
          :key="panel.name"
          :src="panel.src"
          :title="panel.title"
          v-show="activeTab === panel.fullPath"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { ElMenu, ElMenuItem, ElTabPane, ElTabs } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { iframePages } from '@/router/iframePages'
import IframePage from '@/views/iframe/IframePage.vue'

const router = useRouter()
const route = useRoute()

const baseNavItems = [
  {
    key: 'home',
    title: '首页',
    path: '/layout/home',
    cacheName: 'LayoutHome',
    closable: false
  },
  {
    key: 'reports',
    title: '报表中心',
    path: '/layout/reports',
    cacheName: 'LayoutReports'
  },
  {
    key: 'workspace',
    title: '工作台',
    path: '/layout/workspace',
    cacheName: 'LayoutWorkspace'
  }
]

const iframeNavItems = iframePages.map(page => ({
  key: page.key,
  title: page.title,
  path: `/layout/iframe/${page.key}`,
  cacheName: `Iframe_${page.key}`,
  iframe: true,
  iframeUrl: page.url
}))

const navItems = [...baseNavItems, ...iframeNavItems]

const tabs = ref([])
const cachedComponentNames = ref([])
const activeTab = ref('')
const iframePanels = ref([])

const activeNav = computed(() => {
  const current = navItems.find(item => route.path.startsWith(item.path))
  return current ? current.path : '/layout/home'
})

const ensureTabExists = to => {
  const navItem = navItems.find(
    item => to.path.startsWith(item.path) || (item.iframe && to.params?.key === item.key)
  )
  const title = to.meta?.title || navItem?.title || to.name || '未命名页面'
  const cacheName = to.meta?.keepAliveName || navItem?.cacheName || to.name

  if (!title || !cacheName) {
    return
  }

  const tab = tabs.value.find(item => item.fullPath === to.fullPath)
  if (!tab) {
    tabs.value.push({
      title,
      fullPath: to.fullPath,
      path: to.path,
      name: cacheName,
      closable: to.meta?.closable !== false && navItem?.closable !== false,
      iframe: !!(to.meta?.iframe || navItem?.iframe)
    })
  }

  if (to.meta?.iframe || navItem?.iframe) {
    const exists = iframePanels.value.find(panel => panel.fullPath === to.fullPath)
    if (!exists) {
      iframePanels.value.push({
        name: cacheName,
        title,
        src: to.meta?.iframeUrl || navItem?.iframeUrl || to.query?.src || '',
        fullPath: to.fullPath
      })
    }
  } else if (
    (to.meta?.keepAlive || navItem?.cacheName) &&
    cacheName &&
    !cachedComponentNames.value.includes(cacheName)
  ) {
    cachedComponentNames.value.push(cacheName)
  }
  activeTab.value = to.fullPath
}

const handleNavSelect = path => {
  if (path !== route.fullPath) {
    router.push(path)
  }
}

const handleTabRemove = paneName => {
  const tabIndex = tabs.value.findIndex(item => item.fullPath === paneName)
  if (tabIndex === -1) return

  const [removed] = tabs.value.splice(tabIndex, 1)
  if (removed?.iframe) {
    const iframeIndex = iframePanels.value.findIndex(panel => panel.fullPath === removed.fullPath)
    if (iframeIndex > -1) {
      iframePanels.value.splice(iframeIndex, 1)
    }
  }
  if (removed?.name && !tabs.value.some(item => item.name === removed.name)) {
    const cacheIndex = cachedComponentNames.value.indexOf(removed.name)
    if (cacheIndex > -1) {
      cachedComponentNames.value.splice(cacheIndex, 1)
    }
  }

  if (!tabs.value.length) {
    router.push('/layout/home')
    return
  }

  if (route.fullPath === paneName) {
    const nextTab = tabs.value[tabIndex] || tabs.value[tabIndex - 1]
    if (nextTab) {
      router.push(nextTab.fullPath)
    } else {
      router.push('/layout/home')
    }
  }
}

watch(
  () => route.fullPath,
  () => {
    ensureTabExists(route)
  },
  { immediate: true }
)

watch(activeTab, value => {
  if (value && value !== route.fullPath) {
    router.push(value)
  }
})

const activeTabInfo = computed(() => tabs.value.find(tab => tab.fullPath === activeTab.value))
const isActiveIframe = computed(() => !!activeTabInfo.value?.iframe)

onMounted(() => {
  ensureTabExists(route)
})
</script>

<style scoped>
.layout-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f7fa;
}

.layout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 64px;
  background: #1f2937;
  color: #fff;
}

.layout-brand {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.layout-tabs {
  padding: 0 16px;
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
  z-index: 1;
}

.layout-content {
  flex: 1;
  position: relative;
  padding: 24px;
  overflow: hidden;
}

.content-router,
.content-iframes {
  position: absolute;
  inset: 24px;
  width: auto;
  height: auto;
}

.content-router {
  overflow: auto;
}

.content-iframes {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.12);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

:deep(.el-menu--horizontal) {
  border-bottom: none;
  background-color: transparent;
}

:deep(.el-menu-item) {
  color: rgba(255, 255, 255, 0.7);
}

:deep(.el-menu-item.is-active) {
  color: #fff;
}

:deep(.el-tabs__content) {
  display: none;
}
</style>