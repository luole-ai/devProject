import { xibuyjRequest } from '@/utils/request'
// 如需使用mock数据，取消下面的注释并注释掉对应的真实接口调用
import {
  mockGetTaskList,
  mockGetTaskDetail,
  mockCreateMemo,
  mockCreateTaskHandover,
  mockUpdateTaskHandover,
  mockGetEmployeeName,
  mockMarkTaskAsRead,
  mockDeleteTask,
  mockGetTaskComments,
  mockAddTaskComment,
  mockGetUnreadCommentCount,
  mockGetAllUnreadCounts,
  mockMarkCommentsAsRead
} from '@/mock/shiftHandover'

// 获取任务列表（我的任务、交接任务、被交接任务）
export function getTaskList(params) {
  return mockGetTaskList(params) // 使用mock数据
//   return xibuyjRequest({
//     url: '/shift-handover/tasks',
//     method: 'get',
//     params
//   })
}

// 获取任务详情
export function getTaskDetail(id) {
  return mockGetTaskDetail(id) // 使用mock数据
//   return xibuyjRequest({
//     url: `/shift-handover/tasks/${id}`,
//     method: 'get'
//   })
}

// 创建备忘录
export function createMemo(data) {
  return mockCreateMemo(data) // 使用mock数据
//   return xibuyjRequest({
//     url: '/shift-handover/memos',
//     method: 'post',
//     data
//   })
}

// 创建任务交接
export function createTaskHandover(data) {
  return mockCreateTaskHandover(data) // 使用mock数据
//   return xibuyjRequest({
//     url: '/shift-handover/tasks',
//     method: 'post',
//     data
//   })
}

// 更新任务交接
export function updateTaskHandover(id, data) {
  return mockUpdateTaskHandover(id, data) // 使用mock数据
//   return xibuyjRequest({
//     url: `/shift-handover/tasks/${id}`,
//     method: 'put',
//     data
//   })
}

// 根据工号查询员工姓名
export function getEmployeeName(employeeId) {
  return mockGetEmployeeName(employeeId) // 使用mock数据
//   return xibuyjRequest({
//     url: `/shift-handover/employees/${employeeId}`,
//     method: 'get'
//   })
}

// 标记任务为已读
export function markTaskAsRead(id) {
  return mockMarkTaskAsRead(id) // 使用mock数据
//   return xibuyjRequest({
//     url: `/shift-handover/tasks/${id}/read`,
//     method: 'put'
//   })
}

// 删除任务
export function deleteTask(id) {
  return mockDeleteTask(id) // 使用mock数据
//   return xibuyjRequest({
//     url: `/shift-handover/tasks/${id}`,
//     method: 'delete'
//   })
}

// 获取任务沟通记录
export function getTaskComments(taskId) {
  return mockGetTaskComments(taskId) // 使用mock数据
//   return xibuyjRequest({
//     url: `/shift-handover/tasks/${taskId}/comments`,
//     method: 'get'
//   })
}

// 添加任务反馈/沟通记录
export function addTaskComment(taskId, data) {
  return mockAddTaskComment(taskId, data) // 使用mock数据
//   return xibuyjRequest({
//     url: `/shift-handover/tasks/${taskId}/comments`,
//     method: 'post',
//     data
//   })
}

// 获取任务的未读消息数量
export function getUnreadCommentCount(taskId) {
  return mockGetUnreadCommentCount(taskId) // 使用mock数据
//   return xibuyjRequest({
//     url: `/shift-handover/tasks/${taskId}/unread-count`,
//     method: 'get'
//   })
}

// 获取所有任务的未读消息数量汇总
export function getAllUnreadCounts() {
  return mockGetAllUnreadCounts() // 使用mock数据
//   return xibuyjRequest({
//     url: '/shift-handover/unread-counts',
//     method: 'get'
//   })
}

// 标记任务的沟通记录为已读
export function markCommentsAsRead(taskId, commentIds) {
  return mockMarkCommentsAsRead(taskId, commentIds) // 使用mock数据
//   return xibuyjRequest({
//     url: `/shift-handover/tasks/${taskId}/comments/read`,
//     method: 'put',
//     data: { commentIds }
//   })
}

