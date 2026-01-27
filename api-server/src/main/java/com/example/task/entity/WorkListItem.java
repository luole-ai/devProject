package com.example.task.entity;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class WorkListItem {
    private Long id;
    private Long workListId;
    private String name;
    private String description;
    private String priority;
    private LocalDateTime estimatedTime;
    private String executionStatus;
    private String feedback;
    private LocalDateTime completedAt;
    private Integer sortOrder;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}


