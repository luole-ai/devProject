package com.example.task.service;

import com.example.task.dto.TaskExecutionRequest;
import com.example.task.entity.TaskExecutionRecord;

import java.util.List;

public interface TaskExecutionService {

    void submitExecution(TaskExecutionRequest request);

    List<TaskExecutionRecord> getRecordsByWorkListItem(Long workListId, Long workListItemId);
}


