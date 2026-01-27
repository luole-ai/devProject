package com.example.task.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TaskExecutionRequest {
    private Long workListId;
    private Long workListItemId;
    private String executor;
    private String status;
    private String feedback;
    private LocalDateTime completedAt;
}


