// 模拟班次交接数据

// 模拟员工数据
const employees = {
  'A12345678': { name: '张三', id: 'A12345678' },
  'B12345678': { name: '李四', id: 'B12345678' },
  'C12345678': { name: '王五', id: 'C12345678' },
  'D12345678': { name: '赵六', id: 'D12345678' }
}

// 模拟任务数据存储
let tasks = [
  {
    id: 1,
    type: 'memo',
    title: '今日工作备忘',
    content: '1. 完成系统测试\n2. 提交代码审查\n3. 准备明日会议材料',
    createTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updateTime: null,
    isRead: true,
    handoverFromId: null,
    handoverFromName: null,
    handoverToId: null,
    handoverToName: null
  },
  {
    id: 2,
    type: 'task',
    title: '设备维护任务交接',
    content: '设备A需要定期维护，请在下班前完成检查',
    createTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    updateTime: null,
    isRead: false,
    handoverFromId: 'A12345678',
    handoverFromName: '张三',
    handoverToId: 'B12345678',
    handoverToName: '李四'
  },
  {
    id: 3,
    type: 'task',
    title: '客户反馈处理',
    content: '客户反馈的问题已解决，需要跟进确认',
    createTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    updateTime: null,
    isRead: false,
    handoverFromId: 'C12345678',
    handoverFromName: '王五',
    handoverToId: 'A12345678',
    handoverToName: '张三'
  }
]

let nextId = 4

// 模拟沟通记录数据存储
let comments = [
  {
    id: 1,
    taskId: 2,
    content: '收到，我会在下班前完成设备检查',
    createTime: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
    userId: 'B12345678',
    userName: '李四',
    userRole: 'handoverTo', // handoverFrom: 发布者, handoverTo: 被交接者
    isRead: false // 是否已读
  },
  {
    id: 2,
    taskId: 2,
    content: '好的，检查完成后请告知我结果',
    createTime: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    userId: 'A12345678',
    userName: '张三',
    userRole: 'handoverFrom',
    isRead: true
  },
  {
    id: 3,
    taskId: 3,
    content: '收到，我会尽快跟进确认',
    createTime: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    userId: 'A12345678',
    userName: '张三',
    userRole: 'handoverTo',
    isRead: false
  }
]

let nextCommentId = 4

// 模拟已读记录：记录用户对每条消息的已读状态
// 格式：{ userId_taskId_commentId: true }
let readRecords = {
  'A12345678_2_2': true // 用户A12345678已读任务2的评论2
}

// 获取任务列表
export function mockGetTaskList(params) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const currentUserId = 'A12345678' // 模拟当前用户ID
      
      const myTasks = tasks.filter(task => 
        task.handoverFromId === currentUserId || 
        (task.handoverFromId === null && task.handoverToId === null)
      )
      
      const handoverTasks = tasks.filter(task => 
        task.type === 'task' && 
        task.handoverFromId === currentUserId && 
        task.handoverToId !== null
      )
      
      const handoveredTasks = tasks.filter(task => 
        task.type === 'task' && 
        task.handoverToId === currentUserId
      )
      
      resolve({
        code: 200,
        message: '获取成功',
        data: {
          myTasks,
          handoverTasks,
          handoveredTasks
        }
      })
    }, 300)
  })
}

// 获取任务详情
export function mockGetTaskDetail(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const task = tasks.find(t => t.id === parseInt(id))
      if (task) {
        resolve({
          code: 200,
          message: '获取成功',
          data: task
        })
      } else {
        reject({
          code: 404,
          message: '任务不存在'
        })
      }
    }, 300)
  })
}

// 创建备忘录
export function mockCreateMemo(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newTask = {
        id: nextId++,
        type: 'memo',
        title: data.title,
        content: data.content,
        createTime: new Date().toISOString(),
        updateTime: null,
        isRead: true,
        handoverFromId: null,
        handoverFromName: null,
        handoverToId: null,
        handoverToName: null
      }
      tasks.push(newTask)
      
      resolve({
        code: 200,
        message: '创建成功',
        data: newTask
      })
    }, 300)
  })
}

// 创建任务交接
export function mockCreateTaskHandover(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const employee = employees[data.handoverToId]
      if (!employee) {
        reject({
          code: 400,
          message: '交接人工号不存在'
        })
        return
      }
      
      const currentUserId = 'A12345678' // 模拟当前用户ID
      const currentUserName = employees[currentUserId]?.name || '当前用户'
      
      const newTask = {
        id: nextId++,
        type: 'task',
        title: data.title,
        content: data.content,
        createTime: new Date().toISOString(),
        updateTime: null,
        isRead: false,
        handoverFromId: currentUserId,
        handoverFromName: currentUserName,
        handoverToId: data.handoverToId,
        handoverToName: employee.name
      }
      tasks.push(newTask)
      
      resolve({
        code: 200,
        message: '创建成功',
        data: newTask
      })
    }, 300)
  })
}

// 更新任务交接
export function mockUpdateTaskHandover(id, data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const taskIndex = tasks.findIndex(t => t.id === parseInt(id))
      if (taskIndex === -1) {
        reject({
          code: 404,
          message: '任务不存在'
        })
        return
      }
      
      const task = tasks[taskIndex]
      
      // 如果更新了交接人，需要验证
      if (data.handoverToId && data.handoverToId !== task.handoverToId) {
        const employee = employees[data.handoverToId]
        if (!employee) {
          reject({
            code: 400,
            message: '交接人工号不存在'
          })
          return
        }
        task.handoverToId = data.handoverToId
        task.handoverToName = employee.name
        task.isRead = false // 更新后标记为未读
      }
      
      task.title = data.title || task.title
      task.content = data.content || task.content
      task.updateTime = new Date().toISOString()
      
      resolve({
        code: 200,
        message: '更新成功',
        data: task
      })
    }, 300)
  })
}

// 根据工号查询员工姓名
export function mockGetEmployeeName(employeeId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const employee = employees[employeeId]
      if (employee) {
        resolve({
          code: 200,
          message: '查询成功',
          data: {
            id: employee.id,
            name: employee.name
          }
        })
      } else {
        reject({
          code: 404,
          message: '未找到该工号对应的员工'
        })
      }
    }, 300)
  })
}

// 标记任务为已读
export function mockMarkTaskAsRead(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const task = tasks.find(t => t.id === parseInt(id))
      if (task) {
        task.isRead = true
        resolve({
          code: 200,
          message: '标记成功',
          data: task
        })
      } else {
        reject({
          code: 404,
          message: '任务不存在'
        })
      }
    }, 300)
  })
}

// 删除任务
export function mockDeleteTask(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const taskIndex = tasks.findIndex(t => t.id === parseInt(id))
      if (taskIndex === -1) {
        reject({
          code: 404,
          message: '任务不存在'
        })
        return
      }
      
      tasks.splice(taskIndex, 1)
      // 同时删除该任务的所有沟通记录
      comments = comments.filter(c => c.taskId !== parseInt(id))
      // 删除相关的已读记录
      Object.keys(readRecords).forEach(key => {
        if (key.includes(`_${id}_`)) {
          delete readRecords[key]
        }
      })
      
      resolve({
        code: 200,
        message: '删除成功'
      })
    }, 300)
  })
}

// 获取任务沟通记录
export function mockGetTaskComments(taskId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const task = tasks.find(t => t.id === parseInt(taskId))
      if (!task) {
        reject({
          code: 404,
          message: '任务不存在'
        })
        return
      }
      
      const taskComments = comments
        .filter(c => c.taskId === parseInt(taskId))
        .sort((a, b) => new Date(a.createTime) - new Date(b.createTime))
      
      resolve({
        code: 200,
        message: '获取成功',
        data: taskComments
      })
    }, 300)
  })
}

// 添加任务反馈/沟通记录
export function mockAddTaskComment(taskId, data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const task = tasks.find(t => t.id === parseInt(taskId))
      if (!task) {
        reject({
          code: 404,
          message: '任务不存在'
        })
        return
      }
      
      const currentUserId = 'A12345678' // 模拟当前用户ID
      const currentUserName = employees[currentUserId]?.name || '当前用户'
      
      // 判断当前用户角色
      let userRole = 'handoverFrom'
      if (task.handoverToId === currentUserId) {
        userRole = 'handoverTo'
      } else if (task.handoverFromId === currentUserId) {
        userRole = 'handoverFrom'
      } else if (task.type === 'memo') {
        // 备忘录只有创建者可以评论
        userRole = 'handoverFrom'
      }
      
      const newComment = {
        id: nextCommentId++,
        taskId: parseInt(taskId),
        content: data.content,
        createTime: new Date().toISOString(),
        userId: currentUserId,
        userName: currentUserName,
        userRole: userRole,
        isRead: false // 新消息默认未读
      }
      
      comments.push(newComment)
      
      // 如果是任务交接，标记任务为未读（给对方）
      if (task.type === 'task') {
        if (userRole === 'handoverFrom') {
          // 发布者回复，被交接者未读
          task.isRead = false
        } else {
          // 被交接者回复，发布者未读（这里需要根据实际情况判断）
          // 暂时不处理，因为isRead是全局的
        }
      }
      
      resolve({
        code: 200,
        message: '添加成功',
        data: newComment
      })
    }, 300)
  })
}

// 获取任务的未读消息数量
export function mockGetUnreadCommentCount(taskId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const task = tasks.find(t => t.id === parseInt(taskId))
      if (!task) {
        reject({
          code: 404,
          message: '任务不存在'
        })
        return
      }
      
      const currentUserId = 'A12345678' // 模拟当前用户ID
      
      // 获取该任务的所有评论
      const taskComments = comments.filter(c => c.taskId === parseInt(taskId))
      
      // 计算未读数量：当前用户未读的评论（不是自己发的，且未读）
      const unreadCount = taskComments.filter(comment => {
        // 自己发的消息不算未读
        if (comment.userId === currentUserId) {
          return false
        }
        
        // 检查是否已读
        const readKey = `${currentUserId}_${taskId}_${comment.id}`
        return !readRecords[readKey]
      }).length
      
      resolve({
        code: 200,
        message: '获取成功',
        data: {
          taskId: parseInt(taskId),
          unreadCount
        }
      })
    }, 300)
  })
}

// 获取所有任务的未读消息数量汇总
export function mockGetAllUnreadCounts() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const currentUserId = 'A12345678' // 模拟当前用户ID
      const unreadCounts = {}
      
      // 遍历所有任务
      tasks.forEach(task => {
        if (task.type === 'task') {
          const taskComments = comments.filter(c => c.taskId === task.id)
          const unreadCount = taskComments.filter(comment => {
            // 自己发的消息不算未读
            if (comment.userId === currentUserId) {
              return false
            }
            
            // 检查是否已读
            const readKey = `${currentUserId}_${task.id}_${comment.id}`
            return !readRecords[readKey]
          }).length
          
          if (unreadCount > 0) {
            unreadCounts[task.id] = unreadCount
          }
        }
      })
      
      resolve({
        code: 200,
        message: '获取成功',
        data: unreadCounts
      })
    }, 300)
  })
}

// 标记任务的沟通记录为已读
export function mockMarkCommentsAsRead(taskId, commentIds) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const task = tasks.find(t => t.id === parseInt(taskId))
      if (!task) {
        reject({
          code: 404,
          message: '任务不存在'
        })
        return
      }
      
      const currentUserId = 'A12345678' // 模拟当前用户ID
      
      // 如果传入了commentIds，只标记指定的评论
      // 如果没有传入，标记该任务的所有未读评论为已读
      const commentsToMark = commentIds && commentIds.length > 0
        ? commentIds
        : comments
            .filter(c => c.taskId === parseInt(taskId) && c.userId !== currentUserId)
            .map(c => c.id)
      
      // 标记为已读
      commentsToMark.forEach(commentId => {
        const readKey = `${currentUserId}_${taskId}_${commentId}`
        readRecords[readKey] = true
      })
      
      resolve({
        code: 200,
        message: '标记成功',
        data: {
          taskId: parseInt(taskId),
          markedCount: commentsToMark.length
        }
      })
    }, 300)
  })
}


