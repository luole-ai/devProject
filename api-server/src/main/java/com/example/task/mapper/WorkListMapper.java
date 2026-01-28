package com.example.task.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.task.entity.WorkList;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface WorkListMapper extends BaseMapper<WorkList> {

    List<WorkList> selectAll();
}


