package com.example.task.service.impl;

import com.example.task.dto.WorkListCreateRequest;
import com.example.task.entity.WorkList;
import com.example.task.entity.WorkListItem;
import com.example.task.mapper.WorkListItemMapper;
import com.example.task.mapper.WorkListMapper;
import com.example.task.service.WorkListService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WorkListServiceImpl implements WorkListService {

    @Resource
    private WorkListMapper workListMapper;

    @Resource
    private WorkListItemMapper workListItemMapper;

    @Override
    @Transactional
    public Long createWorkList(WorkListCreateRequest request) {
        WorkList workList = new WorkList();
        workList.setTitle(request.getTitle());
        workList.setDescription(request.getDescription());
        workList.setTemplateId(request.getTemplateId());
        workList.setPublisher(request.getPublisher());
        workList.setStatus("pending");
        workList.setPublishedAt(LocalDateTime.now());
        if (request.getAssignedTo() != null && !request.getAssignedTo().isEmpty()) {
            workList.setAssignedTo(String.join(",", request.getAssignedTo()));
        }
        workListMapper.insert(workList);

        List<WorkListItem> items = new ArrayList<>();
        if (request.getTasks() != null) {
            int sort = 1;
            for (WorkListCreateRequest.TaskItemDTO dto : request.getTasks()) {
                WorkListItem item = new WorkListItem();
                item.setWorkListId(workList.getId());
                item.setName(dto.getName());
                item.setDescription(dto.getDescription());
                item.setPriority(dto.getPriority());
                item.setEstimatedTime(dto.getEstimatedTime());
                item.setExecutionStatus("pending");
                item.setSortOrder(sort++);
                items.add(item);
            }
        }
        if (!items.isEmpty()) {
            workListItemMapper.insertBatch(items);
        }
        return workList.getId();
    }

    @Override
    public WorkList findById(Long id) {
        return workListMapper.selectById(id);
    }

    @Override
    public List<WorkList> findAll() {
        return workListMapper.selectAll();
    }

    @Override
    public List<WorkListItem> findItemsByWorkListId(Long workListId) {
        List<WorkListItem> items = workListItemMapper.selectByWorkListId(workListId);
        return items.stream()
                .sorted((a, b) -> Integer.compare(
                        a.getSortOrder() == null ? 0 : a.getSortOrder(),
                        b.getSortOrder() == null ? 0 : b.getSortOrder()))
                .collect(Collectors.toList());
    }
}


