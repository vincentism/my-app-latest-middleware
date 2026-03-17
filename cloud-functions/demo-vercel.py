"""
Python 函数 Demo - Vercel 风格 (BaseHTTPRequestHandler)
使用 http.server.BaseHTTPRequestHandler 处理请求
"""
import json
import time
import datetime
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs


class handler(BaseHTTPRequestHandler):

    # ============ HTTP 方法入口 ============

    def do_GET(self):
        """处理所有 GET 请求"""
        path, query = self._parse_path()

        # 路由分发
        if path == '/' or path == '':
            self._handle_root()
        elif path == '/health':
            self._handle_health()
        elif path == '/info':
            self._handle_info()
        elif path == '/echo':
            self._handle_echo(query)
        elif path == '/time':
            self._handle_time()
        elif path == '/headers':
            self._handle_headers()
        elif path == '/search':
            self._handle_search(query)
        elif path == '/error':
            self._handle_error()
        elif path.startswith('/users/'):
            user_id = path.split('/users/')[1].split('/')[0]
            self._handle_get_user(user_id)
        else:
            self._send_json(404, {"error": "Not Found", "path": path, "method": "GET"})

    def do_POST(self):
        """处理所有 POST 请求"""
        path, query = self._parse_path()
        body = self._read_body()

        if path == '/echo':
            self._handle_echo_post(query, body)
        elif path == '/json':
            self._handle_json_body(body)
        elif path == '/users':
            self._handle_create_user(body)
        else:
            self._send_json(404, {"error": "Not Found", "path": path, "method": "POST"})

    # ============ 工具方法 ============

    def _parse_path(self):
        """解析请求路径和查询参数"""
        parsed = urlparse(self.path)
        path = parsed.path

        # 去掉函数前缀路径，例如 /cf/demo-vercel/health -> /health
        base_prefix = '/demo-vercel'
        if path.startswith(base_prefix):
            path = path[len(base_prefix):] or '/'

        query = {}
        for key, values in parse_qs(parsed.query).items():
            query[key] = values[0] if len(values) == 1 else values

        return path, query

    def _read_body(self):
        """读取请求体"""
        content_length = int(self.headers.get('Content-Length', 0))
        if content_length > 0:
            return self.rfile.read(content_length).decode('utf-8')
        return ''

    def _send_json(self, status_code, data, extra_headers=None):
        """发送 JSON 响应"""
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('X-Powered-By', 'Vercel Python Function')
        if extra_headers:
            for key, value in extra_headers.items():
                self.send_header(key, value)
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))

    def _send_html(self, status_code, html_content):
        """发送 HTML 响应"""
        self.send_response(status_code)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.end_headers()
        self.wfile.write(html_content.encode('utf-8'))

    def _get_headers_dict(self):
        """将请求头转换为字典"""
        return {key.lower(): value for key, value in self.headers.items()}

    # ============ 路由处理函数 ============

    def _handle_root(self):
        """根路径 - 返回测试页面"""
        from test_page_template import generate_test_page

        tests = [
            {"id": 1, "name": "基础信息", "method": "GET", "path": "./info", "desc": "获取函数基本信息", "check": "Vercel Python"},
            {"id": 2, "name": "健康检查", "method": "GET", "path": "./health", "desc": "服务健康状态", "check": "healthy"},
            {"id": 3, "name": "获取用户", "method": "GET", "path": "./users/1", "desc": "GET 用户信息", "check": "user_id"},
            {"id": 4, "name": "创建用户", "method": "POST", "path": "./users", "desc": "POST 创建用户", "body": {"username": "测试", "email": "test@example.com"}, "check": "created"},
            {"id": 5, "name": "搜索功能", "method": "GET", "path": "./search?q=test&limit=5", "desc": "查询参数搜索", "check": "query"},
            {"id": 6, "name": "GET 回显", "method": "GET", "path": "./echo?msg=hello", "desc": "回显请求信息", "check": "method"},
            {"id": 7, "name": "POST 回显", "method": "POST", "path": "./echo", "desc": "回显 POST 请求", "body": {"data": "test"}, "check": "method"},
            {"id": 8, "name": "请求头", "method": "GET", "path": "./headers", "desc": "查看请求头信息", "check": "user_agent"},
            {"id": 9, "name": "当前时间", "method": "GET", "path": "./time", "desc": "获取服务端时间", "check": "timestamp"},
            {"id": 10, "name": "JSON 处理", "method": "POST", "path": "./json", "desc": "处理 JSON 请求体", "body": {"name": "test", "value": 42}, "check": "received"},
            {"id": 11, "name": "错误处理", "method": "GET", "path": "./error", "desc": "触发错误", "expectError": True},
        ]

        html_content = generate_test_page("Vercel Python 函数", "#000000, #333333", tests)
        self._send_html(200, html_content)

    def _handle_health(self):
        """健康检查"""
        self._send_json(200, {
            "status": "healthy",
            "timestamp": time.time(),
            "type": "vercel_function"
        })

    def _handle_info(self):
        """基本信息"""
        self._send_json(200, {
            "name": "Vercel Python Function Demo",
            "framework": "BaseHTTPRequestHandler (Vercel Style)",
            "description": "使用 Vercel 风格的 BaseHTTPRequestHandler 处理请求",
            "features": [
                "Vercel 标准格式",
                "BaseHTTPRequestHandler 类",
                "do_GET / do_POST 方法分发",
                "内置路径解析和查询参数处理",
            ]
        })

    def _handle_echo(self, query):
        """GET 回显请求信息"""
        headers = self._get_headers_dict()
        self._send_json(200, {
            "method": "GET",
            "query": query,
            "headers_count": len(headers),
            "body": None,
            "timestamp": time.time()
        })

    def _handle_echo_post(self, query, body):
        """POST 回显请求信息"""
        headers = self._get_headers_dict()
        self._send_json(200, {
            "method": "POST",
            "query": query,
            "headers_count": len(headers),
            "body": body[:500] if body else None,
            "timestamp": time.time()
        })

    def _handle_time(self):
        """返回当前时间"""
        now = datetime.datetime.now()
        self._send_json(200, {
            "timestamp": time.time(),
            "iso": now.isoformat(),
            "formatted": now.strftime("%Y-%m-%d %H:%M:%S"),
        })

    def _handle_headers(self):
        """返回请求头信息"""
        headers = self._get_headers_dict()
        self._send_json(200, {
            "user_agent": headers.get('user-agent', 'unknown'),
            "content_type": headers.get('content-type', 'none'),
            "accept": headers.get('accept', 'none'),
            "host": headers.get('host', 'unknown'),
            "all_headers": headers
        })

    def _handle_json_body(self, body):
        """处理 JSON 请求体"""
        try:
            data = json.loads(body) if body else {}
        except json.JSONDecodeError:
            self._send_json(400, {"error": "Invalid JSON body"})
            return

        self._send_json(200, {
            "message": "JSON received and parsed",
            "received": data,
            "keys": list(data.keys()),
            "size": len(body)
        })

    def _handle_search(self, query):
        """搜索功能"""
        q = query.get('q', '')
        limit = int(query.get('limit', '10'))
        offset = int(query.get('offset', '0'))

        if not q:
            self._send_json(400, {"error": "Query parameter 'q' is required"})
            return

        results = [
            {"id": i, "name": f"Result {i}", "score": round(0.95 - i * 0.08, 2)}
            for i in range(offset, offset + min(limit, 10))
        ]

        self._send_json(200, {
            "query": q,
            "limit": limit,
            "offset": offset,
            "count": len(results),
            "results": results
        })

    def _handle_get_user(self, user_id):
        """获取用户"""
        try:
            uid = int(user_id)
        except ValueError:
            self._send_json(400, {"error": "Invalid user ID"})
            return

        self._send_json(200, {
            "user_id": uid,
            "username": f"user_{uid}",
            "email": f"user{uid}@example.com",
            "source": "vercel_function"
        })

    def _handle_create_user(self, body):
        """创建用户"""
        try:
            data = json.loads(body) if body else {}
        except json.JSONDecodeError:
            self._send_json(400, {"error": "Invalid JSON body"})
            return

        if 'username' not in data:
            self._send_json(400, {"error": "Username is required"})
            return

        self._send_json(201, {
            "message": "User created",
            "user": {
                "id": 12345,
                "username": data['username'],
                "email": data.get('email', ''),
            }
        })

    def _handle_error(self):
        """触发错误测试"""
        self._send_json(500, {
            "error": "Internal Server Error",
            "message": "This is an intentional error for testing",
            "type": "TestError"
        })
