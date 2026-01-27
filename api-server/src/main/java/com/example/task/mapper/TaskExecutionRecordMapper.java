package com.example.task.mapper;

import com.example.task.entity.TaskExecutionRecord;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface TaskExecutionRecordMapper {
    int insert(TaskExecutionRecord record);

    List<TaskExecutionRecord> selectByWorkListItem(Long workListId, Long workListItemId);
}


