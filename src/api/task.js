import { localRequest } from '@/utils/request'

// 模板相关
export function fetchTemplates() {
  return localRequest({
    url: '/templates',
    method: 'get'
  })
}

export function fetchTemplateDetail(id) {
  return localRequest({
    url: `/templates/${id}`,
    method: 'get'
  })
}

export function createTemplate(payload) {
  return localRequest({
    url: '/templates',
    method: 'post',
    data: payload
  })
}

export function updateTemplate(id, payload) {
  return localRequest({
    url: `/templates/${id}`,
    method: 'put',
    data: payload
  })
}

export function deleteTemplate(id) {
  return localRequest({
    url: `/templates/${id}`,
    method: 'delete'
  })
}

// 工作清单（工作任务）相关
export function createWorkList(payload) {
  return localRequest({
    url: '/work-lists',
    method: 'post',
    data: payload
  })
}

export function fetchWorkLists(status) {
  return localRequest({
    url: '/work-lists',
    method: 'get',
    params: status ? { status } : {}
  })
}

export function fetchWorkListDetail(id) {
  return localRequest({
    url: `/work-lists/${id}`,
    method: 'get'
  })
}

// 执行反馈相关
export function submitExecution(payload) {
  return localRequest({
    url: '/executions',
    method: 'post',
    data: payload
  })
}

export function fetchExecutionRecords(workListId, workListItemId) {
  return localRequest({
    url: '/executions',
    method: 'get',
    params: { workListId, workListItemId }
  })
}



