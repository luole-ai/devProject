<template>
  <input type="text">
  <div class="iframe-container">
    <iframe
      class="iframe-page"
      :title="route.meta.title || '外部页面'"
      :src="currentUrl"
      frameborder="0"
      allowfullscreen
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

defineOptions({
  name: 'IframeBase'
})
console.log(123)
const route = useRoute()

const currentUrl = computed(() => route.meta.iframeUrl || route.query.src || '')
</script>

<style scoped>
.iframe-container {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #fff;
}

.iframe-page {
  width: 100%;
  height: 100%;
  border: 0;
}
</style>

