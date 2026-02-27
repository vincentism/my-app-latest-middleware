# Python 云函数 - 快速参考

## 🎯 项目完成情况

### ✅ 已完成的文件

| 文件 | 说明 | 行数 | 状态 |
|------|------|------|------|
| `index.py` | 测试索引页（HTML） | 150+ | ✅ |
| `demo-fastapi.py` | FastAPI 完整示例 | 300+ | ✅ |
| `demo-flask.py` | Flask 完整示例 | 350+ | ✅ |
| `demo-django.py` | Django 完整示例 | 400+ | ✅ |
| `demo-sanic.py` | Sanic 完整示例 | 450+ | ✅ |
| `requirements.txt` | Python 依赖 | 10 | ✅ |
| `test_all.py` | 自动化测试脚本 | 250+ | ✅ |
| `TEST_GUIDE.md` | 详细测试指南 | 500+ | ✅ |
| `README.md` | 项目说明文档 | 200+ | ✅ |

### 📊 功能覆盖率

| 功能类别 | FastAPI | Flask | Django | Sanic |
|---------|---------|-------|--------|-------|
| **基础路由** | ✅ | ✅ | ✅ | ✅ |
| **RESTful API** | ✅ | ✅ | ✅ | ✅ |
| **路径参数** | ✅ | ✅ | ✅ | ✅ |
| **查询参数** | ✅ | ✅ | ✅ | ✅ |
| **POST/PUT/DELETE** | ✅ | ✅ | ✅ | ✅ |
| **JSON 处理** | ✅ | ✅ | ✅ | ✅ |
| **流式响应 (SSE)** | ✅ | ✅ | ✅ | ✅ |
| **JSON 流** | ✅ | ✅ | ✅ | ✅ |
| **大数据流** | ❌ | ✅ | ✅ | ✅ |
| **文件上传** | ✅ | ✅ | ✅ | ✅ |
| **多文件上传** | ✅ | ✅ | ✅ | ✅ |
| **异步操作** | ✅ | ❌ | ❌ | ✅ |
| **并发处理** | ✅ | ❌ | ❌ | ✅ |
| **数据验证** | ✅ | ⚠️ | ⚠️ | ⚠️ |
| **请求头处理** | ✅ | ✅ | ✅ | ✅ |
| **响应头自定义** | ✅ | ✅ | ✅ | ✅ |
| **Cookie 管理** | ❌ | ✅ | ✅ | ✅ |
| **错误处理** | ✅ | ✅ | ⚠️ | ✅ |
| **中间件** | ⚠️ | ✅ | ⚠️ | ✅ |
| **性能测试** | ✅ | ✅ | ✅ | ✅ |
| **自动文档** | ✅ | ❌ | ❌ | ❌ |

**图例**: ✅ 已实现 | ⚠️ 部分实现 | ❌ 未实现/不适用

## 🚀 快速命令

### 开发环境

```bash
# 1. 安装依赖
pip install -r requirements.txt

# 2. 启动开发服务器
edgeone pages dev

# 3. 访问测试页面
open http://localhost:8088/
```

### 测试命令

```bash
# 自动化测试（所有框架）
python test_all.py

# 单独测试各框架
curl http://localhost:8088/demo-fastapi/health
curl http://localhost:8088/demo-flask/health
curl http://localhost:8088/demo-django/health
curl http://localhost:8088/demo-sanic/health
```

### 常用测试

```bash
# FastAPI
curl http://localhost:8088/demo-fastapi/users/123
curl http://localhost:8088/demo-fastapi/stream
curl -X POST http://localhost:8088/demo-fastapi/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","price":99.99,"tags":["test"]}'

# Flask
curl "http://localhost:8088/demo-flask/search?q=test&limit=5"
curl http://localhost:8088/demo-flask/stream/json

# Django
curl "http://localhost:8088/demo-django/search/?q=test"
curl http://localhost:8088/demo-django/stream/json/

# Sanic
curl http://localhost:8088/demo-sanic/async/parallel
curl http://localhost:8088/demo-sanic/stream
```

## 📋 完整 API 端点

### FastAPI (`/demo-fastapi`)

```
GET  /                          # 根路径
GET  /health                    # 健康检查
GET  /users/{user_id}          # 获取用户
GET  /search                    # 搜索
POST /items                     # 创建项目
PUT  /items/{item_id}          # 更新项目
GET  /stream                    # SSE 流
GET  /stream/json              # JSON 流
POST /upload                    # 文件上传
POST /upload/multiple          # 多文件上传
GET  /async/delay/{seconds}    # 异步延迟
GET  /async/parallel           # 并发操作
GET  /headers/echo             # 回显请求头
GET  /performance/compute/{n}  # 性能测试
GET  /docs                      # API 文档
```

### Flask (`/demo-flask`)

```
GET    /                          # 根路径
GET    /health                    # 健康检查
GET    /users/{user_id}          # 获取用户
POST   /users                     # 创建用户
PUT    /users/{user_id}          # 更新用户
DELETE /users/{user_id}          # 删除用户
GET    /search                    # 搜索
GET    /stream                    # SSE 流
GET    /stream/json              # JSON 流
GET    /stream/large             # 大数据流
POST   /upload                    # 文件上传
POST   /upload/multiple          # 多文件上传
GET    /headers/echo             # 回显请求头
GET    /headers/custom           # 自定义响应头
GET    /cookie/set               # 设置 Cookie
GET    /cookie/get               # 获取 Cookie
GET    /performance/compute/{n}  # 性能测试
*      /methods/test             # HTTP 方法测试
```

### Django (`/demo-django`)

```
GET    /                            # 根路径
GET    /health/                     # 健康检查
GET    /users/{user_id}/           # 获取用户
POST   /users/create/              # 创建用户
PUT    /users/{user_id}/update/   # 更新用户
DELETE /users/{user_id}/delete/   # 删除用户
GET    /search/                     # 搜索
GET    /stream/                     # SSE 流
GET    /stream/json/               # JSON 流
GET    /stream/large/              # 大数据流
POST   /upload/                     # 文件上传
POST   /upload/multiple/           # 多文件上传
GET    /headers/echo/              # 回显请求头
GET    /headers/custom/            # 自定义响应头
GET    /cookie/set/                # 设置 Cookie
GET    /cookie/get/                # 获取 Cookie
GET    /performance/compute/{n}/  # 性能测试
*      /methods/test/              # HTTP 方法测试
```

### Sanic (`/demo-sanic`)

```
GET    /                          # 根路径
GET    /health                    # 健康检查
GET    /users/{user_id}          # 获取用户
POST   /users                     # 创建用户
PUT    /users/{user_id}          # 更新用户
DELETE /users/{user_id}          # 删除用户
GET    /search                    # 搜索
GET    /stream                    # SSE 流
GET    /stream/json              # JSON 流
GET    /stream/large             # 大数据流
POST   /upload                    # 文件上传
POST   /upload/multiple          # 多文件上传
GET    /async/delay/{seconds}    # 异步延迟
GET    /async/parallel           # 并发操作
GET    /async/database           # 异步数据库模拟
GET    /headers/echo             # 回显请求头
GET    /headers/custom           # 自定义响应头
GET    /cookie/set               # 设置 Cookie
GET    /cookie/get               # 获取 Cookie
GET    /performance/compute/{n}  # 性能测试
```

## 🎯 测试清单

### 基础功能测试
- [ ] 所有框架的根路径访问
- [ ] 健康检查端点
- [ ] GET/POST/PUT/DELETE 方法
- [ ] 路径参数解析
- [ ] 查询参数处理
- [ ] JSON 请求体
- [ ] 响应状态码

### 高级功能测试
- [ ] SSE 流式响应
- [ ] JSON 流式响应
- [ ] 大数据流传输
- [ ] 单文件上传
- [ ] 多文件上传
- [ ] 异步操作（FastAPI/Sanic）
- [ ] 并发处理（FastAPI/Sanic）
- [ ] 请求头回显
- [ ] 自定义响应头
- [ ] Cookie 设置和读取

### 性能测试
- [ ] 计算密集型操作
- [ ] 并发请求处理
- [ ] 响应时间测量
- [ ] 压力测试（ab/wrk）

### 错误处理测试
- [ ] 参数验证错误
- [ ] 404 错误
- [ ] 500 服务器错误
- [ ] 异常捕获

## 📊 预期测试结果

运行 `python test_all.py` 应该看到:

```
====================================
Python Cloud Functions 自动化测试
====================================
测试服务器: http://localhost:8088

============================================================
测试 FastAPI
============================================================

✓ FastAPI - 根路径: 200 (0.05s)
✓ FastAPI - 健康检查: 200 (0.02s)
✓ FastAPI - 获取用户: 200 (0.03s)
...

预期通过率: 95%+
```

## 🔧 故障排除

### 问题1: 端口被占用
```bash
# 查找占用端口的进程
lsof -i :8088
# 或
netstat -tulpn | grep 8088

# 杀死进程
kill -9 <PID>
```

### 问题2: 模块导入错误
```bash
# 重新安装依赖
pip install -r requirements.txt --force-reinstall

# 检查 Python 版本
python --version  # 需要 3.10+
```

### 问题3: 路径404
```bash
# 检查云函数是否正确部署
edgeone pages build
edgeone pages dev
```

## 📚 参考资源

- [EdgeOne Pages 文档](https://cloud.tencent.com/document/product/1552)
- [FastAPI 教程](https://fastapi.tiangolo.com/tutorial/)
- [Flask 快速开始](https://flask.palletsprojects.com/quickstart/)
- [Django 入门](https://docs.djangoproject.com/en/stable/intro/)
- [Sanic 指南](https://sanic.dev/en/guide/)

---

**最后更新**: 2026-02-27
**维护者**: Vincent Li
