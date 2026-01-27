package com.example.task.mapper;

import com.example.task.entity.TaskTemplate;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface TaskTemplateMapper {
    int insert(TaskTemplate template);

    int update(TaskTemplate template);

    int deleteById(Long id);

    TaskTemplate selectById(Long id);

    List<TaskTemplate> selectAll();
}


