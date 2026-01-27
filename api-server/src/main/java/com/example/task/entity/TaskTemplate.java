package com.example.task.entity;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TaskTemplate {
    private Long id;
    private String name;
    private String description;
    private String createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}


