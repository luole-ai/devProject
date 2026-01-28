package com.example.task.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.task.entity.WorkListItem;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface WorkListItemMapper extends BaseMapper<WorkListItem> {

    int insertBatch(List<WorkListItem> items);

    int update(WorkListItem item);

    List<WorkListItem> selectByWorkListId(Long workListId);
}


