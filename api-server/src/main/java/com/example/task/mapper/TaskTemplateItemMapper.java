package com.example.task.mapper;

import com.example.task.entity.TaskTemplateItem;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface TaskTemplateItemMapper {
    int insertBatch(List<TaskTemplateItem> items);

    int deleteByTemplateId(Long templateId);

    List<TaskTemplateItem> selectByTemplateId(Long templateId);
}


