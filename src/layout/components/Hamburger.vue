<template>
  <div style="padding: 0 15px;" @click="toggleClick">
    <el-icon :size="20">
      <Expand v-if="isActive" />
      <Fold v-else />
    </el-icon>
  </div>
</template>

<script>
export default {
  name: 'Hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  emits: ['toggleClick'],
  setup(props, { emit }) {
    const toggleClick = () => {
      emit('toggleClick')
    }

    return {
      toggleClick
    }
  }
}
</script>

<style scoped>
.el-icon {
  vertical-align: middle;
  cursor: pointer;
  align-self: center;
}
</style> 