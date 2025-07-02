# 知识库功能设计与实现
_Exported on 7/2/2025 at 22:55:30 GMT+8 from Cursor (1.0.0)_

---

**User**

我需要做一个知识库的功能，知识库里面存在很多文档，前端展示相应的文档，用户可以通过点击进行预览，管理端可以对知识库的文档进行增删改查等操作 然后还可以对相应知识文档添加学习任务并指定相应用户学习，学习任务存在开始和结束日期，只有在开始和结束日期范围内，用户通过学习文档才可以完成任务 管理端对知识可以发布多次学习任务，以及延期等操作 或者关闭等 

---

**Cursor**

你的需求可以拆解为以下几个核心模块：

### 1. 知识库文档管理
- **文档增删改查**（CRUD）
- 支持文档上传、下载、预览（如PDF、Word、图片等格式）
- 文档分类、标签等元数据管理

### 2. 学习任务管理
- 管理员可以为某个文档发布学习任务
- 任务可以指定给一个或多个用户
- 任务有**开始日期**和**结束日期**
- 任务可以**多次发布**，可以**延期**、**关闭**等操作

### 3. 用户学习与任务完成
- 用户在任务有效期内学习文档，才算完成任务
- 支持任务完成状态的记录与查询

### 4. 前端展示
- 普通用户：知识库文档浏览、预览、学习任务列表、完成任务
- 管理员：文档管理、任务管理、任务分配、任务状态管理

---

## 技术方案建议

### 后端（以Spring Boot + MyBatis Plus为例）

#### 1. 数据库表设计（简化版）

- **knowledge_document**（知识文档表）
  - id, title, file_url, description, create_time, update_time, ...

- **learning_task**（学习任务表）
  - id, document_id, task_name, start_time, end_time, status（进行中/已关闭/已延期）, create_time, update_time, ...

- **learning_task_user**（任务分配表）
  - id, task_id, user_id, is_completed, completed_time, ...

- **user**（用户表）
  - id, username, ...（已有可复用）

#### 2. 主要接口（Controller/Service）

- 文档管理：增删改查、上传、下载、预览
- 任务管理：发布任务、分配用户、延期、关闭、查询任务状态
- 用户学习：获取任务、学习文档、完成任务

#### 3. 关键业务逻辑
- 只有在任务有效期内，用户学习文档才可完成任务
- 管理员可对任务进行多次发布、延期、关闭等操作

---

### 前端（以React/Vue为例）

- **知识库页面**：文档列表、分类筛选、文档预览
- **学习任务页面**：任务列表、任务详情、完成任务按钮
- **管理端页面**：文档管理、任务管理、任务分配、任务状态管理

---

## 你可以这样分步开发

1. **数据库表设计与建表**
2. **文档管理接口开发**
3. **学习任务相关接口开发**
4. **前端页面搭建与接口对接**
5. **任务分配、延期、关闭等功能完善**
6. **用户学习与任务完成逻辑实现**

---

如果你需要具体的代码示例（如表结构、接口定义、某个功能的实现），请告诉我你想先做哪一部分，我可以帮你详细设计和实现！

---

**User**

表结构

---

**Cursor**

下面是根据你的需求设计的知识库和学习任务相关的数据库表结构（以MySQL为例，字段类型可根据实际情况调整）：

---

### 1. 知识文档表 `knowledge_document`

```sql
CREATE TABLE knowledge_document (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键',
    title VARCHAR(255) NOT NULL COMMENT '文档标题',
    file_url VARCHAR(500) NOT NULL COMMENT '文档存储路径/URL',
    description TEXT COMMENT '文档描述',
    category VARCHAR(100) COMMENT '文档分类',
    tags VARCHAR(255) COMMENT '标签，逗号分隔',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
);
```

---

### 2. 学习任务表 `learning_task`

```sql
CREATE TABLE learning_task (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键',
    document_id BIGINT NOT NULL COMMENT '关联文档ID',
    task_name VARCHAR(255) NOT NULL COMMENT '任务名称',
    start_time DATETIME NOT NULL COMMENT '任务开始时间',
    end_time DATETIME NOT NULL COMMENT '任务结束时间',
    status VARCHAR(20) DEFAULT '进行中' COMMENT '任务状态（进行中/已关闭/已延期）',
    remark VARCHAR(255) COMMENT '备注',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (document_id) REFERENCES knowledge_document(id)
);
```

---

### 3. 任务分配表 `learning_task_user`

```sql
CREATE TABLE learning_task_user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键',
    task_id BIGINT NOT NULL COMMENT '任务ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    is_completed TINYINT(1) DEFAULT 0 COMMENT '是否已完成（0未完成，1已完成）',
    completed_time DATETIME COMMENT '完成时间',
    assign_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '分配时间',
    FOREIGN KEY (task_id) REFERENCES learning_task(id)
    -- user_id建议关联你的用户表
);
```

---

### 4. 用户表 `user`（如已有可复用）

```sql
CREATE TABLE user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键',
    username VARCHAR(100) NOT NULL COMMENT '用户名',
    real_name VARCHAR(100) COMMENT '真实姓名',
    email VARCHAR(100) COMMENT '邮箱',
    -- 其他字段
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
);
```

---

## 说明

- **knowledge_document**：存储知识文档的基本信息和文件路径。
- **learning_task**：每次发布的学习任务，关联一个文档，可多次发布。
- **learning_task_user**：任务分配表，记录每个任务分配给哪些用户，以及完成情况。
- **user**：用户表，记录系统用户信息。

如需支持文档多版本、审批流、评论等，可再扩展表结构。

---

如需建表SQL文件、ER图、或某一表的详细字段解释，请告知！

```sql
CREATE TABLE knowledge_document (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键',
    title VARCHAR(255) NOT NULL COMMENT '文档标题',
    file_url VARCHAR(500) NOT NULL COMMENT '文档存储路径/URL',
    description TEXT COMMENT '文档描述',
    category VARCHAR(100) COMMENT '文档分类',
    tags VARCHAR(255) COMMENT '标签，逗号分隔',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
);
```

```sql
CREATE TABLE learning_task (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键',
    document_id BIGINT NOT NULL COMMENT '关联文档ID',
    task_name VARCHAR(255) NOT NULL COMMENT '任务名称',
    start_time DATETIME NOT NULL COMMENT '任务开始时间',
    end_time DATETIME NOT NULL COMMENT '任务结束时间',
    status VARCHAR(20) DEFAULT '进行中' COMMENT '任务状态（进行中/已关闭/已延期）',
    remark VARCHAR(255) COMMENT '备注',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (document_id) REFERENCES knowledge_document(id)
);
```

```sql
CREATE TABLE learning_task_user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键',
    task_id BIGINT NOT NULL COMMENT '任务ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    is_completed TINYINT(1) DEFAULT 0 COMMENT '是否已完成（0未完成，1已完成）',
    completed_time DATETIME COMMENT '完成时间',
    assign_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '分配时间',
    FOREIGN KEY (task_id) REFERENCES learning_task(id)
    -- user_id建议关联你的用户表
);
```

```sql
CREATE TABLE user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键',
    username VARCHAR(100) NOT NULL COMMENT '用户名',
    real_name VARCHAR(100) COMMENT '真实姓名',
    email VARCHAR(100) COMMENT '邮箱',
    -- 其他字段
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
);
```

---

**User**

ER图展示

---

**Cursor**

下面是知识库与学习任务相关的ER图，清晰展示了各表之间的关系：

```mermaid
erDiagram
  USER {
    BIGINT id PK "主键"
    VARCHAR username "用户名"
    VARCHAR real_name "真实姓名"
    VARCHAR email "邮箱"
    DATETIME create_time "创建时间"
  }
  KNOWLEDGE_DOCUMENT {
    BIGINT id PK "主键"
    VARCHAR title "文档标题"
    VARCHAR file_url "文档路径"
    TEXT description "描述"
    VARCHAR category "分类"
    VARCHAR tags "标签"
    DATETIME create_time "创建时间"
    DATETIME update_time "更新时间"
  }
  LEARNING_TASK {
    BIGINT id PK "主键"
    BIGINT document_id FK "文档ID"
    VARCHAR task_name "任务名称"
    DATETIME start_time "开始时间"
    DATETIME end_time "结束时间"
    VARCHAR status "状态"
    VARCHAR remark "备注"
    DATETIME create_time "创建时间"
    DATETIME update_time "更新时间"
  }
  LEARNING_TASK_USER {
    BIGINT id PK "主键"
    BIGINT task_id FK "任务ID"
    BIGINT user_id FK "用户ID"
    TINYINT is_completed "是否完成"
    DATETIME completed_time "完成时间"
    DATETIME assign_time "分配时间"
  }
  
  LEARNING_TASK }o--|| KNOWLEDGE_DOCUMENT : "document_id"
  LEARNING_TASK_USER }o--|| LEARNING_TASK : "task_id"
  LEARNING_TASK_USER }o--|| USER : "user_id"
```

你可以将上述Mermaid代码粘贴到支持Mermaid的编辑器或工具中查看可视化ER图。如果需要图片或PDF格式，也可以告知！

```plaintext
erDiagram
  USER {
    BIGINT id PK "主键"
    VARCHAR username "用户名"
    VARCHAR real_name "真实姓名"
    VARCHAR email "邮箱"
    DATETIME create_time "创建时间"
  }
  KNOWLEDGE_DOCUMENT {
    BIGINT id PK "主键"
    VARCHAR title "文档标题"
    VARCHAR file_url "文档路径"
    TEXT description "描述"
    VARCHAR category "分类"
    VARCHAR tags "标签"
    DATETIME create_time "创建时间"
    DATETIME update_time "更新时间"
  }
  LEARNING_TASK {
    BIGINT id PK "主键"
    BIGINT document_id FK "文档ID"
    VARCHAR task_name "任务名称"
    DATETIME start_time "开始时间"
    DATETIME end_time "结束时间"
    VARCHAR status "状态"
    VARCHAR remark "备注"
    DATETIME create_time "创建时间"
    DATETIME update_time "更新时间"
  }
  LEARNING_TASK_USER {
    BIGINT id PK "主键"
    BIGINT task_id FK "任务ID"
    BIGINT user_id FK "用户ID"
    TINYINT is_completed "是否完成"
    DATETIME completed_time "完成时间"
    DATETIME assign_time "分配时间"
  }
  
  LEARNING_TASK }o--|| KNOWLEDGE_DOCUMENT : "document_id"
  LEARNING_TASK_USER }o--|| LEARNING_TASK : "task_id"
  LEARNING_TASK_USER }o--|| USER : "user_id"
```

---

**User**

文档管理接口开发 使用mybatis和springBoot

---

**Cursor**

下面是基于 Spring Boot + MyBatis 实现的知识文档管理接口开发示例，包括**实体类**、**Mapper**、**Service**、**Controller**，以及常用的**增删改查**接口。

---

## 1. 实体类 `KnowledgeDocument.java`

```java
package com.example.knowledgebase.entity;

import java.util.Date;

public class KnowledgeDocument {
    private Long id;
    private String title;
    private String fileUrl;
    private String description;
    private String category;
    private String tags;
    private Date createTime;
    private Date updateTime;

    // getters and setters
}
```

---

## 2. Mapper 接口 `KnowledgeDocumentMapper.java`

```java
package com.example.knowledgebase.mapper;

import com.example.knowledgebase.entity.KnowledgeDocument;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface KnowledgeDocumentMapper {

    @Select("SELECT * FROM knowledge_document WHERE id = #{id}")
    KnowledgeDocument selectById(Long id);

    @Select("SELECT * FROM knowledge_document")
    List<KnowledgeDocument> selectAll();

    @Insert("INSERT INTO knowledge_document(title, file_url, description, category, tags, create_time, update_time) " +
            "VALUES(#{title}, #{fileUrl}, #{description}, #{category}, #{tags}, NOW(), NOW())")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(KnowledgeDocument doc);

    @Update("UPDATE knowledge_document SET title=#{title}, file_url=#{fileUrl}, description=#{description}, " +
            "category=#{category}, tags=#{tags}, update_time=NOW() WHERE id=#{id}")
    int update(KnowledgeDocument doc);

    @Delete("DELETE FROM knowledge_document WHERE id=#{id}")
    int delete(Long id);
}
```

---

## 3. Service 层

### 接口 `KnowledgeDocumentService.java`

```java
package com.example.knowledgebase.service;

import com.example.knowledgebase.entity.KnowledgeDocument;

import java.util.List;

public interface KnowledgeDocumentService {
    KnowledgeDocument getById(Long id);
    List<KnowledgeDocument> getAll();
    void add(KnowledgeDocument doc);
    void update(KnowledgeDocument doc);
    void delete(Long id);
}
```

### 实现类 `KnowledgeDocumentServiceImpl.java`

```java
package com.example.knowledgebase.service.impl;

import com.example.knowledgebase.entity.KnowledgeDocument;
import com.example.knowledgebase.mapper.KnowledgeDocumentMapper;
import com.example.knowledgebase.service.KnowledgeDocumentService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Service
public class KnowledgeDocumentServiceImpl implements KnowledgeDocumentService {

    @Resource
    private KnowledgeDocumentMapper mapper;

    @Override
    public KnowledgeDocument getById(Long id) {
        return mapper.selectById(id);
    }

    @Override
    public List<KnowledgeDocument> getAll() {
        return mapper.selectAll();
    }

    @Override
    public void add(KnowledgeDocument doc) {
        mapper.insert(doc);
    }

    @Override
    public void update(KnowledgeDocument doc) {
        mapper.update(doc);
    }

    @Override
    public void delete(Long id) {
        mapper.delete(id);
    }
}
```

---

## 4. Controller 层 `KnowledgeDocumentController.java`

```java
package com.example.knowledgebase.controller;

import com.example.knowledgebase.entity.KnowledgeDocument;
import com.example.knowledgebase.service.KnowledgeDocumentService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class KnowledgeDocumentController {

    @Resource
    private KnowledgeDocumentService service;

    @GetMapping("/{id}")
    public KnowledgeDocument getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping
    public List<KnowledgeDocument> getAll() {
        return service.getAll();
    }

    @PostMapping
    public void add(@RequestBody KnowledgeDocument doc) {
        service.add(doc);
    }

    @PutMapping("/{id}")
    public void update(@PathVariable Long id, @RequestBody KnowledgeDocument doc) {
        doc.setId(id);
        service.update(doc);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
```

---

## 5. 其他说明

- 文件上传可用 `@RequestParam MultipartFile file`，存储后将路径写入 `fileUrl` 字段。
- 记得在 `application.yml` 配置 MyBatis 数据源和 Mapper 扫描路径。
- 可根据实际需求扩展分页、模糊查询、分类筛选等功能。

---

如需文件上传接口、分页查询、或前端对接示例，请告知！

```java
package com.example.knowledgebase.entity;

import java.util.Date;

public class KnowledgeDocument {
    private Long id;
    private String title;
    private String fileUrl;
    private String description;
    private String category;
    private String tags;
    private Date createTime;
    private Date updateTime;

    // getters and setters
}
```

```java
package com.example.knowledgebase.mapper;

import com.example.knowledgebase.entity.KnowledgeDocument;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface KnowledgeDocumentMapper {

    @Select("SELECT * FROM knowledge_document WHERE id = #{id}")
    KnowledgeDocument selectById(Long id);

    @Select("SELECT * FROM knowledge_document")
    List<KnowledgeDocument> selectAll();

    @Insert("INSERT INTO knowledge_document(title, file_url, description, category, tags, create_time, update_time) " +
            "VALUES(#{title}, #{fileUrl}, #{description}, #{category}, #{tags}, NOW(), NOW())")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(KnowledgeDocument doc);

    @Update("UPDATE knowledge_document SET title=#{title}, file_url=#{fileUrl}, description=#{description}, " +
            "category=#{category}, tags=#{tags}, update_time=NOW() WHERE id=#{id}")
    int update(KnowledgeDocument doc);

    @Delete("DELETE FROM knowledge_document WHERE id=#{id}")
    int delete(Long id);
}
```

```java
package com.example.knowledgebase.service;

import com.example.knowledgebase.entity.KnowledgeDocument;

import java.util.List;

public interface KnowledgeDocumentService {
    KnowledgeDocument getById(Long id);
    List<KnowledgeDocument> getAll();
    void add(KnowledgeDocument doc);
    void update(KnowledgeDocument doc);
    void delete(Long id);
}
```

```java
package com.example.knowledgebase.service.impl;

import com.example.knowledgebase.entity.KnowledgeDocument;
import com.example.knowledgebase.mapper.KnowledgeDocumentMapper;
import com.example.knowledgebase.service.KnowledgeDocumentService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Service
public class KnowledgeDocumentServiceImpl implements KnowledgeDocumentService {

    @Resource
    private KnowledgeDocumentMapper mapper;

    @Override
    public KnowledgeDocument getById(Long id) {
        return mapper.selectById(id);
    }

    @Override
    public List<KnowledgeDocument> getAll() {
        return mapper.selectAll();
    }

    @Override
    public void add(KnowledgeDocument doc) {
        mapper.insert(doc);
    }

    @Override
    public void update(KnowledgeDocument doc) {
        mapper.update(doc);
    }

    @Override
    public void delete(Long id) {
        mapper.delete(id);
    }
}
```

```java
package com.example.knowledgebase.controller;

import com.example.knowledgebase.entity.KnowledgeDocument;
import com.example.knowledgebase.service.KnowledgeDocumentService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class KnowledgeDocumentController {

    @Resource
    private KnowledgeDocumentService service;

    @GetMapping("/{id}")
    public KnowledgeDocument getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping
    public List<KnowledgeDocument> getAll() {
        return service.getAll();
    }

    @PostMapping
    public void add(@RequestBody KnowledgeDocument doc) {
        service.add(doc);
    }

    @PutMapping("/{id}")
    public void update(@PathVariable Long id, @RequestBody KnowledgeDocument doc) {
        doc.setId(id);
        service.update(doc);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
```

---

**User**

命名规则调整

---

**Cursor**

当然可以！你可以根据公司/团队的规范，统一命名风格。常见的命名风格有两种：

1. **Java驼峰命名法**（推荐用于Java代码、DTO、VO等）
2. **下划线命名法**（推荐用于数据库表和字段）

下面给出建议：

---

## 1. 数据库表和字段（下划线命名）

- 表名：全部小写，单词间用下划线分隔，如 `knowledge_document`
- 字段名：同理，如 `file_url`, `create_time`

---

## 2. Java类和属性（驼峰命名）

- 实体类名：首字母大写驼峰，如 `KnowledgeDocument`
- 属性名：首字母小写驼峰，如 `fileUrl`, `createTime`

---

## 3. Mapper、Service、Controller 命名

- Mapper接口：`KnowledgeDocumentMapper`
- Service接口：`KnowledgeDocumentService`
- Service实现：`KnowledgeDocumentServiceImpl`
- Controller：`KnowledgeDocumentController`

---

## 4. 接口路径（RESTful风格）

- 资源名用复数，全部小写，单词间用中划线，如 `/api/knowledge-documents`
- 单个资源用 `/api/knowledge-documents/{id}`

---

## 5. 代码示例（调整后）

### 实体类

```java
public class KnowledgeDocument {
    private Long id;
    private String title;
    private String fileUrl;
    private String description;
    private String category;
    private String tags;
    private Date createTime;
    private Date updateTime;
    // getter/setter
}
```

### Mapper接口

```java
@Mapper
public interface KnowledgeDocumentMapper {
    // 方法名用驼峰，SQL字段用下划线
    @Select("SELECT * FROM knowledge_document WHERE id = #{id}")
    KnowledgeDocument selectById(Long id);
    // ...
}
```

### Controller

```java
@RestController
@RequestMapping("/api/knowledge-documents")
public class KnowledgeDocumentController {
    // ...
}
```

---

## 6. 统一命名建议

- **数据库**：下划线分隔
- **Java代码**：驼峰命名
- **接口路径**：中划线分隔复数名

---

如需自动生成代码模板、MyBatis映射文件、或有特殊命名规范，请补充说明！如果你有具体的命名规则（如全部英文、加前缀等），也可以告诉我，我帮你调整。

```java
public class KnowledgeDocument {
    private Long id;
    private String title;
    private String fileUrl;
    private String description;
    private String category;
    private String tags;
    private Date createTime;
    private Date updateTime;
    // getter/setter
}
```

```java
@Mapper
public interface KnowledgeDocumentMapper {
    // 方法名用驼峰，SQL字段用下划线
    @Select("SELECT * FROM knowledge_document WHERE id = #{id}")
    KnowledgeDocument selectById(Long id);
    // ...
}
```

```java
@RestController
@RequestMapping("/api/knowledge-documents")
public class KnowledgeDocumentController {
    // ...
}
```

---

**User**

学习任务相关接口开发

---

**Cursor**

下面是基于 Spring Boot + MyBatis 的**学习任务相关接口**开发示例，包括实体类、Mapper、Service、Controller，涵盖任务的增删改查、分配用户、延期、关闭、查询任务完成情况等常用操作。

---

## 1. 实体类

### LearningTask.java

```java
public class LearningTask {
    private Long id;
    private Long documentId;
    private String taskName;
    private Date startTime;
    private Date endTime;
    private String status; // 进行中/已关闭/已延期
    private String remark;
    private Date createTime;
    private Date updateTime;
    // getter/setter
}
```

### LearningTaskUser.java

```java
public class LearningTaskUser {
    private Long id;
    private Long taskId;
    private Long userId;
    private Boolean isCompleted;
    private Date completedTime;
    private Date assignTime;
    // getter/setter
}
```

---

## 2. Mapper接口

### LearningTaskMapper.java

```java
@Mapper
public interface LearningTaskMapper {
    @Select("SELECT * FROM learning_task WHERE id = #{id}")
    LearningTask selectById(Long id);

    @Select("SELECT * FROM learning_task")
    List<LearningTask> selectAll();

    @Insert("INSERT INTO learning_task(document_id, task_name, start_time, end_time, status, remark, create_time, update_time) " +
            "VALUES(#{documentId}, #{taskName}, #{startTime}, #{endTime}, #{status}, #{remark}, NOW(), NOW())")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(LearningTask task);

    @Update("UPDATE learning_task SET document_id=#{documentId}, task_name=#{taskName}, start_time=#{startTime}, end_time=#{endTime}, " +
            "status=#{status}, remark=#{remark}, update_time=NOW() WHERE id=#{id}")
    int update(LearningTask task);

    @Delete("DELETE FROM learning_task WHERE id=#{id}")
    int delete(Long id);
}
```

### LearningTaskUserMapper.java

```java
@Mapper
public interface LearningTaskUserMapper {
    @Select("SELECT * FROM learning_task_user WHERE task_id = #{taskId}")
    List<LearningTaskUser> selectByTaskId(Long taskId);

    @Insert("INSERT INTO learning_task_user(task_id, user_id, is_completed, assign_time) " +
            "VALUES(#{taskId}, #{userId}, 0, NOW())")
    int assignUserToTask(@Param("taskId") Long taskId, @Param("userId") Long userId);

    @Update("UPDATE learning_task_user SET is_completed=1, completed_time=NOW() WHERE id=#{id}")
    int markCompleted(Long id);

    @Delete("DELETE FROM learning_task_user WHERE id=#{id}")
    int delete(Long id);
}
```

---

## 3. Service层

### LearningTaskService.java

```java
public interface LearningTaskService {
    LearningTask getById(Long id);
    List<LearningTask> getAll();
    void add(LearningTask task);
    void update(LearningTask task);
    void delete(Long id);
    void closeTask(Long id);
    void postponeTask(Long id, Date newEndTime);
    void assignUsers(Long taskId, List<Long> userIds);
    List<LearningTaskUser> getTaskUsers(Long taskId);
}
```

### LearningTaskServiceImpl.java

```java
@Service
public class LearningTaskServiceImpl implements LearningTaskService {
    @Resource
    private LearningTaskMapper taskMapper;
    @Resource
    private LearningTaskUserMapper taskUserMapper;

    @Override
    public LearningTask getById(Long id) {
        return taskMapper.selectById(id);
    }

    @Override
    public List<LearningTask> getAll() {
        return taskMapper.selectAll();
    }

    @Override
    public void add(LearningTask task) {
        task.setStatus("进行中");
        taskMapper.insert(task);
    }

    @Override
    public void update(LearningTask task) {
        taskMapper.update(task);
    }

    @Override
    public void delete(Long id) {
        taskMapper.delete(id);
    }

    @Override
    public void closeTask(Long id) {
        LearningTask task = taskMapper.selectById(id);
        if (task != null) {
            task.setStatus("已关闭");
            taskMapper.update(task);
        }
    }

    @Override
    public void postponeTask(Long id, Date newEndTime) {
        LearningTask task = taskMapper.selectById(id);
        if (task != null) {
            task.setEndTime(newEndTime);
            task.setStatus("已延期");
            taskMapper.update(task);
        }
    }

    @Override
    public void assignUsers(Long taskId, List<Long> userIds) {
        for (Long userId : userIds) {
            taskUserMapper.assignUserToTask(taskId, userId);
        }
    }

    @Override
    public List<LearningTaskUser> getTaskUsers(Long taskId) {
        return taskUserMapper.selectByTaskId(taskId);
    }
}
```

---

## 4. Controller层

### LearningTaskController.java

```java
@RestController
@RequestMapping("/api/learning-tasks")
public class LearningTaskController {
    @Resource
    private LearningTaskService service;

    @GetMapping("/{id}")
    public LearningTask getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping
    public List<LearningTask> getAll() {
        return service.getAll();
    }

    @PostMapping
    public void add(@RequestBody LearningTask task) {
        service.add(task);
    }

    @PutMapping("/{id}")
    public void update(@PathVariable Long id, @RequestBody LearningTask task) {
        task.setId(id);
        service.update(task);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @PostMapping("/{id}/close")
    public void closeTask(@PathVariable Long id) {
        service.closeTask(id);
    }

    @PostMapping("/{id}/postpone")
    public void postponeTask(@PathVariable Long id, @RequestParam("newEndTime") @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date newEndTime) {
        service.postponeTask(id, newEndTime);
    }

    @PostMapping("/{id}/assign-users")
    public void assignUsers(@PathVariable Long id, @RequestBody List<Long> userIds) {
        service.assignUsers(id, userIds);
    }

    @GetMapping("/{id}/users")
    public List<LearningTaskUser> getTaskUsers(@PathVariable Long id) {
        return service.getTaskUsers(id);
    }
}
```

---

## 5. 说明

- 你可以根据实际需求扩展分页、模糊查询、批量操作等功能。
- 用户完成任务时，可以在 `LearningTaskUserMapper` 里增加 `markCompleted` 方法，前端调用即可。
- 任务延期、关闭等操作建议用单独的接口，便于权限控制和审计。

---

如需**前端调用示例**、**DTO/VO封装**、**文件上传**、**任务完成接口**等详细实现，请随时告知！

```java
public class LearningTask {
    private Long id;
    private Long documentId;
    private String taskName;
    private Date startTime;
    private Date endTime;
    private String status; // 进行中/已关闭/已延期
    private String remark;
    private Date createTime;
    private Date updateTime;
    // getter/setter
}
```

```java
public class LearningTaskUser {
    private Long id;
    private Long taskId;
    private Long userId;
    private Boolean isCompleted;
    private Date completedTime;
    private Date assignTime;
    // getter/setter
}
```

```java
@Mapper
public interface LearningTaskMapper {
    @Select("SELECT * FROM learning_task WHERE id = #{id}")
    LearningTask selectById(Long id);

    @Select("SELECT * FROM learning_task")
    List<LearningTask> selectAll();

    @Insert("INSERT INTO learning_task(document_id, task_name, start_time, end_time, status, remark, create_time, update_time) " +
            "VALUES(#{documentId}, #{taskName}, #{startTime}, #{endTime}, #{status}, #{remark}, NOW(), NOW())")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(LearningTask task);

    @Update("UPDATE learning_task SET document_id=#{documentId}, task_name=#{taskName}, start_time=#{startTime}, end_time=#{endTime}, " +
            "status=#{status}, remark=#{remark}, update_time=NOW() WHERE id=#{id}")
    int update(LearningTask task);

    @Delete("DELETE FROM learning_task WHERE id=#{id}")
    int delete(Long id);
}
```

```java
@Mapper
public interface LearningTaskUserMapper {
    @Select("SELECT * FROM learning_task_user WHERE task_id = #{taskId}")
    List<LearningTaskUser> selectByTaskId(Long taskId);

    @Insert("INSERT INTO learning_task_user(task_id, user_id, is_completed, assign_time) " +
            "VALUES(#{taskId}, #{userId}, 0, NOW())")
    int assignUserToTask(@Param("taskId") Long taskId, @Param("userId") Long userId);

    @Update("UPDATE learning_task_user SET is_completed=1, completed_time=NOW() WHERE id=#{id}")
    int markCompleted(Long id);

    @Delete("DELETE FROM learning_task_user WHERE id=#{id}")
    int delete(Long id);
}
```

```java
public interface LearningTaskService {
    LearningTask getById(Long id);
    List<LearningTask> getAll();
    void add(LearningTask task);
    void update(LearningTask task);
    void delete(Long id);
    void closeTask(Long id);
    void postponeTask(Long id, Date newEndTime);
    void assignUsers(Long taskId, List<Long> userIds);
    List<LearningTaskUser> getTaskUsers(Long taskId);
}
```

```java
@Service
public class LearningTaskServiceImpl implements LearningTaskService {
    @Resource
    private LearningTaskMapper taskMapper;
    @Resource
    private LearningTaskUserMapper taskUserMapper;

    @Override
    public LearningTask getById(Long id) {
        return taskMapper.selectById(id);
    }

    @Override
    public List<LearningTask> getAll() {
        return taskMapper.selectAll();
    }

    @Override
    public void add(LearningTask task) {
        task.setStatus("进行中");
        taskMapper.insert(task);
    }

    @Override
    public void update(LearningTask task) {
        taskMapper.update(task);
    }

    @Override
    public void delete(Long id) {
        taskMapper.delete(id);
    }

    @Override
    public void closeTask(Long id) {
        LearningTask task = taskMapper.selectById(id);
        if (task != null) {
            task.setStatus("已关闭");
            taskMapper.update(task);
        }
    }

    @Override
    public void postponeTask(Long id, Date newEndTime) {
        LearningTask task = taskMapper.selectById(id);
        if (task != null) {
            task.setEndTime(newEndTime);
            task.setStatus("已延期");
            taskMapper.update(task);
        }
    }

    @Override
    public void assignUsers(Long taskId, List<Long> userIds) {
        for (Long userId : userIds) {
            taskUserMapper.assignUserToTask(taskId, userId);
        }
    }

    @Override
    public List<LearningTaskUser> getTaskUsers(Long taskId) {
        return taskUserMapper.selectByTaskId(taskId);
    }
}
```

```java
@RestController
@RequestMapping("/api/learning-tasks")
public class LearningTaskController {
    @Resource
    private LearningTaskService service;

    @GetMapping("/{id}")
    public LearningTask getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping
    public List<LearningTask> getAll() {
        return service.getAll();
    }

    @PostMapping
    public void add(@RequestBody LearningTask task) {
        service.add(task);
    }

    @PutMapping("/{id}")
    public void update(@PathVariable Long id, @RequestBody LearningTask task) {
        task.setId(id);
        service.update(task);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @PostMapping("/{id}/close")
    public void closeTask(@PathVariable Long id) {
        service.closeTask(id);
    }

    @PostMapping("/{id}/postpone")
    public void postponeTask(@PathVariable Long id, @RequestParam("newEndTime") @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date newEndTime) {
        service.postponeTask(id, newEndTime);
    }

    @PostMapping("/{id}/assign-users")
    public void assignUsers(@PathVariable Long id, @RequestBody List<Long> userIds) {
        service.assignUsers(id, userIds);
    }

    @GetMapping("/{id}/users")
    public List<LearningTaskUser> getTaskUsers(@PathVariable Long id) {
        return service.getTaskUsers(id);
    }
}
```

---

**User**

前端需要查询 所有知识 并返回需要学习的任务

---

**Cursor**

你的需求是：**前端查询所有知识文档，并返回当前用户需要学习的任务**。  
这通常用于“我的学习任务”页面，用户可以看到所有知识文档及自己被分配的学习任务（包括任务状态、是否完成等）。

---

## 一、接口设计建议

### 1. 返回结构建议

```json
[
  {
    "documentId": 1,
    "title": "文档A",
    "fileUrl": "...",
    "description": "...",
    "category": "...",
    "tags": "...",
    "tasks": [
      {
        "taskId": 101,
        "taskName": "学习任务1",
        "startTime": "...",
        "endTime": "...",
        "status": "进行中",
        "isCompleted": false,
        "completedTime": null
      },
      ...
    ]
  },
  ...
]
```

---

### 2. 后端接口示例

#### Controller

```java
@GetMapping("/my-learning")
public List<KnowledgeWithTasksVO> getMyLearningTasks(@RequestParam Long userId) {
    return knowledgeDocumentService.getKnowledgeWithTasksForUser(userId);
}
```

#### Service

```java
public List<KnowledgeWithTasksVO> getKnowledgeWithTasksForUser(Long userId) {
    // 1. 查询所有知识文档
    List<KnowledgeDocument> docs = knowledgeDocumentMapper.selectAll();
    // 2. 查询该用户被分配的所有学习任务
    List<LearningTaskUser> userTasks = learningTaskUserMapper.selectByUserId(userId);
    Map<Long, List<LearningTaskUser>> taskMap = userTasks.stream()
        .collect(Collectors.groupingBy(LearningTaskUser::getTaskId));
    // 3. 查询所有任务
    List<LearningTask> allTasks = learningTaskMapper.selectAll();
    Map<Long, LearningTask> taskDetailMap = allTasks.stream()
        .collect(Collectors.toMap(LearningTask::getId, t -> t));
    // 4. 组装返回
    List<KnowledgeWithTasksVO> result = new ArrayList<>();
    for (KnowledgeDocument doc : docs) {
        KnowledgeWithTasksVO vo = new KnowledgeWithTasksVO();
        vo.setDocumentId(doc.getId());
        vo.setTitle(doc.getTitle());
        vo.setFileUrl(doc.getFileUrl());
        vo.setDescription(doc.getDescription());
        vo.setCategory(doc.getCategory());
        vo.setTags(doc.getTags());
        // 找到该文档下该用户的任务
        List<LearningTaskVO> taskVOList = new ArrayList<>();
        for (LearningTask task : allTasks) {
            if (task.getDocumentId().equals(doc.getId())) {
                List<LearningTaskUser> userTaskList = taskMap.get(task.getId());
                if (userTaskList != null) {
                    for (LearningTaskUser userTask : userTaskList) {
                        LearningTaskVO tvo = new LearningTaskVO();
                        tvo.setTaskId(task.getId());
                        tvo.setTaskName(task.getTaskName());
                        tvo.setStartTime(task.getStartTime());
                        tvo.setEndTime(task.getEndTime());
                        tvo.setStatus(task.getStatus());
                        tvo.setIsCompleted(userTask.getIsCompleted());
                        tvo.setCompletedTime(userTask.getCompletedTime());
                        taskVOList.add(tvo);
                    }
                }
            }
        }
        vo.setTasks(taskVOList);
        result.add(vo);
    }
    return result;
}
```

#### VO 示例

```java
public class KnowledgeWithTasksVO {
    private Long documentId;
    private String title;
    private String fileUrl;
    private String description;
    private String category;
    private String tags;
    private List<LearningTaskVO> tasks;
    // getter/setter
}

public class LearningTaskVO {
    private Long taskId;
    private String taskName;
    private Date startTime;
    private Date endTime;
    private String status;
    private Boolean isCompleted;
    private Date completedTime;
    // getter/setter
}
```

---

## 二、SQL优化建议

- 可以用**多表联查**（`LEFT JOIN`）一次性查出所有数据，减少多次查询。
- 也可以用MyBatis Plus的`@Select`自定义SQL实现。

---

## 三、接口路径建议

- `/api/knowledge-documents/my-learning?userId=xxx`
- 或 `/api/my-learning-tasks`（userId从token获取）

---

如需**完整SQL**、**MyBatis注解写法**、**分页/筛选**、**前端调用示例**，请告知！

```json
[
  {
    "documentId": 1,
    "title": "文档A",
    "fileUrl": "...",
    "description": "...",
    "category": "...",
    "tags": "...",
    "tasks": [
      {
        "taskId": 101,
        "taskName": "学习任务1",
        "startTime": "...",
        "endTime": "...",
        "status": "进行中",
        "isCompleted": false,
        "completedTime": null
      },
      ...
    ]
  },
  ...
]
```

```java
@GetMapping("/my-learning")
public List<KnowledgeWithTasksVO> getMyLearningTasks(@RequestParam Long userId) {
    return knowledgeDocumentService.getKnowledgeWithTasksForUser(userId);
}
```

```java
public List<KnowledgeWithTasksVO> getKnowledgeWithTasksForUser(Long userId) {
    // 1. 查询所有知识文档
    List<KnowledgeDocument> docs = knowledgeDocumentMapper.selectAll();
    // 2. 查询该用户被分配的所有学习任务
    List<LearningTaskUser> userTasks = learningTaskUserMapper.selectByUserId(userId);
    Map<Long, List<LearningTaskUser>> taskMap = userTasks.stream()
        .collect(Collectors.groupingBy(LearningTaskUser::getTaskId));
    // 3. 查询所有任务
    List<LearningTask> allTasks = learningTaskMapper.selectAll();
    Map<Long, LearningTask> taskDetailMap = allTasks.stream()
        .collect(Collectors.toMap(LearningTask::getId, t -> t));
    // 4. 组装返回
    List<KnowledgeWithTasksVO> result = new ArrayList<>();
    for (KnowledgeDocument doc : docs) {
        KnowledgeWithTasksVO vo = new KnowledgeWithTasksVO();
        vo.setDocumentId(doc.getId());
        vo.setTitle(doc.getTitle());
        vo.setFileUrl(doc.getFileUrl());
        vo.setDescription(doc.getDescription());
        vo.setCategory(doc.getCategory());
        vo.setTags(doc.getTags());
        // 找到该文档下该用户的任务
        List<LearningTaskVO> taskVOList = new ArrayList<>();
        for (LearningTask task : allTasks) {
            if (task.getDocumentId().equals(doc.getId())) {
                List<LearningTaskUser> userTaskList = taskMap.get(task.getId());
                if (userTaskList != null) {
                    for (LearningTaskUser userTask : userTaskList) {
                        LearningTaskVO tvo = new LearningTaskVO();
                        tvo.setTaskId(task.getId());
                        tvo.setTaskName(task.getTaskName());
                        tvo.setStartTime(task.getStartTime());
                        tvo.setEndTime(task.getEndTime());
                        tvo.setStatus(task.getStatus());
                        tvo.setIsCompleted(userTask.getIsCompleted());
                        tvo.setCompletedTime(userTask.getCompletedTime());
                        taskVOList.add(tvo);
                    }
                }
            }
        }
        vo.setTasks(taskVOList);
        result.add(vo);
    }
    return result;
}
```

```java
public class KnowledgeWithTasksVO {
    private Long documentId;
    private String title;
    private String fileUrl;
    private String description;
    private String category;
    private String tags;
    private List<LearningTaskVO> tasks;
    // getter/setter
}

public class LearningTaskVO {
    private Long taskId;
    private String taskName;
    private Date startTime;
    private Date endTime;
    private String status;
    private Boolean isCompleted;
    private Date completedTime;
    // getter/setter
}
```

---

**User**

需要完整sql 减少多次查询

---

**Cursor**

你可以用如下SQL一次性查出**所有知识文档**及**当前用户需要学习的任务**（包括任务状态、是否完成等），避免多次查询：

---

### 完整SQL（MySQL版）

```sql
SELECT
    d.id AS document_id,
    d.title,
    d.file_url,
    d.description,
    d.category,
    d.tags,
    t.id AS task_id,
    t.task_name,
    t.start_time,
    t.end_time,
    t.status AS task_status,
    tu.is_completed,
    tu.completed_time
FROM
    knowledge_document d
LEFT JOIN learning_task t ON t.document_id = d.id
LEFT JOIN learning_task_user tu ON tu.task_id = t.id AND tu.user_id = #{userId}
ORDER BY d.id, t.id;
```

- `#{userId}` 替换为当前登录用户的ID。
- 这样每一行是一个文档和该用户的一个任务（如果有任务分配给该用户）。
- 没有分配任务的文档，`task_id`、`is_completed`等字段为`NULL`。

---

### 结果结构举例

| document_id | title   | ... | task_id | task_name | ... | is_completed | completed_time |
|-------------|---------|-----|---------|-----------|-----|--------------|---------------|
| 1           | 文档A   | ... | 101     | 任务1     | ... | 0            | null          |
| 1           | 文档A   | ... | 102     | 任务2     | ... | 1            | 2024-07-01    |
| 2           | 文档B   | ... | null    | null      | ... | null         | null          |

---

### MyBatis XML写法示例

```xml
<select id="selectKnowledgeWithUserTasks" resultType="com.example.vo.KnowledgeWithTasksVO">
    SELECT
        d.id AS document_id,
        d.title,
        d.file_url,
        d.description,
        d.category,
        d.tags,
        t.id AS task_id,
        t.task_name,
        t.start_time,
        t.end_time,
        t.status AS task_status,
        tu.is_completed,
        tu.completed_time
    FROM
        knowledge_document d
    LEFT JOIN learning_task t ON t.document_id = d.id
    LEFT JOIN learning_task_user tu ON tu.task_id = t.id AND tu.user_id = #{userId}
    ORDER BY d.id, t.id
</select>
```

---

### VO对象建议

```java
public class KnowledgeWithTasksVO {
    private Long documentId;
    private String title;
    private String fileUrl;
    private String description;
    private String category;
    private String tags;
    private Long taskId;
    private String taskName;
    private Date startTime;
    private Date endTime;
    private String taskStatus;
    private Boolean isCompleted;
    private Date completedTime;
    // getter/setter
}
```

前端可按`documentId`分组展示。

---

如需**嵌套返回结构**（即每个文档下有任务列表），可在Service层组装。  
如需分页、条件筛选等功能，也可继续扩展！

```sql
SELECT
    d.id AS document_id,
    d.title,
    d.file_url,
    d.description,
    d.category,
    d.tags,
    t.id AS task_id,
    t.task_name,
    t.start_time,
    t.end_time,
    t.status AS task_status,
    tu.is_completed,
    tu.completed_time
FROM
    knowledge_document d
LEFT JOIN learning_task t ON t.document_id = d.id
LEFT JOIN learning_task_user tu ON tu.task_id = t.id AND tu.user_id = #{userId}
ORDER BY d.id, t.id;
```

```xml
<select id="selectKnowledgeWithUserTasks" resultType="com.example.vo.KnowledgeWithTasksVO">
    SELECT
        d.id AS document_id,
        d.title,
        d.file_url,
        d.description,
        d.category,
        d.tags,
        t.id AS task_id,
        t.task_name,
        t.start_time,
        t.end_time,
        t.status AS task_status,
        tu.is_completed,
        tu.completed_time
    FROM
        knowledge_document d
    LEFT JOIN learning_task t ON t.document_id = d.id
    LEFT JOIN learning_task_user tu ON tu.task_id = t.id AND tu.user_id = #{userId}
    ORDER BY d.id, t.id
</select>
```

```java
public class KnowledgeWithTasksVO {
    private Long documentId;
    private String title;
    private String fileUrl;
    private String description;
    private String category;
    private String tags;
    private Long taskId;
    private String taskName;
    private Date startTime;
    private Date endTime;
    private String taskStatus;
    private Boolean isCompleted;
    private Date completedTime;
    // getter/setter
}
```

