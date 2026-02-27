# Python Cloud Functions 测试文档

EdgeOne Pages 云函数支持的 Python 框架完整测试集合。

## 📦 支持的框架

| 框架 | 版本 | 特性 | 文件 |
|------|------|------|------|
| **FastAPI** | 0.100.0+ | 异步、高性能、自动文档 | `demo-fastapi.py` |
| **Flask** | 2.0.0+ | 轻量级、灵活、生态丰富 | `demo-flask.py` |
| **Django** | 4.0+ | 全功能、ORM、管理后台 | `demo-django.py` |
| **Sanic** | 21.0+ | 异步、WebSocket、高性能 | `demo-sanic.py` |

## 🚀 快速开始

### 1. 安装依赖

```bash
pip install -r requirements.txt
```

### 2. 本地测试

```bash
# EdgeOne Pages 开发服务器
edgeone pages dev

# 访问测试
curl http://localhost:8088/
```

### 3. 部署

```bash
edgeone pages build
edgeone pages deploy
```

## 📋 功能测试清单

### ✅ 基础功能

- [ ] **HTTP 方法**
  - [ ] GET 请求
  - [ ] POST 请求
  - [ ] PUT 请求
  - [ ] DELETE 请求
  - [ ] PATCH 请求

- [ ] **路由**
  - [ ] 静态路由
  - [ ] 动态路由（路径参数）
  - [ ] 查询参数
  - [ ] 可选参数

- [ ] **请求处理**
  - [ ] JSON 请求体
  - [ ] 表单数据
  - [ ] 文件上传
  - [ ] 多文件上传
  - [ ] 请求头处理

- [ ] **响应类型**
  - [ ] JSON 响应
  - [ ] HTML 响应
  - [ ] 文本响应
  - [ ] 自定义状态码
  - [ ] 自定义响应头

### ✅ 高级功能

- [ ] **流式响应**
  - [ ] SSE (Server-Sent Events)
  - [ ] JSON 流
  - [ ] 大数据流
  - [ ] 分块传输

- [ ] **异步操作**（FastAPI/Sanic）
  - [ ] 异步路由
  - [ ] 并发请求
  - [ ] 异步数据库模拟
  - [ ] 延迟操作

- [ ] **数据验证**
  - [ ] 参数类型验证
  - [ ] 参数范围验证
  - [ ] 必填参数检查
  - [ ] 正则表达式验证
  - [ ] Pydantic 模型验证（FastAPI）

- [ ] **会话管理**
  - [ ] Cookie 设置
  - [ ] Cookie 读取
  - [ ] Session 管理

- [ ] **错误处理**
  - [ ] 400 错误（Bad Request）
  - [ ] 404 错误（Not Found）
  - [ ] 500 错误（Server Error）
  - [ ] 自定义错误处理
  - [ ] 全局异常捕获

### ✅ 性能测试

- [ ] **负载测试**
  - [ ] 计算密集型操作
  - [ ] I/O 密集型操作
  - [ ] 并发请求处理
  - [ ] 响应时间测量

- [ ] **优化测试**
  - [ ] 缓存策略
  - [ ] 数据压缩
  - [ ] 连接池
  - [ ] 异步处理

## 🧪 测试用例

### FastAPI 测试

```bash
# 1. 基础功能
curl http://localhost:8088/
curl http://localhost:8088/health

# 2. 路径参数
curl http://localhost:8088/users/123
curl "http://localhost:8088/users/123?include_email=false"

# 3. 查询参数
curl "http://localhost:8088/search?q=test&skip=0&limit=10&sort=asc"

# 4. POST 请求
curl -X POST http://localhost:8088/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Item","price":99.99,"tags":["test"]}'

# 5. 流式响应
curl http://localhost:8088/stream
curl http://localhost:8088/stream/json

# 6. 文件上传
curl -X POST http://localhost:8088/upload \
  -F "file=@test.txt" \
  -F "description=Test file"

# 7. 异步操作
curl http://localhost:8088/async/delay/2
curl http://localhost:8088/async/parallel

# 8. 性能测试
curl http://localhost:8088/performance/compute/10000
```

### Flask 测试

```bash
# 路径前缀为框架文件名（根据实际部署路径调整）
curl http://localhost:8088/demo-flask
curl http://localhost:8088/demo-flask/health

# RESTful API
curl http://localhost:8088/demo-flask/users/123
curl -X POST http://localhost:8088/demo-flask/users \
  -H "Content-Type: application/json" \
  -d '{"username":"test_user","email":"test@example.com"}'

# 流式响应
curl http://localhost:8088/demo-flask/stream
curl http://localhost:8088/demo-flask/stream/json

# Cookie
curl http://localhost:8088/demo-flask/cookie/set
curl http://localhost:8088/demo-flask/cookie/get -b cookies.txt
```

### Django 测试

```bash
# 基础路由
curl http://localhost:8088/demo-django
curl http://localhost:8088/demo-django/health

# RESTful API
curl http://localhost:8088/demo-django/users/123/
curl -X POST http://localhost:8088/demo-django/users/create/ \
  -H "Content-Type: application/json" \
  -d '{"username":"django_user","email":"django@example.com"}'

# 流式响应
curl http://localhost:8088/demo-django/stream/
curl http://localhost:8088/demo-django/stream/json/

# 搜索
curl "http://localhost:8088/demo-django/search/?q=test&limit=5"
```

### Sanic 测试

```bash
# 基础路由
curl http://localhost:8088/demo-sanic
curl http://localhost:8088/demo-sanic/health

# 异步操作
curl http://localhost:8088/demo-sanic/async/delay/2
curl http://localhost:8088/demo-sanic/async/parallel
curl http://localhost:8088/demo-sanic/async/database

# 流式响应
curl http://localhost:8088/demo-sanic/stream
curl http://localhost:8088/demo-sanic/stream/json

# RESTful API
curl http://localhost:8088/demo-sanic/users/123
curl -X POST http://localhost:8088/demo-sanic/users \
  -H "Content-Type: application/json" \
  -d '{"username":"sanic_user","email":"sanic@example.com"}'
```

## 📊 流式响应测试

### SSE (Server-Sent Events)

```bash
# FastAPI
curl -N http://localhost:8088/stream

# Flask
curl -N http://localhost:8088/demo-flask/stream

# Django
curl -N http://localhost:8088/demo-django/stream/

# Sanic
curl -N http://localhost:8088/demo-sanic/stream
```

### JSON 流

```bash
# FastAPI
curl http://localhost:8088/stream/json

# Flask
curl http://localhost:8088/demo-flask/stream/json

# Django
curl http://localhost:8088/demo-django/stream/json/

# Sanic
curl http://localhost:8088/demo-sanic/stream/json
```

### 大数据流

```bash
# FastAPI - 100 chunks
curl http://localhost:8088/stream/large # 未实现，需要添加

# Flask
curl http://localhost:8088/demo-flask/stream/large

# Django
curl http://localhost:8088/demo-django/stream/large/

# Sanic
curl http://localhost:8088/demo-sanic/stream/large
```

## 🔧 文件上传测试

### 单文件上传

```bash
# 创建测试文件
echo "Hello, World!" > test.txt

# FastAPI
curl -X POST http://localhost:8088/upload \
  -F "file=@test.txt"

# Flask
curl -X POST http://localhost:8088/demo-flask/upload \
  -F "file=@test.txt"

# Django
curl -X POST http://localhost:8088/demo-django/upload/ \
  -F "file=@test.txt"

# Sanic
curl -X POST http://localhost:8088/demo-sanic/upload \
  -F "file=@test.txt"
```

### 多文件上传

```bash
# 创建多个测试文件
echo "File 1" > file1.txt
echo "File 2" > file2.txt

# FastAPI
curl -X POST http://localhost:8088/upload/multiple \
  -F "files=@file1.txt" \
  -F "files=@file2.txt"

# Flask
curl -X POST http://localhost:8088/demo-flask/upload/multiple \
  -F "files=@file1.txt" \
  -F "files=@file2.txt"

# Django
curl -X POST http://localhost:8088/demo-django/upload/multiple/ \
  -F "files=@file1.txt" \
  -F "files=@file2.txt"

# Sanic
curl -X POST http://localhost:8088/demo-sanic/upload/multiple \
  -F "files=@file1.txt" \
  -F "files=@file2.txt"
```

## ⚡ 性能测试

```bash
# 计算密集型测试
# FastAPI
curl http://localhost:8088/performance/compute/100000

# Flask
curl http://localhost:8088/demo-flask/performance/compute/100000

# Django
curl http://localhost:8088/demo-django/performance/compute/100000/

# Sanic
curl http://localhost:8088/demo-sanic/performance/compute/100000

# 使用 ab (Apache Bench) 进行压力测试
ab -n 1000 -c 10 http://localhost:8088/health

# 使用 wrk 进行压力测试
wrk -t4 -c100 -d30s http://localhost:8088/health
```

## 🐛 错误测试

```bash
# 参数验证错误（FastAPI）
curl "http://localhost:8088/error/validation?age=999"

# 服务器错误
curl http://localhost:8088/error/500
curl http://localhost:8088/demo-flask/error/test
curl http://localhost:8088/demo-sanic/error/test

# 404 错误
curl http://localhost:8088/not-found-path
```

## 📝 注意事项

1. **路径前缀**：不同框架的云函数可能有不同的路径前缀，取决于文件名和部署配置
2. **超时设置**：云函数有执行时间限制，长时间运行的流式响应需要注意
3. **内存限制**：注意文件上传大小和内存使用
4. **并发限制**：测试并发时注意云函数的并发限制
5. **冷启动**：首次调用可能较慢，需要预热

## 🔍 调试技巧

```bash
# 查看完整响应头
curl -v http://localhost:8088/

# 查看响应时间
curl -w "\nTime: %{time_total}s\n" http://localhost:8088/

# 保存响应
curl http://localhost:8088/ > response.json

# 使用 jq 格式化 JSON
curl http://localhost:8088/ | jq .

# 测试流式响应
curl -N --no-buffer http://localhost:8088/stream
```

## 📚 更多测试

- WebSocket 测试（Sanic 支持）
- GraphQL 集成测试
- 数据库连接测试
- 第三方 API 集成测试
- 认证授权测试
- CORS 跨域测试

## 🎯 下一步

- [ ] 添加自动化测试脚本
- [ ] 集成 CI/CD 测试
- [ ] 性能基准测试
- [ ] 监控和日志收集
- [ ] 错误追踪和报警
