package com.example.task.entity;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class WorkList {
    private Long id;
    private String title;
    private String description;
    private Long templateId;
    private String publisher;
    private String status;
    private String assignedTo;
    private LocalDateTime publishedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}


