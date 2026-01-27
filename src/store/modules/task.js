// 任务管理模块
const state = {
  // 模板列表
  templates: JSON.parse(localStorage.getItem('task_templates') || '[]'),
  // 已发布的任务列表
  publishedTasks: JSON.parse(localStorage.getItem('published_tasks') || '[]'),
  // 任务执行记录
  taskExecutions: JSON.parse(localStorage.getItem('task_executions') || '[]')
}

const mutations = {
  // 模板相关
  SET_TEMPLATES(state, templates) {
    state.templates = templates
    localStorage.setItem('task_templates', JSON.stringify(templates))
  },
  ADD_TEMPLATE(state, template) {
    const newTemplate = {
      id: Date.now().toString(),
      name: template.name,
      description: template.description || '',
      tasks: template.tasks || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    state.templates.push(newTemplate)
    localStorage.setItem('task_templates', JSON.stringify(state.templates))
  },
  UPDATE_TEMPLATE(state, { id, template }) {
    const index = state.templates.findIndex(t => t.id === id)
    if (index !== -1) {
      state.templates[index] = {
        ...state.templates[index],
        ...template,
        updatedAt: new Date().toISOString()
      }
      localStorage.setItem('task_templates', JSON.stringify(state.templates))
    }
  },
  DELETE_TEMPLATE(state, id) {
    state.templates = state.templates.filter(t => t.id !== id)
    localStorage.setItem('task_templates', JSON.stringify(state.templates))
  },

  // 已发布任务相关
  SET_PUBLISHED_TASKS(state, tasks) {
    state.publishedTasks = tasks
    localStorage.setItem('published_tasks', JSON.stringify(tasks))
  },
  ADD_PUBLISHED_TASK(state, task) {
    const newTask = {
      id: Date.now().toString(),
      title: task.title,
      description: task.description || '',
      tasks: task.tasks || [],
      publisher: task.publisher || '系统管理员',
      publishedAt: new Date().toISOString(),
      status: 'pending', // pending: 待执行, in_progress: 执行中, completed: 已完成
      assignedTo: task.assignedTo || [],
      templateId: task.templateId || null
    }
    state.publishedTasks.push(newTask)
    localStorage.setItem('published_tasks', JSON.stringify(state.publishedTasks))
  },
  UPDATE_PUBLISHED_TASK(state, { id, task }) {
    const index = state.publishedTasks.findIndex(t => t.id === id)
    if (index !== -1) {
      state.publishedTasks[index] = {
        ...state.publishedTasks[index],
        ...task
      }
      localStorage.setItem('published_tasks', JSON.stringify(state.publishedTasks))
    }
  },
  DELETE_PUBLISHED_TASK(state, id) {
    state.publishedTasks = state.publishedTasks.filter(t => t.id !== id)
    localStorage.setItem('published_tasks', JSON.stringify(state.publishedTasks))
  },

  // 任务执行记录相关
  SET_TASK_EXECUTIONS(state, executions) {
    state.taskExecutions = executions
    localStorage.setItem('task_executions', JSON.stringify(executions))
  },
  ADD_TASK_EXECUTION(state, execution) {
    const newExecution = {
      id: Date.now().toString(),
      taskId: execution.taskId,
      taskItemId: execution.taskItemId,
      executor: execution.executor || '当前用户',
      status: execution.status || 'pending', // pending, completed, failed
      feedback: execution.feedback || '',
      completedAt: execution.completedAt || null,
      attachments: execution.attachments || []
    }
    state.taskExecutions.push(newExecution)
    localStorage.setItem('task_executions', JSON.stringify(state.taskExecutions))
  },
  UPDATE_TASK_EXECUTION(state, { id, execution }) {
    const index = state.taskExecutions.findIndex(e => e.id === id)
    if (index !== -1) {
      state.taskExecutions[index] = {
        ...state.taskExecutions[index],
        ...execution,
        updatedAt: new Date().toISOString()
      }
      localStorage.setItem('task_executions', JSON.stringify(state.taskExecutions))
    }
  }
}

const actions = {
  // 模板操作
  createTemplate({ commit }, template) {
    commit('ADD_TEMPLATE', template)
  },
  updateTemplate({ commit }, { id, template }) {
    commit('UPDATE_TEMPLATE', { id, template })
  },
  deleteTemplate({ commit }, id) {
    commit('DELETE_TEMPLATE', id)
  },

  // 发布任务
  publishTask({ commit }, task) {
    commit('ADD_PUBLISHED_TASK', task)
  },
  updatePublishedTask({ commit }, { id, task }) {
    commit('UPDATE_PUBLISHED_TASK', { id, task })
  },
  deletePublishedTask({ commit }, id) {
    commit('DELETE_PUBLISHED_TASK', id)
  },

  // 任务执行
  submitTaskExecution({ commit }, execution) {
    commit('ADD_TASK_EXECUTION', execution)
    
    // 更新任务项的执行状态
    const taskId = execution.taskId
    const taskItemId = execution.taskItemId
    
    // 获取已发布的任务
    const publishedTask = state.publishedTasks.find(t => t.id === taskId)
    if (publishedTask) {
      const taskItem = publishedTask.tasks.find(item => item.id === taskItemId)
      if (taskItem) {
        taskItem.executionStatus = execution.status
        taskItem.feedback = execution.feedback
        taskItem.completedAt = execution.completedAt
        
        // 检查是否所有任务都已完成
        const allCompleted = publishedTask.tasks.every(item => 
          item.executionStatus === 'completed'
        )
        if (allCompleted) {
          commit('UPDATE_PUBLISHED_TASK', {
            id: taskId,
            task: { status: 'completed' }
          })
        } else {
          const hasInProgress = publishedTask.tasks.some(item => 
            item.executionStatus === 'in_progress' || item.executionStatus === 'completed'
          )
          if (hasInProgress && publishedTask.status === 'pending') {
            commit('UPDATE_PUBLISHED_TASK', {
              id: taskId,
              task: { status: 'in_progress' }
            })
          }
        }
      }
    }
  },
  updateTaskExecution({ commit, state }, { id, execution }) {
    commit('UPDATE_TASK_EXECUTION', { id, execution })
    
    // 更新任务项的执行状态
    const executionRecord = state.taskExecutions.find(e => e.id === id)
    if (executionRecord) {
      const taskId = executionRecord.taskId
      const taskItemId = executionRecord.taskItemId
      
      // 获取已发布的任务
      const publishedTask = state.publishedTasks.find(t => t.id === taskId)
      if (publishedTask) {
        const taskItem = publishedTask.tasks.find(item => item.id === taskItemId)
        if (taskItem) {
          taskItem.executionStatus = execution.status
          taskItem.feedback = execution.feedback
          taskItem.completedAt = execution.completedAt
          
          // 检查是否所有任务都已完成
          const allCompleted = publishedTask.tasks.every(item => 
            item.executionStatus === 'completed'
          )
          if (allCompleted) {
            commit('UPDATE_PUBLISHED_TASK', {
              id: taskId,
              task: { status: 'completed' }
            })
          } else {
            const hasInProgress = publishedTask.tasks.some(item => 
              item.executionStatus === 'in_progress' || item.executionStatus === 'completed'
            )
            if (hasInProgress && publishedTask.status === 'pending') {
              commit('UPDATE_PUBLISHED_TASK', {
                id: taskId,
                task: { status: 'in_progress' }
              })
            }
          }
        }
      }
    }
  }
}

const getters = {
  // 获取所有模板
  allTemplates: state => state.templates,
  // 根据ID获取模板
  getTemplateById: state => id => {
    return state.templates.find(t => t.id === id)
  },
  // 获取所有已发布的任务
  allPublishedTasks: state => state.publishedTasks,
  // 根据ID获取已发布的任务
  getPublishedTaskById: state => id => {
    return state.publishedTasks.find(t => t.id === id)
  },
  // 获取任务执行记录
  getTaskExecutions: state => taskId => {
    return state.taskExecutions.filter(e => e.taskId === taskId)
  },
  // 获取任务项的执行记录
  getTaskItemExecution: state => (taskId, taskItemId) => {
    return state.taskExecutions.find(e => 
      e.taskId === taskId && e.taskItemId === taskItemId
    )
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}

