package com.example.task.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class WorkListCreateRequest {
    private String title;
    private String description;
    private Long templateId;
    private String publisher;
    private List<String> assignedTo;
    private List<TaskItemDTO> tasks;

    @Data
    public static class TaskItemDTO {
        private String name;
        private String description;
        private String priority;
        private LocalDateTime estimatedTime;
    }
}


