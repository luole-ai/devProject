package com.example.task.mapper;

import com.example.task.entity.WorkList;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface WorkListMapper {
    int insert(WorkList workList);

    int update(WorkList workList);

    WorkList selectById(Long id);

    List<WorkList> selectAll();
}


