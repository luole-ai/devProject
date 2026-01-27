package com.example.task.controller;

import com.example.task.dto.WorkListCreateRequest;
import com.example.task.entity.WorkList;
import com.example.task.entity.WorkListItem;
import com.example.task.service.WorkListService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/work-lists")
public class WorkListController {

    @Resource
    private WorkListService workListService;

    @PostMapping
    public Map<String, Long> createWorkList(@RequestBody WorkListCreateRequest request) {
        Long id = workListService.createWorkList(request);
        Map<String, Long> resp = new HashMap<>();
        resp.put("id", id);
        return resp;
    }

    @GetMapping
    public List<WorkList> listWorkLists(@RequestParam(required = false) String status) {
        List<WorkList> all = workListService.findAll();
        if (status == null || status.isEmpty()) {
            return all;
        }
        return all.stream()
                .filter(w -> status.equals(w.getStatus()))
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public Map<String, Object> getWorkListDetail(@PathVariable Long id) {
        WorkList workList = workListService.findById(id);
        List<WorkListItem> items = workListService.findItemsByWorkListId(id);
        Map<String, Object> result = new HashMap<>();
        result.put("workList", workList);
        result.put("items", items);
        return result;
    }
}


