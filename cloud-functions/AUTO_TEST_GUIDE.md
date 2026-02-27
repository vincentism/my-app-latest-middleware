# 自动化测试页面使用指南

## 🎉 更新说明

所有框架的根路径现在都返回**带自动测试功能的可视化测试页面**！

## 🚀 快速开始

### 1. 启动服务

#### Dev 模式
```bash
cd /Users/vincentlli/Documents/demo/netlify/my-app-latest
edgeone pages dev
```

#### Build 模式
```bash
cd /Users/vincentlli/Documents/demo/netlify/my-app-latest
edgeone pages build
cd .edgeone/cloud-functions/python
pip3 install --target . -r requirements.txt --upgrade
python3 app.py
```

### 2. 访问测试页面

| 框架 | Dev 模式 URL | Build 模式 URL |
|------|-------------|----------------|
| **FastAPI** | http://localhost:8089/cf/fastapi/ | http://localhost:9000/cf/fastapi/ |
| **Flask** | http://localhost:8089/cf/flask/ | http://localhost:9000/cf/flask/ |
| **Django** | http://localhost:8089/cf/django/ | http://localhost:9000/cf/django/ |
| **Sanic** | http://localhost:8089/cf/sanic/ | http://localhost:9000/cf/sanic/ |

## 📋 测试页面功能

### 界面特性
- ✅ **可视化卡片展示**：每个 API 端点一个测试卡片
- ✅ **一键运行**：点击"运行所有测试"按钮自动执行所有测试
- ✅ **实时状态**：动画显示测试运行状态
- ✅ **结果展示**：显示响应内容、状态码、响应时间
- ✅ **统计面板**：实时显示通过/失败数量
- ✅ **清除结果**：快速清除所有测试结果

### 测试卡片信息
每个测试卡片包含：
- **测试编号**：唯一标识
- **测试名称**：功能描述
- **HTTP 方法**：GET/POST/PUT/DELETE
- **API 路径**：完整的 URL 路径
- **功能描述**：详细说明
- **测试状态**：⏸待运行 / ⏳运行中 / ✅通过 / ❌失败
- **响应结果**：API 返回的内容
- **响应时间**：性能指标

## 📊 各框架测试覆盖

### FastAPI (14 个测试)
1. ✅ 基础路由 - 框架信息
2. ✅ 路径参数 - `/hello/{name}`
3. ✅ 查询参数 - `?q=test&limit=10`
4. ✅ 请求头处理
5. ✅ Cookie 读取/设置
6. ✅ RESTful API - 创建/读取/更新/删除用户
7. ✅ 异步任务
8. ✅ SSE 流式响应
9. ✅ JSON 流式响应
10. ✅ 错误处理

### Flask (15 个测试)
1. ✅ 基础路由
2. ✅ 健康检查
3. ✅ 简单问候
4. ✅ 路径参数
5. ✅ 查询参数
6. ✅ 请求头/Cookie
7. ✅ POST JSON 数据
8. ✅ Session 管理
9. ✅ JSON/HTML 响应
10. ✅ 重定向测试
11. ✅ 流式响应
12. ✅ 错误处理

### Django (17 个测试)
1. ✅ 基础路由
2. ✅ 健康检查
3. ✅ 简单问候
4. ✅ 路径参数
5. ✅ 查询参数
6. ✅ 请求头/Cookie
7. ✅ RESTful API - 完整 CRUD
8. ✅ JSON/HTML 响应
9. ✅ 重定向
10. ✅ 流式响应
11. ✅ 错误处理

### Sanic (18 个测试)
1. ✅ 基础路由
2. ✅ 健康检查
3. ✅ 异步问候
4. ✅ 查询参数
5. ✅ 请求头/Cookie
6. ✅ RESTful API - 完整 CRUD
7. ✅ 异步操作
8. ✅ JSON 响应
9. ✅ 中间件测试
10. ✅ 生命周期钩子
11. ✅ SSE/JSON 流
12. ✅ 错误处理

## 🎨 使用示例

### 步骤 1: 打开测试页面
在浏览器中访问任意框架的根路径，例如：
```
http://localhost:8089/cf/fastapi/
```

### 步骤 2: 运行测试
点击页面顶部的 **"▶ 运行所有测试"** 按钮

### 步骤 3: 查看结果
- 测试会按顺序自动执行
- 每个测试卡片会显示运行状态：
  - ⏸ 灰色 = 待运行
  - ⏳ 橙色 = 运行中（动画闪烁）
  - ✅ 绿色 = 测试通过
  - ❌ 红色 = 测试失败
- 顶部统计面板实时更新通过/失败数量

### 步骤 4: 查看详情
点击任意测试卡片可以展开查看：
- API 响应内容（前 400 字符）
- HTTP 状态码
- 响应时间（毫秒）

### 步骤 5: 清除结果（可选）
点击 **"🔄 清除结果"** 按钮重置所有测试状态

## 🔍 测试原理

### 测试判断逻辑
```javascript
// 正常请求：检查状态码 200 且响应包含关键字
success = response.ok && resultText.includes(check_keyword)

// 流式响应：检查 Content-Type 头
success = response.headers.get('content-type').startsWith('text/event-stream')

// 错误测试：期望非 2xx 状态码
success = !response.ok

// 特定状态码：精确匹配
success = response.status === expectStatus
```

### 测试间隔
- 每个测试之间间隔 **250-300ms**
- 避免并发导致的资源竞争
- 保证测试结果准确性

## 💡 提示

### 开发调试
1. 打开浏览器开发者工具（F12）
2. 查看 Network 标签页
3. 可以看到每个 API 请求的详细信息

### 手动测试
如果想单独测试某个端点，可以直接在浏览器中访问对应的 URL：
```
http://localhost:8089/cf/fastapi/hello/测试
http://localhost:8089/cf/flask/query?name=test&age=25
```

### 性能观察
- 响应时间通常在 **10-50ms** 之间
- 流式响应会立即返回，然后持续发送数据
- 异步操作可能需要更长时间

## 📱 响应式设计

测试页面支持不同屏幕尺寸：
- **大屏**：每行显示 3 个测试卡片
- **中屏**：每行显示 2 个测试卡片
- **小屏**：每行显示 1 个测试卡片

## 🎯 总结

现在你可以：
1. ✅ **可视化测试**：无需命令行，直接在浏览器中测试
2. ✅ **自动化执行**：一键运行所有测试用例
3. ✅ **实时反馈**：即时看到测试结果和性能数据
4. ✅ **全面覆盖**：64 个测试用例覆盖所有功能

享受测试吧！🚀
