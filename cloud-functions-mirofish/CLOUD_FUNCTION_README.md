# MiroFish Cloud Function 部署指南

## 📋 概述

本项目已改写为**云函数兼容格式**，支持部署到 EdgeOne Pages、Vercel、Netlify 等云函数平台。

## 🔄 改动说明

### 原始格式
```python
# 传统 Flask 启动方式
def main():
    app = create_app()
    app.run(host='0.0.0.0', port=5001)

if __name__ == '__main__':
    main()
```

### 改写后格式（标准 WSGI 导出）
```python
# EdgeOne Pages 标准 WSGI 模式
from app import create_app

# 直接导出 Flask 应用对象
# EdgeOne Pages 会自动识别并使用 WSGI 模式运行
app = create_app()
application = app  # WSGI 标准别名

# 本地开发模式
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
```

## 🎯 关键变化

**EdgeOne Pages 的 Python 云函数支持三种模式：**

1. ✅ **WSGI 应用模式**（推荐，本项目使用）
   - 直接导出 `app` 或 `application` 对象
   - 支持 Flask、Django WSGI、Bottle 等框架
   - **优势**：无需额外适配代码，性能最佳

2. **ASGI 应用模式**
   - 直接导出 ASGI `app` 对象
   - 支持 FastAPI、Django ASGI、Starlette 等异步框架

3. **Handler 函数模式**（Vercel 风格）
   - 定义 `def handler(request)` 函数
   - 需要手动处理 WSGI 适配

## 🚀 部署方式

### 1. EdgeOne Pages 部署（推荐）

```bash
# 安装 tef-cli（EdgeOne Pages CLI）
npm i -g @tencent-edgeone/tef-cli

# 部署到 EdgeOne Pages
tef deploy
```

**优势**：
- ✅ 自动识别 Flask 应用
- ✅ 零配置部署
- ✅ 支持 WSGI 和 ASGI 框架
- ✅ 开箱即用的路由映射

**edgeone.json 配置示例（可选）：**
```json
{
  "outputDirectory": ".edgeone"
}
```

### 2. 本地开发

EdgeOne Pages 提供开发模式，支持热重载：

```bash
# 方式 1：使用 tef dev（推荐）
tef dev

# 方式 2：直接运行 Python（传统方式）
cd cloud-functions
python index.py

# 方式 3：使用环境变量
FLASK_HOST=127.0.0.1 FLASK_PORT=5001 python index.py
```

**tef dev 的优势**：
- 自动监听文件变化
- 模拟云函数环境
- 统一的路由规则

### 3. Vercel 部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel deploy
```

**vercel.json 配置示例：**
```json
{
  "functions": {
    "cloud-functions/index.py": {
      "runtime": "python3.11",
      "memory": 1024,
      "maxDuration": 60
    }
  }
}
```

**注意**：Vercel 需要 handler 函数模式，如需部署到 Vercel，可以添加一个 handler 适配器。

## 📁 项目结构

```
cloud-functions/
├── index.py              # ✅ 云函数入口（WSGI 模式）
├── app/
│   ├── __init__.py       # Flask 应用工厂
│   ├── config.py         # 配置管理
│   ├── api/              # API 路由
│   │   ├── graph_bp.py   # 图谱 API
│   │   ├── simulation_bp.py  # 模拟 API
│   │   └── report_bp.py  # 报告 API
│   ├── services/         # 业务逻辑
│   └── utils/            # 工具函数
├── requirements.txt      # Python 依赖
├── pyproject.toml        # 项目配置
└── uv.lock               # 依赖锁文件
```

## 🗺️ 路由映射

在 EdgeOne Pages 中，`cloud-functions/index.py` 会映射到**根路径 `/`**，并处理所有子路径。

### 路由示例

| Flask 路由 | EdgeOne Pages URL | 说明 |
|-----------|------------------|------|
| `/health` | `https://your-domain.com/health` | 健康检查 |
| `/api/graph/add_node` | `https://your-domain.com/api/graph/add_node` | 添加节点 |
| `/api/simulation/run` | `https://your-domain.com/api/simulation/run` | 运行模拟 |

### 为什么访问根路径会进入 Python 函数？

因为 `cloud-functions/index.py` 在 EdgeOne Pages 中的路由优先级如下：

1. **静态文件** - `.edgeone/`、`public/` 等目录
2. **Edge Functions** - `edge-functions/` 目录（Edge Runtime）
3. **Cloud Functions** - `cloud-functions/` 目录（Node.js/Python/Go）
4. **Next.js/React 页面** - `src/` 或 `pages/` 目录

如果您的项目同时有 Next.js 页面和 `cloud-functions/index.py`，**Python 云函数优先级更高**。

### 如何让 Next.js 页面优先？

方案 1：**重命名云函数文件**
```
cloud-functions/index.py  →  cloud-functions/api/index.py
```
路由变化：`/` → `/api/*`

方案 2：**使用 edgeone.json 配置重定向**
```json
{
  "redirects": [
    {
      "source": "/api/:path*",
      "destination": "/cloud-functions/:path*",
      "statusCode": 200
    }
  ]
}
```

方案 3：**在 index.py 中手动分流**
```python
from flask import send_from_directory

@app.route('/')
def index():
    # 返回 Next.js 构建的首页
    return send_from_directory('../public', 'index.html')
```

## ⚙️ 环境变量配置

云函数需要以下环境变量（在部署平台配置）：

```bash
# LLM 配置
LLM_API_KEY=your_api_key
LLM_BASE_URL=https://api.openai.com/v1
LLM_MODEL_NAME=gpt-4o-mini

# Zep 配置
ZEP_API_KEY=your_zep_api_key

# Flask 配置（可选）
SECRET_KEY=your_secret_key
FLASK_DEBUG=False

# OASIS 配置（可选）
OASIS_DEFAULT_MAX_ROUNDS=10
```

## 🧪 测试云函数

### 健康检查
```bash
curl https://your-domain.com/health
# 响应: {"status": "ok", "service": "MiroFish Backend"}
```

### API 测试
```bash
# 示例：图谱 API
curl -X POST https://your-domain.com/api/graph/add_node \
  -H "Content-Type: application/json" \
  -d '{"node_id": "test", "data": {"name": "Test Node"}}'
```

## 🔍 EdgeOne Pages WSGI 模式工作原理

1. **检测 Flask 应用**：EdgeOne Pages 扫描 `index.py`，识别 `app` 或 `application` 变量
2. **WSGI 服务器**：自动使用 uvicorn + asgiref 运行 WSGI 应用
3. **路由转发**：将 HTTP 请求转发给 Flask 应用处理
4. **响应返回**：将 Flask 响应转换为云函数响应格式

```
HTTP 请求 → EdgeOne Pages → WSGI Adapter → Flask App → HTTP 响应
```

## ✅ 兼容性

| 功能 | 本地开发 | EdgeOne Pages | Vercel | Netlify |
|------|---------|--------------|--------|---------|
| RESTful API | ✅ | ✅ | ✅ | ✅ |
| JSON 请求/响应 | ✅ | ✅ | ✅ | ✅ |
| 文件上传 | ✅ | ✅ | ⚠️ 受限 | ✅ |
| 流式响应 (SSE) | ✅ | ✅ | ⚠️ 受限 | ⚠️ 受限 |
| WebSocket | ✅ | ❌ | ❌ | ❌ |
| 长连接 | ✅ | ❌ | ❌ | ❌ |
| 会话管理 | ✅ | ⚠️ 无状态 | ⚠️ 无状态 | ⚠️ 无状态 |

**注意**：
- ⚠️ **受限**：功能可用但有平台限制（如超时、大小限制）
- ❌ **不支持**：平台架构不支持此功能
- 云函数是**无状态**的，不适合长连接和会话状态管理

## 🐛 常见问题

### 1. 为什么访问根路径还是 Next.js 页面？

**原因**：路由冲突，Next.js 页面优先级可能更高。

**解决方案**：
1. 确认 `cloud-functions/index.py` 存在且格式正确
2. 检查是否有 `edge-functions/` 或静态资源冲突
3. 使用 `tef dev` 查看路由日志
4. 参考上文"如何让 Next.js 页面优先"调整路由

### 2. 依赖安装失败

```bash
# 使用 uv 管理依赖（推荐）
pip install uv
uv sync

# 或使用传统 pip
pip install -r requirements.txt
```

### 3. 环境变量未加载

确保在部署平台配置了所有必需的环境变量，特别是：
- `LLM_API_KEY`
- `ZEP_API_KEY`

EdgeOne Pages 环境变量配置位置：
- 控制台 → 项目设置 → 环境变量

### 4. 请求超时

云函数有执行时间限制：
- EdgeOne Pages: 30s（默认）
- Vercel Free: 10s
- Vercel Pro: 60s

长时间运行的任务应该：
- 使用异步处理
- 拆分为多个请求
- 考虑使用后台作业队列

### 5. 冷启动慢

**优化方案**：
- 减少依赖包数量
- 使用轻量级框架（如 FastAPI）
- 启用保活机制（EdgeOne Pages 自动支持）

## 📚 相关文档

- [Flask 官方文档](https://flask.palletsprojects.com/)
- [EdgeOne Pages 文档](https://www.tencentcloud.com/document/product/1145)
- [Python WSGI 规范](https://peps.python.org/pep-3333/)

## 💡 最佳实践

1. **代码组织**：
   - 使用 Flask 蓝图（Blueprint）组织路由
   - 分离业务逻辑和路由定义

2. **错误处理**：
   - 添加全局异常捕获
   - 返回友好的错误信息

3. **日志记录**：
   - 使用 Python `logging` 模块
   - 日志会自动同步到平台日志系统

4. **性能监控**：
   - 使用平台提供的监控工具
   - 记录关键指标（响应时间、错误率）

## 🎉 总结

改写完成后的云函数具有以下优势：

✅ **标准 WSGI 模式**：符合 Python Web 标准  
✅ **多平台兼容**：EdgeOne Pages、Vercel、Netlify  
✅ **本地开发友好**：仍可使用 `python index.py` 本地调试  
✅ **零改动迁移**：Flask 应用逻辑无需修改  
✅ **性能最佳**：直接 WSGI 模式，无额外开销  

---

**需要帮助？** 查看项目文档或提交 Issue。

## 🚀 部署方式

### 1. Vercel 部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel deploy
```

**vercel.json 配置示例：**
```json
{
  "functions": {
    "cloud-functions/index.py": {
      "runtime": "python3.11",
      "memory": 1024,
      "maxDuration": 60
    }
  }
}
```

### 2. EdgeOne Pages 部署

```bash
# 使用 tef-cli 部署
tef deploy

# 或手动上传到 EdgeOne Pages 控制台
```

**edgeone.json 配置示例：**
```json
{
  "functions": {
    "pattern": "cloud-functions/**/*.py",
    "runtime": "python311"
  }
}
```

### 3. Netlify 部署

```bash
# 安装 Netlify CLI
npm i -g netlify-cli

# 部署
netlify deploy --prod
```

**netlify.toml 配置示例：**
```toml
[functions]
  directory = "cloud-functions"
  
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/index/:splat"
  status = 200
```

## 🛠️ 本地开发

改写后的 `index.py` 仍然支持**本地开发模式**：

```bash
# 方式 1：直接运行（推荐）
python index.py

# 方式 2：使用环境变量
FLASK_HOST=127.0.0.1 FLASK_PORT=5001 python index.py
```

本地开发时会自动使用 Flask 内置服务器，无需改动开发流程。

## 📁 项目结构

```
cloud-functions/
├── index.py              # ✅ 云函数入口（已改写）
├── app/
│   ├── __init__.py       # Flask 应用工厂
│   ├── config.py         # 配置管理
│   ├── api/              # API 路由
│   ├── services/         # 业务逻辑
│   └── utils/            # 工具函数
├── requirements.txt      # Python 依赖
├── pyproject.toml        # 项目配置
└── uv.lock               # 依赖锁文件
```

## ⚙️ 环境变量配置

云函数需要以下环境变量（在部署平台配置）：

```bash
# LLM 配置
LLM_API_KEY=your_api_key
LLM_BASE_URL=https://api.openai.com/v1
LLM_MODEL_NAME=gpt-4o-mini

# Zep 配置
ZEP_API_KEY=your_zep_api_key

# Flask 配置（可选）
SECRET_KEY=your_secret_key
FLASK_DEBUG=False

# OASIS 配置（可选）
OASIS_DEFAULT_MAX_ROUNDS=10
```

## 🧪 测试云函数

### 健康检查
```bash
curl https://your-domain.com/health
# 响应: {"status": "ok", "service": "MiroFish Backend"}
```

### API 测试
```bash
# 示例：图谱 API
curl -X POST https://your-domain.com/api/graph/add_node \
  -H "Content-Type: application/json" \
  -d '{"node_id": "test", "data": {"name": "Test Node"}}'
```

## 🔍 Handler 工作原理

改写后的 `handler` 函数使用 **WSGI 适配器模式**：

1. **接收请求**：云函数平台传入 `request` 对象
2. **构建 WSGI 环境**：将请求转换为 WSGI `environ` 字典
3. **调用 Flask 应用**：通过 WSGI 接口调用 Flask
4. **捕获响应**：拦截 Flask 的响应数据
5. **返回结果**：转换为云函数平台的响应格式

```python
# WSGI 环境示例
environ = {
    'REQUEST_METHOD': 'POST',
    'PATH_INFO': '/api/graph/add_node',
    'QUERY_STRING': 'debug=true',
    'CONTENT_TYPE': 'application/json',
    'wsgi.input': BytesIO(request_body),
    'HTTP_AUTHORIZATION': 'Bearer token',
    # ...
}
```

## ✅ 兼容性

| 功能 | 本地开发 | Vercel | EdgeOne | Netlify |
|------|---------|--------|---------|---------|
| RESTful API | ✅ | ✅ | ✅ | ✅ |
| JSON 请求/响应 | ✅ | ✅ | ✅ | ✅ |
| 文件上传 | ✅ | ✅ | ⚠️ 受限 | ✅ |
| 流式响应 (SSE) | ✅ | ⚠️ 受限 | ❌ | ⚠️ 受限 |
| WebSocket | ✅ | ❌ | ❌ | ❌ |
| 长连接 | ✅ | ❌ | ❌ | ❌ |
| 会话管理 | ✅ | ⚠️ 无状态 | ⚠️ 无状态 | ⚠️ 无状态 |

**注意**：
- ⚠️ **受限**：功能可用但有平台限制（如超时、大小限制）
- ❌ **不支持**：平台架构不支持此功能
- 云函数是**无状态**的，不适合长连接和会话状态管理

## 🐛 常见问题

### 1. 依赖安装失败
```bash
# 使用 uv 管理依赖（推荐）
pip install uv
uv sync

# 或使用传统 pip
pip install -r requirements.txt
```

### 2. 环境变量未加载
确保在部署平台配置了所有必需的环境变量，特别是：
- `LLM_API_KEY`
- `ZEP_API_KEY`

### 3. 请求超时
云函数有执行时间限制：
- Vercel Free: 10s
- Vercel Pro: 60s
- EdgeOne: 30s

长时间运行的任务应该：
- 使用异步处理
- 拆分为多个请求
- 考虑使用后台作业队列

### 4. 文件上传大小限制
不同平台有不同限制：
- Vercel: 4.5MB
- Netlify: 10MB
- EdgeOne: 视配置而定

对于大文件上传，建议：
- 使用分片上传
- 直接上传到对象存储（如 S3、COS）

## 📚 相关文档

- [Flask 官方文档](https://flask.palletsprojects.com/)
- [Vercel Python Functions](https://vercel.com/docs/functions/runtimes/python)
- [EdgeOne Pages 文档](https://www.tencentcloud.com/document/product/1145)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)

## 💡 最佳实践

1. **冷启动优化**：
   - 使用全局变量缓存 Flask 应用实例
   - 延迟加载重型依赖

2. **错误处理**：
   - 添加全局异常捕获
   - 返回友好的错误信息

3. **日志记录**：
   - 使用 `print()` 或 `logging` 模块
   - 日志会自动同步到平台日志系统

4. **性能监控**：
   - 使用平台提供的监控工具
   - 记录关键指标（响应时间、错误率）

## 🎉 总结

改写完成后的云函数具有以下优势：

✅ **多平台兼容**：一套代码，多处部署  
✅ **本地开发友好**：仍可使用 `python index.py` 本地调试  
✅ **零改动迁移**：Flask 应用逻辑无需修改  
✅ **标准化接口**：符合 Vercel/EdgeOne handler 规范  

---

**需要帮助？** 查看项目文档或提交 Issue。
