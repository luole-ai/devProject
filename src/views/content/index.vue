<template>
  <div class="content-container">
    <el-form :model="form" class="search-content" label-width="auto" label-position="top">
      <el-row :gutter="20" class="search-row">
        <el-col :xs="24" :sm="12" :md="8" :lg="4" :xl="4" class="form-col">
          <el-form-item label="Activity name">
            <el-input v-model="form.name" placeholder="Please input name" />
          </el-form-item>
        </el-col>
        
        <el-col :xs="24" :sm="12" :md="8" :lg="4" :xl="4" class="form-col">
          <el-form-item label="Start Date">
            <el-date-picker
              v-model="form.startDate"
              type="date"
              placeholder="Select date"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        
        <el-col :xs="12" :sm="12" :md="8" :lg="4" :xl="4" class="form-col">
          <el-form-item label="End Date">
            <el-date-picker
              v-model="form.endDate"
              type="date"
              placeholder="Select date"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        
        <el-col :xs="12" :sm="12" :md="8" :lg="4" :xl="4" class="form-col">
          <el-form-item label="Status">
            <el-select v-model="form.status" placeholder="Select status" style="width: 100%">
              <el-option label="Active" value="active" />
              <el-option label="Inactive" value="inactive" />
            </el-select>
          </el-form-item>
        </el-col>
        
        <el-col :xs="12" :sm="12" :md="8" :lg="4" :xl="4" class="form-col">
          <el-form-item label="Category">
            <el-select v-model="form.category" placeholder="Select category" style="width: 100%">
              <el-option label="Category 1" value="category1" />
              <el-option label="Category 2" value="category2" />
            </el-select>
          </el-form-item>
        </el-col>
        
        <el-col :xs="24" :sm="12" :md="8" :lg="4" :xl="4" class="form-col">
          <el-form-item label="Priority">
            <el-select v-model="form.priority" placeholder="Select priority" style="width: 100%">
              <el-option label="High" value="high" />
              <el-option label="Medium" value="medium" />
              <el-option label="Low" value="low" />
            </el-select>
          </el-form-item>
        </el-col>
        
        <el-col :xs="24" :sm="12" :md="8" :lg="4" :xl="4" class="form-col">
          <el-form-item label="Time Range">
            <el-time-picker
              v-model="form.time"
              is-range
              range-separator="To"
              start-placeholder="Start time"
              end-placeholder="End time"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        
        <el-col :xs="24" :sm="12" :md="8" :lg="4" :xl="4" class="form-col">
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button type="info" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="content">
      <el-table :data="tableData">
        <el-table-column prop="id" label="名称"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { getList } from '@/api/test'
import { getStudent } from '@/api/student'
import { ref } from 'vue'

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
  const res = await getStudent()
  console.log(res.data)
  tableData.value = res.data
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