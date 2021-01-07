## 通用用户权限管理系统

> 本系统主要提供组织管理、用户管理、角色管理、菜单管理、岗位管理、字典管理、配置管理、通知管理、日志管理以及sso服务等

### 源码下载

- [http://gitserver.gisinfo.com:10080/hongwei/upms-server](http://gitserver.gisinfo.com:10080/hongwei/upms-server)

*Hello, upms-server！*


### 技术架构


### 技术选型

#### 1、系统环境

    Windows/Mac/Linux
    JDK8
    Nginx
    
#### 2、项目管理

    Maven3
    Git
    
#### 3、开发框架

    Spring Boot 2.1.3.RELEASE
    Spring Framework 5.0
    Spring Security
    Redis
    
#### 4、持久层框架

    JPA
    MyBatis
    Hibernate Validation
    Alibaba Druid
    
#### 5、试图层框架

    Vue2
    Element-UI
    
#### 6、工具类框架

    Guava
    Hutool
    Apache Commons 

### Swagger文档

    访问地址：http://localhost:8888/doc.html
    
### 一、组织管理 [org]

    增加、删除、修改、查询、导入导出、刷新缓存、组织配置用户


### 二、用户管理 [user]

    增加、删除、修改、查询、重置密码、禁用启用、导入导出、刷新缓存、用户角色关系、用户配置角色

### 
### 二、角色管理 [role]
    
    增加、删除、修改、查询、禁用启用、导入导出、刷新缓存、角色配置权限

### 四、菜单管理 [menu]

    增加、删除、修改、查询、刷新缓存、导出

### 五、岗位管理 [post]

    增加、删除、修改、查询、刷新缓存、导出

### 六、字典管理 [dict]

    增加、删除、修改、查询、禁用启用、导入导出、刷新缓存、根据字典类型查看字典列表

### 七、配置管理 [config]

    swagger文档

### 八、通知管理 [notice]

    增加、删除、修改、查询、导出

### 九、日志管理 [log]

#### 登录日志

    增加、删除、清空、查询、导出

#### 操作日志

    增加、删除、清空、查询、详情、导出

### 十、单点登录 [sso]

    提供单点登录服务，可供其他系统集成
    
### 十一、监控管理 [monitor]

    系统监控、sql监控、服务监控
    
### 十二、任务管理 [job]
    
    定时调度任务

---