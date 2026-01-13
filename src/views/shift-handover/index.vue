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

      <!-- 右侧详情/沟通记录区域 -->
      <div class="detail-panel">
        <div v-if="!selectedTask && !isCreating" class="empty-detail">
          <el-empty description="请选择任务或新建任务" :image-size="120" />
        </div>

        <!-- 新建任务表单 -->
        <div v-else-if="isCreating" class="detail-content">
          <div class="detail-header">
            <h3>新建</h3>
            <div class="header-actions">
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
              <el-radio-group v-model="formData.type">
                <el-radio label="memo">备忘录</el-radio>
                <el-radio label="task">任务交接</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="标题" prop="title">
              <el-input
                v-model="formData.title"
                placeholder="请输入标题"
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

            <el-form-item>
              <el-button type="primary" @click="handleSubmit" :loading="submitting">
                提交
              </el-button>
              <el-button @click="handleCancel">取消</el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- 任务沟通记录区域 -->
        <div v-else-if="selectedTask" class="detail-content">
          <div class="detail-header">
            <h3>{{ selectedTask.title || '任务详情' }}</h3>
            <div class="header-actions">
              <el-button type="danger" @click="handleDelete">删除</el-button>
            </div>
          </div>

          <div class="task-info-section">
            <div class="info-item">
              <span class="info-label">类型：</span>
              <el-tag :type="selectedTask.type === 'memo' ? 'info' : 'primary'">
                {{ selectedTask.type === 'memo' ? '备忘录' : '任务交接' }}
              </el-tag>
            </div>
            <div class="info-item">
              <span class="info-label">状态：</span>
              <el-tag :type="selectedTask.isRead ? 'success' : 'danger'">
                {{ selectedTask.isRead ? '已读' : '未读' }}
              </el-tag>
            </div>
            <div v-if="selectedTask.handoverFromName" class="info-item">
              <span class="info-label">交接人：</span>
              <span>{{ selectedTask.handoverFromName }}</span>
            </div>
            <div v-if="selectedTask.handoverToName" class="info-item">
              <span class="info-label">被交接人：</span>
              <span>{{ selectedTask.handoverToName }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">创建时间：</span>
              <span>{{ formatTime(selectedTask.createTime) }}</span>
            </div>
          </div>

          <div class="task-content-section">
            <div class="content-label">任务内容：</div>
            <div class="content-text">{{ selectedTask.content }}</div>
          </div>

          <!-- 沟通记录区域（仅任务交接类型显示） -->
          <div v-if="selectedTask.type === 'task'" class="comments-section">
            <div class="comments-header">
              <h4>沟通记录</h4>
            </div>
            
            <div class="comments-list" ref="commentsListRef">
              <div
                v-for="comment in taskComments"
                :key="comment.id"
                class="comment-item"
                :class="{ 'is-own': isOwnComment(comment) }"
              >
                <div class="comment-header">
                  <span class="comment-author">{{ comment.userName }}</span>
                  <span class="comment-role">
                    <el-tag size="small" :type="comment.userRole === 'handoverFrom' ? 'primary' : 'success'">
                      {{ comment.userRole === 'handoverFrom' ? '发布者' : '被交接者' }}
                    </el-tag>
                  </span>
                  <span class="comment-time">{{ formatTime(comment.createTime) }}</span>
                </div>
                <div class="comment-content">{{ comment.content }}</div>
              </div>
              <el-empty v-if="taskComments.length === 0" description="暂无沟通记录" :image-size="80" />
            </div>

            <!-- 反馈输入区域 -->
            <div class="comment-input-section">
              <el-input
                v-model="commentContent"
                type="textarea"
                :rows="4"
                placeholder="请输入反馈内容..."
                maxlength="500"
                show-word-limit
                @keydown.ctrl.enter="handleSubmitComment"
              />
              <div class="comment-actions">
                <el-button type="primary" @click="handleSubmitComment" :loading="submittingComment">
                  发送反馈
                </el-button>
                <span class="tip-text">Ctrl + Enter 快速发送</span>
              </div>
            </div>
          </div>

          <!-- 备忘录类型显示提示 -->
          <div v-else class="memo-tip">
            <el-alert
              title="备忘录"
              description="备忘录类型不支持沟通功能"
              type="info"
              :closable="false"
            />
          </div>
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
  deleteTask,
  getTaskComments,
  addTaskComment
} from '@/api/shiftHandover'

defineOptions({
  name: 'ShiftHandover'
})

// 响应式数据
const activeTab = ref('my')
const selectedTask = ref(null)
const isCreating = ref(false)
const submitting = ref(false)
const loadingEmployeeName = ref(false)
const formRef = ref(null)
const commentsListRef = ref(null)

// 任务列表
const myTasks = ref([])
const handoverTasks = ref([])
const handoveredTasks = ref([])

// 沟通记录相关
const taskComments = ref([])
const commentContent = ref('')
const submittingComment = ref(false)

// 当前用户ID（实际应该从store或token中获取）
const currentUserId = ref('A12345678')

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
    // 加载所有任务列表数据，不传type参数或传空参数
    const res = await getTaskList({})
    console.log('获取任务列表响应:', res)
    
    // mock函数直接返回Promise，不经过axios拦截器，所以res就是{code, message, data}
    // 同时更新所有三个任务列表
    const data = res?.data || res || {}
    myTasks.value = data.myTasks || []
    handoverTasks.value = data.handoverTasks || []
    handoveredTasks.value = data.handoveredTasks || []
    
    console.log('我的任务:', myTasks.value)
    console.log('交接任务:', handoverTasks.value)
    console.log('被交接任务:', handoveredTasks.value)
  } catch (error) {
    console.error('加载任务列表失败:', error)
    ElMessage.error('加载任务列表失败')
  }
}

const handleTabChange = () => {
  selectedTask.value = null
  isCreating.value = false
  taskComments.value = []
  commentContent.value = ''
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
    console.log('获取任务详情响应:', res)
    selectedTask.value = res?.data || res || task
    isCreating.value = false
    
    // 如果是任务交接类型，加载沟通记录
    if (selectedTask.value.type === 'task') {
      await loadTaskComments(task.id)
    } else {
      taskComments.value = []
    }
  } catch (error) {
    console.error('加载任务详情失败:', error)
    ElMessage.error('加载任务详情失败')
  }
}

// 加载任务沟通记录
const loadTaskComments = async (taskId) => {
  try {
    const res = await getTaskComments(taskId)
    console.log('获取沟通记录响应:', res)
    taskComments.value = res?.data || res || []
    
    // 滚动到底部
    setTimeout(() => {
      if (commentsListRef.value) {
        commentsListRef.value.scrollTop = commentsListRef.value.scrollHeight
      }
    }, 100)
  } catch (error) {
    console.error('加载沟通记录失败:', error)
    ElMessage.error('加载沟通记录失败')
  }
}

// 判断是否是自己的评论
const isOwnComment = (comment) => {
  return comment.userId === currentUserId.value
}

// 提交反馈
const handleSubmitComment = async () => {
  if (!selectedTask.value) return
  
  const content = commentContent.value?.trim()
  if (!content) {
    ElMessage.warning('请输入反馈内容')
    return
  }

  try {
    submittingComment.value = true
    const res = await addTaskComment(selectedTask.value.id, { content })
    
    // 添加到沟通记录列表
    const newComment = res?.data || res
    if (newComment) {
      taskComments.value.push(newComment)
    }
    
    // 清空输入框
    commentContent.value = ''
    
    ElMessage.success('反馈发送成功')
    
    // 滚动到底部
    setTimeout(() => {
      if (commentsListRef.value) {
        commentsListRef.value.scrollTop = commentsListRef.value.scrollHeight
      }
    }, 100)
  } catch (error) {
    console.error('发送反馈失败:', error)
    ElMessage.error('发送反馈失败')
  } finally {
    submittingComment.value = false
  }
}

const handleCreateNew = () => {
  selectedTask.value = null
  isCreating.value = true
  taskComments.value = []
  commentContent.value = ''
  resetForm()
  formData.type = 'memo'
}

const handleCancel = () => {
  isCreating.value = false
  resetForm()
  commentContent.value = ''
  
  if (selectedTask.value) {
    // 重新加载任务详情和沟通记录
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
    formData.handoverToName = res?.data?.name || res?.name || ''
    
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
    // 创建新任务
    if (formData.type === 'memo') {
      res = await createMemo(submitData)
    } else {
      res = await createTaskHandover(submitData)
    }
    ElMessage.success('创建成功')

    // 保存创建状态
    const createdTask = res?.data || res
    
    // 重置状态
    isCreating.value = false
    
    // 重新加载任务列表
    await loadTaskList()
    
    // 如果创建成功，选中新创建的任务
    if (createdTask) {
      await handleSelectTask(createdTask)
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
    taskComments.value = []
    commentContent.value = ''
    
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
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

.handover-container {
  flex: 1;
  display: flex;
  gap: 0;
  height: 100%;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  min-height: 0; // 重要：允许flex子元素缩小
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
    min-height: 0; // 重要：允许flex子元素缩小

    :deep(.el-tabs__header) {
      margin: 0;
      padding: 0 16px;
      border-bottom: 1px solid #e4e7ed;
      flex-shrink: 0; // 防止header被压缩
    }

    :deep(.el-tabs__content) {
      flex: 1;
      overflow: hidden;
      min-height: 0; // 重要：允许flex子元素缩小
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
    min-height: 0; // 重要：允许flex子元素缩小

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
  min-height: 0; // 重要：允许flex子元素缩小
  min-width: 0; // 防止内容溢出

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
    min-height: 0; // 重要：允许flex子元素缩小

    .detail-header {
      padding: 16px 20px;
      border-bottom: 1px solid #e4e7ed;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0; // 防止header被压缩

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
      min-height: 0; // 重要：允许flex子元素缩小

      :deep(.el-form-item__label) {
        font-weight: 500;
      }
    }

    .task-info-section {
      padding: 20px;
      border-bottom: 1px solid #e4e7ed;
      background-color: #f5f7fa;
      flex-shrink: 0; // 防止被压缩

      .info-item {
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        font-size: 14px;

        &:last-child {
          margin-bottom: 0;
        }

        .info-label {
          font-weight: 500;
          color: #606266;
          margin-right: 8px;
          min-width: 80px;
        }
      }
    }

    .task-content-section {
      padding: 20px;
      border-bottom: 1px solid #e4e7ed;
      flex-shrink: 0; // 防止被压缩

      .content-label {
        font-weight: 600;
        color: #303133;
        margin-bottom: 12px;
        font-size: 14px;
      }

      .content-text {
        color: #606266;
        line-height: 1.6;
        white-space: pre-wrap;
        word-break: break-word;
      }
    }

    .comments-section {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      min-height: 0; // 重要：允许flex子元素缩小

      .comments-header {
        padding: 16px 20px;
        border-bottom: 1px solid #e4e7ed;
        flex-shrink: 0; // 防止header被压缩

        h4 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #303133;
        }
      }

      .comments-list {
        flex: 1;
        padding: 20px;
        overflow-y: auto;
        background-color: #fafafa;
        min-height: 0; // 重要：允许flex子元素缩小

        .comment-item {
          margin-bottom: 16px;
          padding: 12px;
          background-color: #fff;
          border-radius: 6px;
          border: 1px solid #e4e7ed;

          &.is-own {
            background-color: #ecf5ff;
            border-color: #b3d8ff;
          }

          &:last-child {
            margin-bottom: 0;
          }

          .comment-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;

            .comment-author {
              font-weight: 600;
              color: #303133;
              font-size: 14px;
            }

            .comment-role {
              flex-shrink: 0;
            }

            .comment-time {
              margin-left: auto;
              font-size: 12px;
              color: #909399;
            }
          }

          .comment-content {
            color: #606266;
            line-height: 1.6;
            white-space: pre-wrap;
            word-break: break-word;
            font-size: 14px;
          }
        }
      }

      .comment-input-section {
        padding: 16px 20px;
        border-top: 1px solid #e4e7ed;
        background-color: #fff;
        flex-shrink: 0; // 防止输入区域被压缩

        .comment-actions {
          margin-top: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;

          .tip-text {
            font-size: 12px;
            color: #909399;
          }
        }
      }
    }

    .memo-tip {
      padding: 20px;
      flex-shrink: 0; // 防止被压缩
    }
  }
}
</style>

