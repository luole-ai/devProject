<template>
  <div class="iframe-container">
    <iframe
      class="iframe-page"
      :title="title"
      :src="src"
      frameborder="0"
      allowfullscreen
    />
  </div>
</template>

<script setup>
defineProps({
  src: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: '外部页面'
  }
})
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

