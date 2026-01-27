package com.example.task.controller;

import com.example.task.dto.TaskExecutionRequest;
import com.example.task.entity.TaskExecutionRecord;
import com.example.task.service.TaskExecutionService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

@RestController
@RequestMapping("/api/executions")
public class TaskExecutionController {

    @Resource
    private TaskExecutionService executionService;

    @PostMapping
    public void submitExecution(@RequestBody TaskExecutionRequest request) {
        executionService.submitExecution(request);
    }

    @GetMapping
    public List<TaskExecutionRecord> getRecords(@RequestParam Long workListId,
                                                @RequestParam Long workListItemId) {
        return executionService.getRecordsByWorkListItem(workListId, workListItemId);
    }
}


