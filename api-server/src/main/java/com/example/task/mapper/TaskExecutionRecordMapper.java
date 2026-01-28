package com.example.task.mapper;

import com.baomidou.dynamic.datasource.annotation.DS;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.task.entity.TaskExecutionRecord;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
@DS("log") // 执行记录走 log 数据源（多数据源示例）
public interface TaskExecutionRecordMapper extends BaseMapper<TaskExecutionRecord> {

    List<TaskExecutionRecord> selectByWorkListItem(Long workListId, Long workListItemId);
}


