package com.example.task.service;

import com.example.task.entity.TaskTemplate;
import com.example.task.entity.TaskTemplateItem;

import java.util.List;

public interface TaskTemplateService {

    Long createTemplate(TaskTemplate template, List<TaskTemplateItem> items);

    void updateTemplate(TaskTemplate template, List<TaskTemplateItem> items);

    void deleteTemplate(Long id);

    TaskTemplate findById(Long id);

    List<TaskTemplate> findAll();

    List<TaskTemplateItem> findItemsByTemplateId(Long templateId);
}


