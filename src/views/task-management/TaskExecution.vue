<template>
  <div class="task-execution-container">
    <el-card class="execution-card">
      <template #header>
        <div class="card-header">
          <span>我的任务</span>
          <el-select
            v-model="filterStatus"
            placeholder="筛选状态"
            style="width: 150px"
            clearable
          >
            <el-option label="全部" value="" />
            <el-option label="待执行" value="pending" />
            <el-option label="执行中" value="in_progress" />
            <el-option label="已完成" value="completed" />
          </el-select>
        </div>
      </template>

      <div v-if="loading" class="empty-state">
        <el-skeleton rows="4" animated />
      </div>

      <div v-else-if="filteredTasks.length === 0" class="empty-state">
        <el-empty description="暂无任务" />
      </div>

      <div v-else class="task-list">
        <el-card
          v-for="task in filteredTasks"
          :key="task.id"
          class="task-card"
          shadow="hover"
        >
          <template #header>
            <div class="task-header">
              <div class="task-title-section">
                <h3>{{ task.title }}</h3>
                <el-tag
                  :type="getStatusType(task.status)"
                  size="small"
                >
                  {{ getStatusText(task.status) }}
                </el-tag>
              </div>
              <div class="task-meta">
                <span>发布人：{{ task.publisher }}</span>
                <span>发布时间：{{ formatDate(task.publishedAt) }}</span>
              </div>
            </div>
          </template>

          <div v-if="task.description" class="task-description">
            {{ task.description }}
          </div>

          <el-divider />

          <div class="task-items">
            <div
              v-for="(item, index) in task.tasks"
              :key="item.id"
              class="task-item"
              :class="{
                'task-item-completed': item.executionStatus === 'completed',
                'task-item-in-progress': item.executionStatus === 'in_progress'
              }"
            >
              <div class="task-item-header">
                <div class="task-item-info">
                  <el-checkbox
                    v-model="item.checked"
                    :disabled="item.executionStatus === 'completed'"
                    @change="handleTaskItemCheck(item, task.id)"
                  >
                    <span class="task-item-name">{{ index + 1 }}. {{ item.name }}</span>
                  </el-checkbox>
                  <el-tag
                    v-if="item.priority"
                    :type="getPriorityType(item.priority)"
                    size="small"
                    style="margin-left: 10px"
                  >
                    {{ getPriorityText(item.priority) }}
                  </el-tag>
                </div>
                <el-tag
                  :type="getExecutionStatusType(item.executionStatus)"
                  size="small"
                >
                  {{ getExecutionStatusText(item.executionStatus) }}
                </el-tag>
              </div>

              <div v-if="item.description" class="task-item-description">
                {{ item.description }}
              </div>

              <div v-if="item.estimatedTime" class="task-item-time">
                预计完成时间：{{ formatDate(item.estimatedTime) }}
              </div>

              <!-- 执行反馈区域 -->
              <div class="task-item-feedback" v-if="item.executionStatus !== 'pending'">
                <el-divider />
                <div class="feedback-content">
                  <div class="feedback-label">执行反馈：</div>
                  <div class="feedback-text">{{ item.feedback || '暂无反馈' }}</div>
                  <div v-if="item.completedAt" class="feedback-time">
                    完成时间：{{ formatDate(item.completedAt) }}
                  </div>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="task-item-actions">
                <el-button
                  v-if="item.executionStatus === 'pending'"
                  type="primary"
                  size="small"
                  @click="openFeedbackDialog(item, task.id)"
                >
                  开始执行
                </el-button>
                <el-button
                  v-else-if="item.executionStatus === 'in_progress'"
                  type="success"
                  size="small"
                  @click="openFeedbackDialog(item, task.id)"
                >
                  提交反馈
                </el-button>
                <el-button
                  v-else
                  type="info"
                  size="small"
                  @click="openFeedbackDialog(item, task.id)"
                >
                  查看反馈
                </el-button>
              </div>
            </div>
          </div>

          <div class="task-progress">
            <el-progress
              :percentage="getTaskProgress(task)"
              :color="getProgressColor(task.status)"
            />
            <div class="progress-text">
              完成进度：{{ getCompletedCount(task) }} / {{ task.tasks.length }}
            </div>
          </div>
        </el-card>
      </div>
    </el-card>

    <!-- 反馈对话框 -->
    <el-dialog
      v-model="showFeedbackDialog"
      :title="currentTaskItem ? `任务反馈 - ${currentTaskItem.name}` : '任务反馈'"
      width="600px"
    >
      <el-form :model="feedbackForm" label-width="100px" ref="feedbackFormRef">
        <el-form-item label="执行状态" required>
          <el-radio-group v-model="feedbackForm.status">
            <el-radio label="in_progress">执行中</el-radio>
            <el-radio label="completed">已完成</el-radio>
            <el-radio label="failed">执行失败</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="执行反馈" required>
          <el-input
            v-model="feedbackForm.feedback"
            type="textarea"
            :rows="6"
            placeholder="请详细描述任务执行情况、遇到的问题、完成情况等"
          />
        </el-form-item>

        <el-form-item label="完成时间" v-if="feedbackForm.status === 'completed'">
          <el-date-picker
            v-model="feedbackForm.completedAt"
            type="datetime"
            placeholder="选择完成时间"
            style="width: 100%"
            :default-value="new Date()"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showFeedbackDialog = false">取消</el-button>
        <el-button type="primary" @click="submitFeedback">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { fetchWorkLists, fetchWorkListDetail, submitExecution, fetchExecutionRecords } from '@/api/task'

const filterStatus = ref('')
const loading = ref(false)
const workLists = ref([])

const showFeedbackDialog = ref(false)
const currentTaskItem = ref(null)
const currentTaskId = ref(null)
const feedbackFormRef = ref(null)

const feedbackForm = reactive({
  status: 'in_progress',
  feedback: '',
  completedAt: new Date()
})

const filteredTasks = computed(() => {
  let tasks = workLists.value.map(task => ({
    ...task,
    tasks: (task.tasks || []).map(item => ({
      ...item,
      checked: item.executionStatus === 'completed'
    }))
  }))

  if (filterStatus.value) {
    tasks = tasks.filter(task => task.status === filterStatus.value)
  }

  return tasks
})

// 处理任务项勾选
const handleTaskItemCheck = (item, taskId) => {
  if (item.checked && item.executionStatus === 'pending') {
    openFeedbackDialog(item, taskId)
  }
}

// 打开反馈对话框
const openFeedbackDialog = async (item, taskId) => {
  currentTaskItem.value = item
  currentTaskId.value = taskId

  try {
    const records = await fetchExecutionRecords(taskId, item.id)
    const last = (records || []).slice(-1)[0]
    if (last) {
      feedbackForm.status = last.status
      feedbackForm.feedback = last.feedback || ''
      feedbackForm.completedAt = last.completedAt ? new Date(last.completedAt) : new Date()
    } else {
      feedbackForm.status = item.executionStatus === 'pending' ? 'in_progress' : item.executionStatus
      feedbackForm.feedback = item.feedback || ''
      feedbackForm.completedAt = new Date()
    }
  } catch (e) {
    feedbackForm.status = item.executionStatus === 'pending' ? 'in_progress' : item.executionStatus
    feedbackForm.feedback = item.feedback || ''
    feedbackForm.completedAt = new Date()
  }

  showFeedbackDialog.value = true
}

// 提交反馈
const submitFeedback = async () => {
  if (!feedbackForm.feedback.trim()) {
    ElMessage.warning('请输入执行反馈')
    return
  }

  try {
    const payload = {
      workListId: currentTaskId.value,
      workListItemId: currentTaskItem.value.id,
      status: feedbackForm.status,
      feedback: feedbackForm.feedback,
      completedAt: feedbackForm.status === 'completed'
        ? (feedbackForm.completedAt || new Date())
        : null,
      executor: '当前用户'
    }

    await submitExecution(payload)

    ElMessage.success('反馈提交成功')
    showFeedbackDialog.value = false
    await loadWorkLists()
  } catch (error) {
    ElMessage.error('提交失败')
  }
}

// 获取状态类型
const getStatusType = (status) => {
  const map = {
    pending: 'info',
    in_progress: 'warning',
    completed: 'success'
  }
  return map[status] || 'info'
}

// 获取状态文本
const getStatusText = (status) => {
  const map = {
    pending: '待执行',
    in_progress: '执行中',
    completed: '已完成'
  }
  return map[status] || '未知'
}

// 获取优先级类型
const getPriorityType = (priority) => {
  const map = {
    high: 'danger',
    medium: 'warning',
    low: 'info'
  }
  return map[priority] || 'info'
}

// 获取优先级文本
const getPriorityText = (priority) => {
  const map = {
    high: '高',
    medium: '中',
    low: '低'
  }
  return map[priority] || '中'
}

// 获取执行状态类型
const getExecutionStatusType = (status) => {
  const map = {
    pending: 'info',
    in_progress: 'warning',
    completed: 'success',
    failed: 'danger'
  }
  return map[status] || 'info'
}

// 获取执行状态文本
const getExecutionStatusText = (status) => {
  const map = {
    pending: '待执行',
    in_progress: '执行中',
    completed: '已完成',
    failed: '执行失败'
  }
  return map[status] || '待执行'
}

// 获取任务进度
const getTaskProgress = (task) => {
  const completed = task.tasks.filter(item => item.executionStatus === 'completed').length
  return task.tasks.length > 0 ? Math.round((completed / task.tasks.length) * 100) : 0
}

// 获取已完成数量
const getCompletedCount = (task) => {
  return task.tasks.filter(item => item.executionStatus === 'completed').length
}

// 获取进度条颜色
const getProgressColor = (status) => {
  const map = {
    pending: '#909399',
    in_progress: '#e6a23c',
    completed: '#67c23a'
  }
  return map[status] || '#909399'
}

// 加载清单及任务
const loadWorkLists = async () => {
  loading.value = true
  try {
    const list = await fetchWorkLists(filterStatus.value || undefined)
    const details = await Promise.all(
      (list || []).map(async (w) => {
        const detail = await fetchWorkListDetail(w.id)
        return {
          ...detail.workList,
          tasks: detail.items || []
        }
      })
    )
    workLists.value = details
  } catch (e) {
    ElMessage.error('加载任务列表失败')
  } finally {
    loading.value = false
  }
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

onMounted(() => {
  loadWorkLists()
})
</script>

<style scoped lang="scss">
.task-execution-container {
  padding: 20px;
  background: #f5f7fa;
  min-height: calc(100vh - 60px);
}

.execution-card {
  max-width: 1200px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
}

.empty-state {
  padding: 40px 0;
}

.task-list {
  .task-card {
    margin-bottom: 20px;
  }

  .task-header {
    .task-title-section {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;

      h3 {
        margin: 0;
        font-size: 18px;
      }
    }

    .task-meta {
      display: flex;
      gap: 20px;
      font-size: 12px;
      color: #909399;
      margin-top: 5px;
    }
  }

  .task-description {
    color: #606266;
    line-height: 1.6;
    margin-bottom: 10px;
  }

  .task-items {
    .task-item {
      padding: 15px;
      margin-bottom: 15px;
      border: 1px solid #ebeef5;
      border-radius: 4px;
      background: #fff;
      transition: all 0.3s;

      &.task-item-completed {
        background: #f0f9ff;
        border-color: #67c23a;
      }

      &.task-item-in-progress {
        background: #fef0e6;
        border-color: #e6a23c;
      }

      .task-item-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;

        .task-item-info {
          display: flex;
          align-items: center;
          flex: 1;

          .task-item-name {
            font-weight: 500;
            margin-left: 8px;
          }
        }
      }

      .task-item-description {
        color: #606266;
        font-size: 14px;
        margin: 10px 0;
        line-height: 1.6;
      }

      .task-item-time {
        color: #909399;
        font-size: 12px;
        margin: 5px 0;
      }

      .task-item-feedback {
        margin-top: 10px;

        .feedback-content {
          .feedback-label {
            font-weight: 500;
            margin-bottom: 5px;
          }

          .feedback-text {
            color: #606266;
            line-height: 1.6;
            margin-bottom: 5px;
          }

          .feedback-time {
            color: #909399;
            font-size: 12px;
          }
        }
      }

      .task-item-actions {
        margin-top: 10px;
      }
    }
  }

  .task-progress {
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px solid #ebeef5;

    .progress-text {
      margin-top: 10px;
      text-align: center;
      color: #606266;
      font-size: 14px;
    }
  }
}
</style>

