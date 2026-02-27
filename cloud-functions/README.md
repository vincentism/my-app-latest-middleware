# Python Cloud Functions - 完整测试集合

EdgeOne Pages 云函数支持的所有 Python Web 框架的完整测试示例。

## 📁 文件结构

```
cloud-functions/
├── README.md                 # 本文件
├── TEST_GUIDE.md            # 详细测试指南
├── requirements.txt         # Python 依赖
├── index.py                 # 测试索引页（FastAPI）
├── demo-fastapi.py          # FastAPI 完整示例
├── demo-flask.py            # Flask 完整示例
├── demo-django.py           # Django 完整示例
├── demo-sanic.py            # Sanic 完整示例
└── test_all.py              # 自动化测试脚本
```

## 🚀 快速开始

### 1. 安装依赖

```bash
# 创建虚拟环境（推荐）
python3 -m venv venv
source venv/bin/activate  # Linux/macOS
# 或
venv\Scripts\activate     # Windows

# 安装依赖
pip install -r requirements.txt
```

### 2. 启动开发服务器

```bash
# 使用 EdgeOne Pages CLI
edgeone pages dev

# 服务将运行在 http://localhost:8088
```

### 3. 访问测试

浏览器访问: http://localhost:8088/

## 📦 支持的框架

### FastAPI
- **特点**: 现代、快速、异步、自动 API 文档
- **访问**: http://localhost:8088/demo-fastapi
- **文档**: http://localhost:8088/demo-fastapi/docs

### Flask
- **特点**: 轻量级、灵活、生态丰富
- **访问**: http://localhost:8088/demo-flask

### Django
- **特点**: 全功能、ORM、管理后台
- **访问**: http://localhost:8088/demo-django

### Sanic
- **特点**: 异步、高性能、WebSocket
- **访问**: http://localhost:8088/demo-sanic

## 🧪 运行测试

### 自动化测试

```bash
# 确保服务器正在运行
edgeone pages dev

# 在另一个终端运行测试
python test_all.py
```

### 手动测试

```bash
# FastAPI 示例
curl http://localhost:8088/demo-fastapi/users/123
curl http://localhost:8088/demo-fastapi/stream

# Flask 示例
curl http://localhost:8088/demo-flask/users/123
curl -X POST http://localhost:8088/demo-flask/users \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com"}'

# Django 示例
curl http://localhost:8088/demo-django/search/?q=test

# Sanic 示例
curl http://localhost:8088/demo-sanic/async/parallel
```

## ✅ 测试功能清单

### 基础功能
- [x] HTTP 方法 (GET, POST, PUT, DELETE, PATCH)
- [x] 静态路由和动态路由
- [x] 路径参数和查询参数
- [x] JSON 请求体处理
- [x] 表单数据处理
- [x] 文件上传（单文件和多文件）
- [x] 请求头和响应头
- [x] Cookie 管理

### 高级功能
- [x] 流式响应 (SSE, JSON Stream, Large Data)
- [x] 异步操作和并发处理
- [x] 数据验证和类型检查
- [x] 错误处理和异常捕获
- [x] 中间件和请求钩子
- [x] 性能测试

### 框架特定功能
- [x] FastAPI: 自动 API 文档
- [x] FastAPI: Pydantic 模型验证
- [x] Sanic: 异步流式处理
- [x] Django: URL 路由配置
- [x] Flask: 请求钩子

## 📊 性能对比

运行性能测试:

```bash
# 计算密集型测试
curl http://localhost:8088/demo-fastapi/performance/compute/100000
curl http://localhost:8088/demo-flask/performance/compute/100000
curl http://localhost:8088/demo-django/performance/compute/100000
curl http://localhost:8088/demo-sanic/performance/compute/100000

# 使用 Apache Bench 进行压测
ab -n 1000 -c 10 http://localhost:8088/demo-fastapi/health
ab -n 1000 -c 10 http://localhost:8088/demo-flask/health
ab -n 1000 -c 10 http://localhost:8088/demo-django/health
ab -n 1000 -c 10 http://localhost:8088/demo-sanic/health
```

## 🔍 调试技巧

### 查看详细响应

```bash
# 显示响应头
curl -v http://localhost:8088/demo-fastapi/

# 显示响应时间
curl -w "\nTime: %{time_total}s\n" http://localhost:8088/demo-fastapi/

# 格式化 JSON 输出
curl http://localhost:8088/demo-fastapi/ | jq .
```

### 测试流式响应

```bash
# SSE 流（不缓冲）
curl -N http://localhost:8088/demo-fastapi/stream

# JSON 流
curl http://localhost:8088/demo-flask/stream/json
```

### 文件上传测试

```bash
# 创建测试文件
echo "Hello, World!" > test.txt

# 单文件上传
curl -X POST http://localhost:8088/demo-fastapi/upload \
  -F "file=@test.txt"

# 多文件上传
curl -X POST http://localhost:8088/demo-flask/upload/multiple \
  -F "files=@test.txt" \
  -F "files=@test2.txt"
```

## 📝 开发指南

### 添加新功能

1. 在对应的框架文件中添加路由
2. 更新 `TEST_GUIDE.md`
3. 在 `test_all.py` 中添加测试用例
4. 运行测试确保通过

### 添加新框架

1. 创建新的 `demo-<framework>.py` 文件
2. 在 `requirements.txt` 中添加依赖
3. 在 `index.py` 中添加链接
4. 在 `test_all.py` 中添加测试函数

## 🐛 常见问题

### Q: 为什么某些路径返回 404？
A: 检查 EdgeOne Pages 的路由配置，确保云函数正确部署。

### Q: 流式响应没有实时更新？
A: 确保使用 `-N` 或 `--no-buffer` 选项：`curl -N http://...`

### Q: 文件上传失败？
A: 检查文件大小限制（默认 16MB）和 Content-Type 设置。

### Q: 异步操作超时？
A: 云函数有执行时间限制，长时间运行的任务需要注意。

## 📚 相关文档

- [EdgeOne Pages 文档](https://cloud.tencent.com/document/product/1552)
- [FastAPI 文档](https://fastapi.tiangolo.com/)
- [Flask 文档](https://flask.palletsprojects.com/)
- [Django 文档](https://docs.djangoproject.com/)
- [Sanic 文档](https://sanic.dev/)

## 🎯 下一步

- [ ] 添加 WebSocket 测试（Sanic）
- [ ] 集成数据库连接示例
- [ ] 添加认证授权示例
- [ ] GraphQL 集成
- [ ] 添加 CI/CD 测试流程
- [ ] 性能监控和日志收集

## 📄 许可证

MIT License

---

**提示**: 查看 `TEST_GUIDE.md` 获取更详细的测试文档和示例。
