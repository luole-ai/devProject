package com.example.task.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.task.entity.TaskTemplate;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface TaskTemplateMapper extends BaseMapper<TaskTemplate> {

    // 保留原有自定义方法（如需扩展，可继续在 XML 中实现）
    List<TaskTemplate> selectAll();
}


