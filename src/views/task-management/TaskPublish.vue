<template>
  <div class="task-publish-container">
    <el-card class="publish-card">
      <template #header>
        <div class="card-header">
          <span>任务发布</span>
          <el-button type="primary" @click="showTemplateDialog = true">
            <el-icon><Plus /></el-icon>
            管理模板
          </el-button>
        </div>
      </template>

      <el-form :model="form" label-width="120px" ref="formRef">
        <el-form-item label="任务标题" required>
          <el-input v-model="form.title" placeholder="请输入任务标题" />
        </el-form-item>

        <el-form-item label="任务描述">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入任务描述"
          />
        </el-form-item>

        <el-form-item label="选择模板">
          <el-select
            v-model="selectedTemplateId"
            placeholder="选择模板快速创建任务"
            clearable
            :loading="loadingTemplates"
            @change="loadTemplate"
            style="width: 100%"
          >
            <el-option
              v-for="template in templateOptions"
              :key="template.id"
              :label="template.name"
              :value="template.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="任务清单" required>
          <div class="task-list">
            <div
              v-for="(task, index) in form.tasks"
              :key="task.id"
              class="task-item"
            >
              <el-card shadow="hover">
                <div class="task-item-header">
                  <span class="task-index">任务 {{ index + 1 }}</span>
                  <el-button
                    type="danger"
                    size="small"
                    :icon="Delete"
                    @click="removeTask(index)"
                    circle
                  />
                </div>
                <el-form-item
                  :label="`任务名称`"
                  style="margin-top: 10px"
                >
                  <el-input
                    v-model="task.name"
                    placeholder="请输入任务名称"
                  />
                </el-form-item>
                <el-form-item label="任务描述">
                  <el-input
                    v-model="task.description"
                    type="textarea"
                    :rows="2"
                    placeholder="请输入任务描述"
                  />
                </el-form-item>
                <el-form-item label="优先级">
                  <el-select v-model="task.priority" placeholder="选择优先级">
                    <el-option label="高" value="high" />
                    <el-option label="中" value="medium" />
                    <el-option label="低" value="low" />
                  </el-select>
                </el-form-item>
                <el-form-item label="预计完成时间">
                  <el-date-picker
                    v-model="task.estimatedTime"
                    type="datetime"
                    placeholder="选择预计完成时间"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-card>
            </div>
            <el-button
              type="dashed"
              @click="addTask"
              style="width: 100%; margin-top: 10px"
            >
              <el-icon><Plus /></el-icon>
              添加任务
            </el-button>
          </div>
        </el-form-item>

        <el-form-item label="分配给">
          <el-select
            v-model="form.assignedTo"
            multiple
            placeholder="选择执行人员（可多选）"
            style="width: 100%"
          >
            <el-option label="用户A" value="userA" />
            <el-option label="用户B" value="userB" />
            <el-option label="用户C" value="userC" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handlePublish" :loading="publishing">
            发布任务
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 模板管理对话框 -->
    <el-dialog
      v-model="showTemplateDialog"
      title="模板管理"
      width="80%"
      :close-on-click-modal="false"
    >
      <template-management
        @template-selected="handleTemplateSelected"
        @close="showTemplateDialog = false"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'
import TemplateManagement from '@/components/TemplateManagement.vue'
import { fetchTemplates, fetchTemplateDetail, createWorkList } from '@/api/task'

const formRef = ref(null)
const showTemplateDialog = ref(false)
const selectedTemplateId = ref(null)
const publishing = ref(false)

const loadingTemplates = ref(false)
const templates = ref([])

const form = reactive({
  title: '',
  description: '',
  tasks: [],
  assignedTo: [],
  templateId: null
})

const templateOptions = computed(() => templates.value || [])

// 添加任务
const addTask = () => {
  form.tasks.push({
    id: Date.now().toString(),
    name: '',
    description: '',
    priority: 'medium',
    estimatedTime: null
  })
}

// 移除任务
const removeTask = (index) => {
  form.tasks.splice(index, 1)
}

// 加载模板详情并填充任务
const loadTemplate = async (templateId) => {
  if (!templateId) return

  try {
    const res = await fetchTemplateDetail(templateId)
    const items = res.items || []
    form.templateId = templateId
    form.tasks = items.map((task, index) => ({
      id: `${Date.now()}-${index}`,
      name: task.name,
      description: task.description,
      priority: task.priority || 'medium',
      estimatedTime: null
    }))
    ElMessage.success('模板加载成功，您可以对任务进行微调')
  } catch (e) {
    ElMessage.error('加载模板失败')
  }
}

// 处理模板选择
const handleTemplateSelected = (templateId) => {
  selectedTemplateId.value = templateId
  loadTemplate(templateId)
  showTemplateDialog.value = false
}

// 发布任务
const handlePublish = async () => {
  if (!form.title) {
    ElMessage.warning('请输入任务标题')
    return
  }

  if (form.tasks.length === 0) {
    ElMessage.warning('请至少添加一个任务')
    return
  }

  for (let i = 0; i < form.tasks.length; i++) {
    const task = form.tasks[i]
    if (!task.name) {
      ElMessage.warning(`请填写任务 ${i + 1} 的名称`)
      return
    }
  }

  publishing.value = true

  try {
    const payload = {
      title: form.title,
      description: form.description,
      templateId: form.templateId,
      publisher: '系统管理员',
      assignedTo: [...form.assignedTo],
      tasks: form.tasks.map(t => ({
        name: t.name,
        description: t.description,
        priority: t.priority,
        estimatedTime: t.estimatedTime
      }))
    }

    await createWorkList(payload)

    ElMessage.success('任务发布成功！')
    handleReset()
  } catch (error) {
    ElMessage.error('任务发布失败')
  } finally {
    publishing.value = false
  }
}

// 重置表单
const handleReset = () => {
  form.title = ''
  form.description = ''
  form.tasks = []
  form.assignedTo = []
  form.templateId = null
  selectedTemplateId.value = null
  formRef.value?.resetFields()
}

const loadTemplateList = async () => {
  loadingTemplates.value = true
  try {
    const res = await fetchTemplates()
    templates.value = res || []
  } catch (e) {
    ElMessage.error('加载模板列表失败')
  } finally {
    loadingTemplates.value = false
  }
}

onMounted(() => {
  loadTemplateList()
})
</script>

<style scoped lang="scss">
.task-publish-container {
  padding: 20px;
  background: #f5f7fa;
  min-height: calc(100vh - 60px);
}

.publish-card {
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

.task-list {
  width: 100%;
}

.task-item {
  margin-bottom: 15px;
  
  .task-item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    
    .task-index {
      font-weight: bold;
      color: #409eff;
    }
  }
}

:deep(.el-card__body) {
  padding: 15px;
}
</style>

