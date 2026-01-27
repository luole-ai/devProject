package com.example.task.entity;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TaskTemplateItem {
    private Long id;
    private Long templateId;
    private String name;
    private String description;
    private String priority;
    private Integer sortOrder;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}


