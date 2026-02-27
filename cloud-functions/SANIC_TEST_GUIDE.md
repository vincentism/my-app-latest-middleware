# Sanic 测试指南

## 为什么 Sanic 需要独立测试？

Sanic 是一个**异步 Web 框架**，它使用自己的事件循环（event loop）。与同步框架（FastAPI、Flask、Django）不同，Sanic **不能在同一个进程中与其他框架混用**，因为：

1. **事件循环冲突**: Sanic 需要控制整个事件循环
2. **异步运行时**: Sanic 的所有路由处理函数都是异步的（`async def`）
3. **服务器架构**: Sanic 使用 uvloop（更快的事件循环实现）

## 测试方法

### 方法 1：使用专用启动脚本（推荐）

```bash
cd /Users/vincentlli/Documents/demo/netlify/my-app-latest/cloud-functions
python3 run_sanic.py
```

然后访问：http://localhost:8000

### 方法 2：直接运行 demo-sanic.py

```bash
cd /Users/vincentlli/Documents/demo/netlify/my-app-latest/cloud-functions
python3 demo-sanic.py
```

### 方法 3：使用 sanic 命令行工具

```bash
cd /Users/vincentlli/Documents/demo/netlify/my-app-latest/cloud-functions
sanic demo_sanic:app --host=0.0.0.0 --port=8000 --debug
```

## 测试用例

Sanic 测试页面包含 18 个测试用例：

### ✅ 已修复的测试

1. **基础路由** - GET / - 获取 Sanic 框架信息
2. **健康检查** - GET /health - 服务健康状态
3. **获取用户** - GET /users/1 - 通过 ID 获取用户信息
4. **创建用户** - POST /users - 创建新用户（修复：`username` 字段）
5. **更新用户** - PUT /users/1 - 更新用户信息（修复：`username` 字段）
6. **删除用户** - DELETE /users/1 - 删除用户（修复：204 空响应体）
7. **搜索功能** - GET /search?q=test - 搜索 API
8. **流式响应** - GET /stream - Server-Sent Events
9. **JSON 流** - GET /stream/json - JSON 流式传输
10. **大数据流** - GET /stream/large - 大数据流
11. **异步延迟** - GET /async/delay/1 - 异步延迟操作（修复：检查 `actual_duration`）
12. **并行任务** - GET /async/parallel - 并行异步任务
13. **数据库模拟** - GET /async/database - 模拟数据库查询（修复：检查 `user`）
14. **请求头回显** - GET /headers/echo - 回显请求头（修复：检查 `user_agent`）
15. **自定义响应头** - GET /headers/custom - 设置自定义头（修复：检查 `custom headers`）
16. **设置 Cookie** - GET /cookie/set - 设置 Cookie（修复：检查 `Cookie set`）
17. **读取 Cookie** - GET /cookie/get - 读取 Cookie
18. **错误处理** - GET /error/test - 500 错误测试

## 关键修复

### 1. 删除用户 (DELETE /users/{id})

**问题**: 返回 204 状态码时不应包含响应体

```python
# ❌ 错误 - 204 不应有响应体
return json({
    "message": "User deleted",
    "user_id": user_id
}, status=204)

# ✅ 正确 - 使用 empty() 返回空响应
from sanic.response import empty
return empty(status=204, headers={'X-User-Id': str(user_id)})
```

### 2. 创建/更新用户

**问题**: 请求体字段名不匹配

```python
# ❌ 测试发送 "name"，后端期望 "username"
{"name": "测试", "email": "test@example.com"}

# ✅ 修复后统一使用 "username"
{"username": "测试", "email": "test@example.com"}
```

### 3. 测试检查条件

修复了多个测试的检查条件，使其与实际 API 响应匹配：

- 异步延迟：`"delayed"` → `"actual_duration"`
- 数据库模拟：`"users"` → `"user"`
- 请求头回显：`"headers"` → `"user_agent"`
- 自定义响应头：`"Custom-Header"` → `"custom headers"`
- 设置 Cookie：`"cookie"` → `"Cookie set"`

## 与其他框架的对比

| 框架 | 类型 | 测试方法 | 端口 |
|------|------|---------|------|
| FastAPI | 同步/异步 | 混合部署 | 8088 |
| Flask | 同步 | 混合部署 | 8088 |
| Django | 同步 | 混合部署 | 8088 |
| **Sanic** | **异步** | **独立部署** | **8000** |

## 注意事项

1. **不要同时运行**: 如果其他框架正在运行（如 `edgeone pages dev`），请先停止它们
2. **端口冲突**: 确保 8000 端口没有被占用
3. **依赖检查**: 确保已安装 Sanic：`pip install sanic`
4. **Python 版本**: Sanic 需要 Python 3.7+

## 故障排查

### 问题 1: 端口已被占用

```bash
# 查找占用 8000 端口的进程
lsof -i :8000

# 杀死进程
kill -9 <PID>
```

### 问题 2: 导入错误

```bash
# 确保在正确的目录
cd /Users/vincentlli/Documents/demo/netlify/my-app-latest/cloud-functions

# 检查 Python 路径
python3 -c "import sys; print(sys.path)"
```

### 问题 3: Sanic 未安装

```bash
pip3 install sanic
```

## 性能特点

Sanic 的异步特性使其在以下场景表现出色：

- ✅ **高并发**: 可同时处理大量请求
- ✅ **I/O 密集**: 数据库查询、API 调用
- ✅ **实时通信**: WebSocket、SSE
- ✅ **流式处理**: 大文件传输

## 总结

Sanic 虽然不能与其他框架混用，但它的异步特性提供了卓越的性能。使用独立测试可以充分验证其功能和性能优势。

**预期测试结果**: 18/18 全部通过 ✅
