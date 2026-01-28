package com.example.task.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.task.entity.TaskTemplateItem;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface TaskTemplateItemMapper extends BaseMapper<TaskTemplateItem> {

    int insertBatch(List<TaskTemplateItem> items);

    int deleteByTemplateId(Long templateId);

    List<TaskTemplateItem> selectByTemplateId(Long templateId);
}


