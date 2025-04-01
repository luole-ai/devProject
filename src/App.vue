<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import HomePage from './views/HomePage.vue'

export default {
  name: 'App',
  components: {
    HomePage 
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: #f7f8fa;
}
</style> 