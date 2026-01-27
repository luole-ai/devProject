package com.example.task.entity;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TaskExecutionRecord {
    private Long id;
    private Long workListId;
    private Long workListItemId;
    private String executor;
    private String status;
    private String feedback;
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}


