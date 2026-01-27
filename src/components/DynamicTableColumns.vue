<template>
  <div class="dynamic-table-columns">
    <el-select
      v-model="visibleIds"
      multiple
      collapse-tags
      filterable
      :placeholder="placeholder"
      class="dynamic-table-columns__select"
      @change="toggleColumns"
    >
      <el-option
        v-for="opt in options"
        :key="opt.value"
        :label="opt.label"
        :value="opt.value"
      />
    </el-select>
  </div>
</template>

<script setup >
import { computed, onMounted, ref, nextTick, watch } from 'vue'

const props = defineProps({
  // 传入的表格 ref：ref<InstanceType<typeof ElTable>>
  tableRef: {
    type: Object,
    required: true,
  },
  // 默认隐藏列（按表头 label 名称匹配）
  defaultHiddenLabels: {
    type: Array,
    default: () => [],
  },
  // 选择框占位文本
  placeholder: {
    type: String,
    default: '',
  },
})

const hideClass = 'col-hidden';
const colStates = ref([]);
const visibleIds = ref([])

const options = computed(() =>
  colStates.value.map(col => ({
    value: col.id,
    label: col.label || col.property || col.id,
  })),
)

const clearAllHidden = () => {
  document.querySelectorAll(`.${hideClass}`).forEach(el => el.classList.remove(hideClass))
}

const applyHiddenByIds = (hideIds) => {
  hideIds.forEach(id => {
    document.querySelectorAll(`.${id}`).forEach(el => el.classList.add(hideClass))
  })
}

const toggleColumns = () => {
  clearAllHidden()
  const hideIds = colStates.value
    .filter(c => !visibleIds.value.includes(c.id))
    .map(c => c.id)
  applyHiddenByIds(hideIds)
}

const initColumns = async () => {
  await nextTick()
  const cols = props.tableRef?.value?.store?.states?.columns || []
  if (!cols.length) return
  colStates.value = cols

  const defaultHidden = props.defaultHiddenLabels ?? []

  // 找出需要隐藏的列 id（根据 label 匹配）
  const hideIds = cols
    .filter((c) => defaultHidden.includes(c.label))
    .map((c) => c.id)

  // 默认可见列 = 全部列 - 默认隐藏列
  visibleIds.value = cols
    .filter((c) => !hideIds.includes(c.id))
    .map((c) => c.id)

  // 应用隐藏
  clearAllHidden()
  applyHiddenByIds(hideIds)
}

onMounted(() => {
  initColumns()
})

// 当表格列发生变化（如切换数据/重渲染）时，自动重建选项
watch(
  () => props.tableRef?.value?.store?.states?.columns?.length,
  () => {
    initColumns()
  }
)

// 如果外部重新渲染表格并希望手动刷新列，可以暴露一个方法（选用）
const exposeInit = () => {
  initColumns()
}

defineExpose({
  init: exposeInit,
})
</script>

<style scoped>
.dynamic-table-columns__select {
  width: 320px;
}

/* 隐藏列的 th / td */
.col-hidden {
  display: none !important;
}
</style>


