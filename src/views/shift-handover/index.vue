<template>
  <div class="shift-handover-page">
    <div class="handover-container">
      <!-- 左侧任务列表 -->
      <div class="task-list-panel">
        <div class="panel-header">
          <h3>班次交接</h3>
          <el-button type="primary" size="small" @click="handleCreateNew">
            <el-icon><Plus /></el-icon>
            新建
          </el-button>
        </div>
        
        <el-tabs v-model="activeTab" @tab-change="handleTabChange" class="task-tabs">
          <el-tab-pane label="我的任务" name="my">
            <div class="task-list">
              <div
                v-for="task in myTasks"
                :key="task.id"
                class="task-item"
                :class="{ active: selectedTask?.id === task.id, unread: !task.isRead }"
                @click="handleSelectTask(task)"
              >
                <div class="task-header">
                  <span class="task-title">{{ task.title || '无标题' }}</span>
                  <el-tag v-if="!task.isRead" type="danger" size="small">未读</el-tag>
                  <el-tag v-else type="success" size="small">已读</el-tag>
                </div>
                <div class="task-meta">
                  <span class="task-type">{{ task.type === 'memo' ? '备忘录' : '任务交接' }}</span>
                  <span class="task-time">{{ formatTime(task.createTime) }}</span>
                </div>
              </div>
              <el-empty v-if="myTasks.length === 0" description="暂无任务" :image-size="80" />
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="交接任务" name="handover">
            <div class="task-list">
              <div
                v-for="task in handoverTasks"
                :key="task.id"
                class="task-item"
                :class="{ active: selectedTask?.id === task.id, unread: !task.isRead }"
                @click="handleSelectTask(task)"
              >
                <div class="task-header">
                  <span class="task-title">{{ task.title || '无标题' }}</span>
                  <el-tag v-if="!task.isRead" type="danger" size="small">未读</el-tag>
                  <el-tag v-else type="success" size="small">已读</el-tag>
                </div>
                <div class="task-meta">
                  <span class="task-type">任务交接</span>
                  <span class="task-time">{{ formatTime(task.createTime) }}</span>
                </div>
                <div class="task-handover-info" v-if="task.handoverToName">
                  交接给：{{ task.handoverToName }}
                </div>
              </div>
              <el-empty v-if="handoverTasks.length === 0" description="暂无交接任务" :image-size="80" />
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="被交接任务" name="handovered">
            <div class="task-list">
              <div
                v-for="task in handoveredTasks"
                :key="task.id"
                class="task-item"
                :class="{ active: selectedTask?.id === task.id, unread: !task.isRead }"
                @click="handleSelectTask(task)"
              >
                <div class="task-header">
                  <span class="task-title">{{ task.title || '无标题' }}</span>
                  <el-tag v-if="!task.isRead" type="danger" size="small">未读</el-tag>
                  <el-tag v-else type="success" size="small">已读</el-tag>
                </div>
                <div class="task-meta">
                  <span class="task-type">任务交接</span>
                  <span class="task-time">{{ formatTime(task.createTime) }}</span>
                </div>
                <div class="task-handover-info" v-if="task.handoverFromName">
                  交接人：{{ task.handoverFromName }}
                </div>
              </div>
              <el-empty v-if="handoveredTasks.length === 0" description="暂无被交接任务" :image-size="80" />
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>

      <!-- 右侧详情/编辑区域 -->
      <div class="detail-panel">
        <div v-if="!selectedTask && !isCreating" class="empty-detail">
          <el-empty description="请选择任务或新建任务" :image-size="120" />
        </div>

        <div v-else class="detail-content">
          <div class="detail-header">
            <h3>{{ isCreating ? '新建' : '详情' }}</h3>
            <div class="header-actions">
              <el-button v-if="selectedTask && !isCreating" @click="handleEdit">编辑</el-button>
              <el-button v-if="selectedTask && !isCreating" type="danger" @click="handleDelete">删除</el-button>
              <el-button @click="handleCancel">取消</el-button>
            </div>
          </div>

          <el-form
            ref="formRef"
            :model="formData"
            :rules="formRules"
            label-width="100px"
            class="detail-form"
          >
            <el-form-item label="类型" prop="type">
              <el-radio-group v-model="formData.type" :disabled="!isEditing && !isCreating">
                <el-radio label="memo">备忘录</el-radio>
                <el-radio label="task">任务交接</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="标题" prop="title">
              <el-input
                v-model="formData.title"
                placeholder="请输入标题"
                :disabled="!isEditing && !isCreating"
                maxlength="100"
                show-word-limit
              />
            </el-form-item>

            <el-form-item label="内容" prop="content">
              <el-input
                v-model="formData.content"
                type="textarea"
                :rows="8"
                placeholder="请输入内容"
                :disabled="!isEditing && !isCreating"
                maxlength="1000"
                show-word-limit
              />
            </el-form-item>

            <el-form-item
              v-if="formData.type === 'task'"
              label="交接人工号"
              prop="handoverToId"
            >
              <el-input
                v-model="formData.handoverToId"
                placeholder="请输入交接人工号（字母开头+8位数字）"
                :disabled="!isEditing && !isCreating"
                @blur="handleEmployeeIdBlur"
                maxlength="9"
              >
                <template #suffix>
                  <el-icon v-if="loadingEmployeeName" class="is-loading">
                    <Loading />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item
              v-if="formData.type === 'task'"
              label="交接人姓名"
            >
              <el-input
                v-model="formData.handoverToName"
                placeholder="输入工号后自动查询"
                disabled
              />
            </el-form-item>

            <!-- 详情模式下的额外信息 -->
            <template v-if="selectedTask && !isEditing && !isCreating">
              <el-form-item label="状态">
                <el-tag :type="selectedTask.isRead ? 'success' : 'danger'">
                  {{ selectedTask.isRead ? '已读' : '未读' }}
                </el-tag>
              </el-form-item>

              <el-form-item v-if="selectedTask.handoverFromName" label="交接人">
                <span>{{ selectedTask.handoverFromName }}</span>
              </el-form-item>

              <el-form-item v-if="selectedTask.handoverToName" label="被交接人">
                <span>{{ selectedTask.handoverToName }}</span>
              </el-form-item>

              <el-form-item label="创建时间">
                <span>{{ formatTime(selectedTask.createTime) }}</span>
              </el-form-item>

              <el-form-item v-if="selectedTask.updateTime" label="更新时间">
                <span>{{ formatTime(selectedTask.updateTime) }}</span>
              </el-form-item>
            </template>

            <el-form-item v-if="isEditing || isCreating">
              <el-button type="primary" @click="handleSubmit" :loading="submitting">
                提交
              </el-button>
              <el-button @click="handleCancel">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Loading } from '@element-plus/icons-vue'
import {
  getTaskList,
  getTaskDetail,
  createMemo,
  createTaskHandover,
  updateTaskHandover,
  getEmployeeName,
  markTaskAsRead,
  deleteTask
} from '@/api/shiftHandover'

defineOptions({
  name: 'ShiftHandover'
})

// 响应式数据
const activeTab = ref('my')
const selectedTask = ref(null)
const isCreating = ref(false)
const isEditing = ref(false)
const submitting = ref(false)
const loadingEmployeeName = ref(false)
const formRef = ref(null)

// 任务列表
const myTasks = ref([])
const handoverTasks = ref([])
const handoveredTasks = ref([])

// 表单数据
const formData = reactive({
  type: 'memo',
  title: '',
  content: '',
  handoverToId: '',
  handoverToName: ''
})

// 表单验证规则
const formRules = {
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入内容', trigger: 'blur' }
  ],
  handoverToId: [
    { required: true, message: '请输入交接人工号', trigger: 'blur' },
    {
      pattern: /^[A-Za-z][0-9]{8}$/,
      message: '工号格式不正确（字母开头+8位数字）',
      trigger: 'blur'
    }
  ]
}

// 计算属性
const isCreatingOrEditing = computed(() => isCreating.value || isEditing.value)

// 方法
const loadTaskList = async () => {
  try {
    const res = await getTaskList({ type: activeTab.value })
    
    // 根据当前tab更新对应的任务列表
    if (activeTab.value === 'my') {
      myTasks.value = res.data?.myTasks || []
    } else if (activeTab.value === 'handover') {
      handoverTasks.value = res.data?.handoverTasks || []
    } else if (activeTab.value === 'handovered') {
      handoveredTasks.value = res.data?.handoveredTasks || []
    }
  } catch (error) {
    console.error('加载任务列表失败:', error)
    ElMessage.error('加载任务列表失败')
  }
}

const handleTabChange = () => {
  selectedTask.value = null
  isCreating.value = false
  isEditing.value = false
  loadTaskList()
}

const handleSelectTask = async (task) => {
  try {
    // 如果是未读任务，标记为已读
    if (!task.isRead) {
      await markTaskAsRead(task.id)
      task.isRead = true
    }

    // 加载任务详情
    const res = await getTaskDetail(task.id)
    selectedTask.value = res.data || task
    isCreating.value = false
    isEditing.value = false
    
    // 重置表单
    resetForm()
  } catch (error) {
    console.error('加载任务详情失败:', error)
    ElMessage.error('加载任务详情失败')
  }
}

const handleCreateNew = () => {
  selectedTask.value = null
  isCreating.value = true
  isEditing.value = false
  resetForm()
  formData.type = 'memo'
}

const handleEdit = () => {
  if (!selectedTask.value) return
  
  isEditing.value = true
  isCreating.value = false
  
  // 填充表单数据
  formData.type = selectedTask.value.type || 'memo'
  formData.title = selectedTask.value.title || ''
  formData.content = selectedTask.value.content || ''
  formData.handoverToId = selectedTask.value.handoverToId || ''
  formData.handoverToName = selectedTask.value.handoverToName || ''
}

const handleCancel = () => {
  isCreating.value = false
  isEditing.value = false
  resetForm()
  
  if (selectedTask.value) {
    // 重新加载任务详情
    handleSelectTask(selectedTask.value)
  }
}

const resetForm = () => {
  formData.type = 'memo'
  formData.title = ''
  formData.content = ''
  formData.handoverToId = ''
  formData.handoverToName = ''
  
  formRef.value?.clearValidate()
}

const handleEmployeeIdBlur = async () => {
  const employeeId = formData.handoverToId?.trim()
  
  if (!employeeId) {
    formData.handoverToName = ''
    return
  }

  // 验证格式
  if (!/^[A-Za-z][0-9]{8}$/.test(employeeId)) {
    formData.handoverToName = ''
    return
  }

  // 查询员工姓名
  loadingEmployeeName.value = true
  try {
    const res = await getEmployeeName(employeeId)
    formData.handoverToName = res.data?.name || ''
    
    if (!formData.handoverToName) {
      ElMessage.warning('未找到该工号对应的员工')
    }
  } catch (error) {
    console.error('查询员工姓名失败:', error)
    formData.handoverToName = ''
    ElMessage.error('查询员工姓名失败')
  } finally {
    loadingEmployeeName.value = false
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    
    // 如果是任务交接类型，需要验证交接人信息
    if (formData.type === 'task') {
      if (!formData.handoverToId || !formData.handoverToName) {
        ElMessage.warning('请先输入并验证交接人工号')
        return
      }
    }

    submitting.value = true

    const submitData = {
      type: formData.type,
      title: formData.title,
      content: formData.content
    }

    if (formData.type === 'task') {
      submitData.handoverToId = formData.handoverToId
      submitData.handoverToName = formData.handoverToName
    }

    let res
    if (isCreating.value) {
      // 创建新任务
      if (formData.type === 'memo') {
        res = await createMemo(submitData)
      } else {
        res = await createTaskHandover(submitData)
      }
      ElMessage.success('创建成功')
    } else if (isEditing.value && selectedTask.value) {
      // 更新任务
      res = await updateTaskHandover(selectedTask.value.id, submitData)
      ElMessage.success('更新成功')
    }

    // 保存创建/编辑状态
    const wasCreating = isCreating.value
    const createdTask = res?.data
    
    // 重置状态
    isCreating.value = false
    isEditing.value = false
    
    // 重新加载任务列表
    await loadTaskList()
    
    // 如果创建成功，选中新创建的任务
    if (wasCreating && createdTask) {
      await handleSelectTask(createdTask)
    } else if (!wasCreating && selectedTask.value) {
      // 如果是编辑，重新加载当前任务
      await handleSelectTask(selectedTask.value)
    }
  } catch (error) {
    if (error !== false) { // 表单验证失败会返回false
      console.error('提交失败:', error)
      ElMessage.error('提交失败')
    }
  } finally {
    submitting.value = false
  }
}

const handleDelete = async () => {
  if (!selectedTask.value) return

  try {
    await ElMessageBox.confirm('确定要删除该任务吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await deleteTask(selectedTask.value.id)
    ElMessage.success('删除成功')
    
    // 重置状态
    selectedTask.value = null
    isCreating.value = false
    isEditing.value = false
    
    // 重新加载任务列表
    await loadTaskList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

const formatTime = (time) => {
  if (!time) return '-'
  const date = new Date(time)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 监听表单类型变化，如果是备忘录，清空交接人相关字段
watch(() => formData.type, (newType) => {
  if (newType === 'memo') {
    formData.handoverToId = ''
    formData.handoverToName = ''
  }
})

// 生命周期
onMounted(() => {
  loadTaskList()
})
</script>

<style scoped lang="scss">
.shift-handover-page {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 160px);
}

.handover-container {
  display: flex;
  gap: 20px;
  height: calc(100vh - 200px);
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.task-list-panel {
  width: 350px;
  border-right: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
  background-color: #fff;

  .panel-header {
    padding: 16px;
    border-bottom: 1px solid #e4e7ed;
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #303133;
    }
  }

  .task-tabs {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    :deep(.el-tabs__header) {
      margin: 0;
      padding: 0 16px;
      border-bottom: 1px solid #e4e7ed;
    }

    :deep(.el-tabs__content) {
      flex: 1;
      overflow: hidden;
    }

    :deep(.el-tab-pane) {
      height: 100%;
      overflow-y: auto;
    }
  }

  .task-list {
    padding: 8px;
    height: 100%;
    overflow-y: auto;

    .task-item {
      padding: 12px;
      margin-bottom: 8px;
      border: 1px solid #e4e7ed;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s;
      background-color: #fff;

      &:hover {
        border-color: #409eff;
        background-color: #ecf5ff;
      }

      &.active {
        border-color: #409eff;
        background-color: #ecf5ff;
        box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
      }

      &.unread {
        border-left: 3px solid #f56c6c;
      }

      .task-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;

        .task-title {
          font-weight: 600;
          color: #303133;
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .task-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
        color: #909399;
        margin-bottom: 4px;
      }

      .task-handover-info {
        font-size: 12px;
        color: #606266;
        margin-top: 4px;
      }
    }
  }
}

.detail-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .empty-detail {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .detail-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;

    .detail-header {
      padding: 16px 20px;
      border-bottom: 1px solid #e4e7ed;
      display: flex;
      justify-content: space-between;
      align-items: center;

      h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: #303133;
      }

      .header-actions {
        display: flex;
        gap: 8px;
      }
    }

    .detail-form {
      flex: 1;
      padding: 20px;
      overflow-y: auto;

      :deep(.el-form-item__label) {
        font-weight: 500;
      }
    }
  }
}
</style>

