# basic-platform-ui

## 项目设置
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## 文件结构

### api

#### modules 

所有子模块API

#### config.js

axios默认配置，包含基础路径等信息

#### axios.js

二次封装axios模块，包含拦截器等信息

#### api.js

请求接口汇合模块，聚合所有模块API

### mock

#### modules

所有需进行数据测试的子模块

#### index.js

所有需进行数据测试的子模块的汇合模块，统一导入所有子模块进行数据模拟

### store

#### modules

管理所有子模块的应用状态

#### index.js

统一组织导入和管理子模块

### components

所有可复用的组件

### plugins

所有引入的插件

### utils

所有的工具类

### views

所有模块的vue页面

## 全局配置

### 统一url配置

### 统一API请求

### request拦截器

### response拦截器

### axios封装插件
