package com.example.task.service.impl;

import com.example.task.entity.TaskTemplate;
import com.example.task.entity.TaskTemplateItem;
import com.example.task.mapper.TaskTemplateItemMapper;
import com.example.task.mapper.TaskTemplateMapper;
import com.example.task.service.TaskTemplateService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.List;

@Service
public class TaskTemplateServiceImpl implements TaskTemplateService {

    @Resource
    private TaskTemplateMapper taskTemplateMapper;

    @Resource
    private TaskTemplateItemMapper taskTemplateItemMapper;

    @Override
    @Transactional
    public Long createTemplate(TaskTemplate template, List<TaskTemplateItem> items) {
        taskTemplateMapper.insert(template);
        if (items != null && !items.isEmpty()) {
            for (TaskTemplateItem item : items) {
                item.setTemplateId(template.getId());
            }
            taskTemplateItemMapper.insertBatch(items);
        }
        return template.getId();
    }

    @Override
    @Transactional
    public void updateTemplate(TaskTemplate template, List<TaskTemplateItem> items) {
        taskTemplateMapper.update(template);
        taskTemplateItemMapper.deleteByTemplateId(template.getId());
        if (items != null && !items.isEmpty()) {
            for (TaskTemplateItem item : items) {
                item.setTemplateId(template.getId());
            }
            taskTemplateItemMapper.insertBatch(items);
        }
    }

    @Override
    @Transactional
    public void deleteTemplate(Long id) {
        taskTemplateItemMapper.deleteByTemplateId(id);
        taskTemplateMapper.deleteById(id);
    }

    @Override
    public TaskTemplate findById(Long id) {
        return taskTemplateMapper.selectById(id);
    }

    @Override
    public List<TaskTemplate> findAll() {
        return taskTemplateMapper.selectAll();
    }

    @Override
    public List<TaskTemplateItem> findItemsByTemplateId(Long templateId) {
        return taskTemplateItemMapper.selectByTemplateId(templateId);
    }
}


