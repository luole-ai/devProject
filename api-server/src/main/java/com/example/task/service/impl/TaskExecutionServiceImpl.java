package com.example.task.service.impl;

import com.example.task.dto.TaskExecutionRequest;
import com.example.task.entity.TaskExecutionRecord;
import com.example.task.entity.WorkList;
import com.example.task.entity.WorkListItem;
import com.example.task.mapper.TaskExecutionRecordMapper;
import com.example.task.mapper.WorkListItemMapper;
import com.example.task.mapper.WorkListMapper;
import com.example.task.service.TaskExecutionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaskExecutionServiceImpl implements TaskExecutionService {

    @Resource
    private TaskExecutionRecordMapper executionRecordMapper;

    @Resource
    private WorkListItemMapper workListItemMapper;

    @Resource
    private WorkListMapper workListMapper;

    @Override
    @Transactional
    public void submitExecution(TaskExecutionRequest request) {
        // 写入执行记录
        TaskExecutionRecord record = new TaskExecutionRecord();
        record.setWorkListId(request.getWorkListId());
        record.setWorkListItemId(request.getWorkListItemId());
        record.setExecutor(request.getExecutor());
        record.setStatus(request.getStatus());
        record.setFeedback(request.getFeedback());
        record.setCompletedAt(request.getCompletedAt());
        executionRecordMapper.insert(record);

        // 更新任务项当前状态
        List<WorkListItem> items = workListItemMapper.selectByWorkListId(request.getWorkListId());
        WorkListItem currentItem = null;
        for (WorkListItem item : items) {
            if (item.getId().equals(request.getWorkListItemId())) {
                currentItem = item;
                break;
            }
        }
        if (currentItem != null) {
            currentItem.setExecutionStatus(request.getStatus());
            currentItem.setFeedback(request.getFeedback());
            currentItem.setCompletedAt(request.getCompletedAt());
            workListItemMapper.update(currentItem);
        }

        // 更新清单整体状态
        WorkList workList = workListMapper.selectById(request.getWorkListId());
        if (workList == null) {
            return;
        }

        boolean allCompleted = true;
        boolean hasInProgressOrCompleted = false;
        for (WorkListItem item : items) {
            String status = item.getExecutionStatus();
            if (!"completed".equals(status)) {
                allCompleted = false;
            }
            if ("in_progress".equals(status) || "completed".equals(status)) {
                hasInProgressOrCompleted = true;
            }
        }

        if (allCompleted) {
            workList.setStatus("completed");
        } else if (hasInProgressOrCompleted && "pending".equals(workList.getStatus())) {
            workList.setStatus("in_progress");
        }
        workList.setUpdatedAt(LocalDateTime.now());
        workListMapper.update(workList);
    }

    @Override
    public List<TaskExecutionRecord> getRecordsByWorkListItem(Long workListId, Long workListItemId) {
        return executionRecordMapper.selectByWorkListItem(workListId, workListItemId);
    }
}


