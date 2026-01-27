package com.example.task.service;

import com.example.task.dto.WorkListCreateRequest;
import com.example.task.entity.WorkList;
import com.example.task.entity.WorkListItem;

import java.util.List;

public interface WorkListService {

    Long createWorkList(WorkListCreateRequest request);

    WorkList findById(Long id);

    List<WorkList> findAll();

    List<WorkListItem> findItemsByWorkListId(Long workListId);
}


