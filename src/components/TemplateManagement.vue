<template>
  <div class="template-management">
    <div class="template-header">
      <el-button type="primary" @click="showCreateDialog = true">
        <el-icon><Plus /></el-icon>
        创建新模板
      </el-button>
    </div>

    <el-table :data="templates" style="width: 100%" v-loading="loading">
      <el-table-column prop="name" label="模板名称" width="200" />
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="tasks.length" label="任务数量" width="120" />
      <el-table-column prop="createdAt" label="创建时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column prop="updatedAt" label="更新时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.updatedAt) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250" fixed="right">
        <template #default="{ row }">
          <el-button
            type="primary"
            size="small"
            @click="selectTemplate(row.id)"
          >
            使用
          </el-button>
          <el-button
            type="warning"
            size="small"
            @click="editTemplate(row)"
          >
            编辑
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="deleteTemplate(row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 创建/编辑模板对话框 -->
    <el-dialog
      v-model="showCreateDialog"
      :title="editingTemplate ? '编辑模板' : '创建模板'"
      width="80%"
      :close-on-click-modal="false"
    >
      <el-form :model="templateForm" label-width="120px" ref="templateFormRef">
        <el-form-item label="模板名称" required>
          <el-input v-model="templateForm.name" placeholder="请输入模板名称" />
        </el-form-item>

        <el-form-item label="模板描述">
          <el-input
            v-model="templateForm.description"
            type="textarea"
            :rows="2"
            placeholder="请输入模板描述"
          />
        </el-form-item>

        <el-form-item label="任务列表" required>
          <div class="template-task-list">
            <div
              v-for="(task, index) in templateForm.tasks"
              :key="task.id"
              class="template-task-item"
            >
              <el-card shadow="hover">
                <div class="task-item-header">
                  <span class="task-index">任务 {{ index + 1 }}</span>
                  <el-button
                    type="danger"
                    size="small"
                    :icon="Delete"
                    @click="removeTemplateTask(index)"
                    circle
                  />
                </div>
                <el-form-item label="任务名称" style="margin-top: 10px">
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
              </el-card>
            </div>
            <el-button
              type="dashed"
              @click="addTemplateTask"
              style="width: 100%; margin-top: 10px"
            >
              <el-icon><Plus /></el-icon>
              添加任务
            </el-button>
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="cancelEdit">取消</el-button>
        <el-button type="primary" @click="saveTemplate">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'
import { fetchTemplates, createTemplate, updateTemplate, deleteTemplate as deleteTemplateApi } from '@/api/task'

const emit = defineEmits(['template-selected', 'close'])

const templateFormRef = ref(null)
const showCreateDialog = ref(false)
const editingTemplate = ref(null)
const loading = ref(false)

const templates = ref([])

const templateForm = reactive({
  name: '',
  description: '',
  tasks: []
})

// 添加任务
const addTemplateTask = () => {
  templateForm.tasks.push({
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    name: '',
    description: '',
    priority: 'medium'
  })
}

// 移除任务
const removeTemplateTask = (index) => {
  templateForm.tasks.splice(index, 1)
}

// 编辑模板
const editTemplate = (template) => {
  editingTemplate.value = template
  templateForm.name = template.name
  templateForm.description = template.description || ''
  templateForm.tasks = template.tasks.map(task => ({
    ...task,
    id: task.id || Date.now().toString() + Math.random().toString(36).substr(2, 9)
  }))
  showCreateDialog.value = true
}

// 保存模板
const saveTemplate = async () => {
  if (!templateForm.name) {
    ElMessage.warning('请输入模板名称')
    return
  }

  if (templateForm.tasks.length === 0) {
    ElMessage.warning('请至少添加一个任务')
    return
  }

  for (let i = 0; i < templateForm.tasks.length; i++) {
    const task = templateForm.tasks[i]
    if (!task.name) {
      ElMessage.warning(`请填写任务 ${i + 1} 的名称`)
      return
    }
  }

  const payload = {
    name: templateForm.name,
    description: templateForm.description,
    createdBy: '系统管理员',
    items: templateForm.tasks.map((t, index) => ({
      name: t.name,
      description: t.description,
      priority: t.priority,
      sortOrder: index + 1
    }))
  }

  try {
    if (editingTemplate.value) {
      await updateTemplate(editingTemplate.value.id, payload)
      ElMessage.success('模板更新成功')
    } else {
      await createTemplate(payload)
      ElMessage.success('模板创建成功')
    }

    await loadTemplates()
    cancelEdit()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 取消编辑
const cancelEdit = () => {
  showCreateDialog.value = false
  editingTemplate.value = null
  templateForm.name = ''
  templateForm.description = ''
  templateForm.tasks = []
  templateFormRef.value?.resetFields()
}

// 删除模板
const deleteTemplate = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这个模板吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await deleteTemplateApi(id)
    ElMessage.success('模板删除成功')
    await loadTemplates()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 选择模板
const selectTemplate = (id) => {
  emit('template-selected', id)
  emit('close')
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

const loadTemplates = async () => {
  loading.value = true
  try {
    const res = await fetchTemplates()
    templates.value = res || []
  } catch (e) {
    ElMessage.error('加载模板列表失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadTemplates()
})
</script>

<style scoped lang="scss">
.template-management {
  .template-header {
    margin-bottom: 20px;
  }

  .template-task-list {
    width: 100%;
  }

  .template-task-item {
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
}
</style>

