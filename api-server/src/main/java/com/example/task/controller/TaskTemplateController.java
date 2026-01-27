package com.example.task.controller;

import com.example.task.entity.TaskTemplate;
import com.example.task.entity.TaskTemplateItem;
import com.example.task.service.TaskTemplateService;
import lombok.Data;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/templates")
public class TaskTemplateController {

    @Resource
    private TaskTemplateService templateService;

    @GetMapping
    public List<TaskTemplate> listTemplates() {
        return templateService.findAll();
    }

    @GetMapping("/{id}")
    public Map<String, Object> getTemplate(@PathVariable Long id) {
        TaskTemplate template = templateService.findById(id);
        List<TaskTemplateItem> items = templateService.findItemsByTemplateId(id);
        Map<String, Object> result = new HashMap<>();
        result.put("template", template);
        result.put("items", items);
        return result;
    }

    @PostMapping
    public Map<String, Long> createTemplate(@RequestBody TemplateRequest request) {
        TaskTemplate template = new TaskTemplate();
        template.setName(request.getName());
        template.setDescription(request.getDescription());
        template.setCreatedBy(request.getCreatedBy());
        Long id = templateService.createTemplate(template, request.getItems());
        Map<String, Long> resp = new HashMap<>();
        resp.put("id", id);
        return resp;
    }

    @PutMapping("/{id}")
    public void updateTemplate(@PathVariable Long id, @RequestBody TemplateRequest request) {
        TaskTemplate template = new TaskTemplate();
        template.setId(id);
        template.setName(request.getName());
        template.setDescription(request.getDescription());
        templateService.updateTemplate(template, request.getItems());
    }

    @DeleteMapping("/{id}")
    public void deleteTemplate(@PathVariable Long id) {
        templateService.deleteTemplate(id);
    }

    @Data
    public static class TemplateRequest {
        private String name;
        private String description;
        private String createdBy;
        private List<TaskTemplateItem> items;
    }
}


