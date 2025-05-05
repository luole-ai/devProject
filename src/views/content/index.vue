<template>
<div class="layout">
  <p @click="handelClick()">layout界面 </p>
  <router-view></router-view>
</div>
</template>

<script setup>
import { getList } from '@/api/test'
import { getStudent } from '@/api/student'
import { ref } from 'vue'
// import {router} from 'vue-router'
 import { useRouter, useRoute } from 'vue-router'
 const router = useRouter()
const form = ref({
  name: '',
  startDate: '',
  endDate: '',
  status: '',
  category: '',
  priority: '',
  time: ''
})

const tableData = ref([])

const getList1 = async () => {
  try{
    const res = await getStudent()
  }catch{
    console.log("请求失败");
    
  }
  // console.log(res.data)
  // tableData.value = res.data
}

const handleSearch = () => {
  getList1()
}

const handleReset = () => {
  form.value = {
    name: '',
    startDate: '',
    endDate: '',
    status: '',
    category: '',
    priority: '',
    time: ''
  }
}
const handelClick=()=>{
  router.push('layout/detail')
}
getList1()
</script>

<style scoped>
.content-container {
  width: 100%;
  padding: 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.search-content {
  width: 100%;
  background-color: white;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
}

.search-row {
  display: flex;
  flex-wrap: wrap;
}

.form-col {
  margin-bottom: 10px;
  min-width: 200px;
}

/* 确保表单项在网格中正确显示 */
:deep(.el-form-item) {
  margin-bottom: 18px;
}

/* 确保表单项的标签和内容对齐 */
:deep(.el-form-item__label) {
  padding-right: 10px;
}

:deep(.el-form-item__content) {
  flex: 1;
}

.content {
  flex: 1;
  height: 0;
  background-color: #f0f2f5;
  display: flex;
  flex-direction: column;
}

.content :deep(.el-table__body) {
  flex: 1;
}
</style>