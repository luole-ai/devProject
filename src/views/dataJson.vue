`<template>
  <div class="data-json-container">
    <!-- 查询区域 -->
    <div class="search-area">
      <el-form :model="searchForm" inline>
        <!-- 第一个页签的查询条件 -->
        <template v-if="activeTab === 'tab1'">
          <el-form-item label="名称">
            <el-input v-model="searchForm.name" placeholder="请输入名称" />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="请选择状态">
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </template>

        <!-- 第二个页签的查询条件 -->
        <template v-if="activeTab === 'tab2'">
          <el-form-item label="日期">
            <el-date-picker
              v-model="searchForm.date"
              type="date"
              placeholder="选择日期"
            />
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="searchForm.type" placeholder="请选择类型">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </template>

        <!-- 第三个页签的查询条件 -->
        <template v-if="activeTab === 'tab3'">
          <el-form-item label="编号">
            <el-input v-model="searchForm.code" placeholder="请输入编号" />
          </el-form-item>
          <el-form-item label="级别">
            <el-select v-model="searchForm.level" placeholder="请选择级别">
              <el-option
                v-for="item in levelOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </template>

        <!-- 第四个页签的查询条件 -->
        <template v-if="activeTab === 'tab4'">
          <el-form-item label="部门">
            <el-select v-model="searchForm.department" placeholder="请选择部门">
              <el-option
                v-for="item in departmentOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="负责人">
            <el-input v-model="searchForm.manager" placeholder="请输入负责人" />
          </el-form-item>
        </template>

        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 页签区域 -->
    <div class="tabs-area">
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane label="基础信息" name="tab1">
          <el-table :data="tableData" border style="width: 100%" v-loading="loading">
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="status" label="状态" />
            <el-table-column prop="createTime" label="创建时间" />
            <el-table-column prop="updateTime" label="更新时间" />
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="时间记录" name="tab2">
          <el-table :data="tableData" border style="width: 100%" v-loading="loading">
            <el-table-column prop="date" label="日期" />
            <el-table-column prop="type" label="类型" />
            <el-table-column prop="description" label="描述" />
            <el-table-column prop="operator" label="操作人" />
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="等级管理" name="tab3">
          <el-table :data="tableData" border style="width: 100%" v-loading="loading">
            <el-table-column prop="code" label="编号" />
            <el-table-column prop="level" label="级别" />
            <el-table-column prop="score" label="分数" />
            <el-table-column prop="remark" label="备注" />
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="部门信息" name="tab4">
          <el-table :data="tableData" border style="width: 100%" v-loading="loading">
            <el-table-column prop="department" label="部门" />
            <el-table-column prop="manager" label="负责人" />
            <el-table-column prop="memberCount" label="成员数量" />
            <el-table-column prop="budget" label="预算" />
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <!-- 分页组件 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'

// 页签激活状态
const activeTab = ref('tab1')
const loading = ref(false)

// 查询表单数据
const searchForm = reactive({
  name: '',
  status: '',
  date: '',
  type: '',
  code: '',
  level: '',
  department: '',
  manager: ''
})

// 下拉框选项数据
const statusOptions = ref([])
const typeOptions = ref([])
const levelOptions = ref([])
const departmentOptions = ref([])

// 表格数据
const tableData = ref([])

// 分页相关数据
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// API 请求方法
const fetchTableData = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      ...searchForm
    }
    
    // 根据不同页签调用不同的接口
    let url = ''
    switch (activeTab.value) {
      case 'tab1':
        url = '/api/basic/list'
        break
      case 'tab2':
        url = '/api/time/list'
        break
      case 'tab3':
        url = '/api/level/list'
        break
      case 'tab4':
        url = '/api/department/list'
        break
    }
    
    const response = await axios.get(url, { params })
    tableData.value = response.data.list
    total.value = response.data.total
  } catch (error) {
    console.error('获取表格数据失败：', error)
  } finally {
    loading.value = false
  }
}

// 获取下拉框选项数据
const fetchSelectOptions = async () => {
  try {
    // 获取状态选项
    const statusResponse = await axios.get('/api/options/status')
    statusOptions.value = statusResponse.data

    // 获取类型选项
    const typeResponse = await axios.get('/api/options/type')
    typeOptions.value = typeResponse.data

    // 获取级别选项
    const levelResponse = await axios.get('/api/options/level')
    levelOptions.value = levelResponse.data

    // 获取部门选项
    const departmentResponse = await axios.get('/api/options/department')
    departmentOptions.value = departmentResponse.data
  } catch (error) {
    console.error('获取下拉框选项失败：', error)
  }
}

// 查询方法
const handleSearch = () => {
  currentPage.value = 1
  fetchTableData()
}

// 重置方法
const handleReset = () => {
  Object.keys(searchForm).forEach(key => {
    searchForm[key] = ''
  })
  handleSearch()
}

// 页签切换方法
const handleTabClick = () => {
  currentPage.value = 1
  fetchTableData()
}

// 分页方法
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchTableData()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchTableData()
}

// 初始化
onMounted(() => {
  fetchSelectOptions()
  fetchTableData()
})
</script>

<style scoped>
.data-json-container {
  padding: 20px;
}

.search-area {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.tabs-area {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
`