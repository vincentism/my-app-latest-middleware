#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
EdgeOne Python Function Runtime Adapter
自动生成的入口文件，支持 handler/WSGI/ASGI 三种应用类型
"""

import sys
import os
import json
import inspect
import importlib.util

# 添加当前目录到 Python 路径
sys.path.insert(0, os.path.dirname(__file__))

# 读取路由配置
_meta_path = os.path.join(os.path.dirname(__file__), 'meta.json')
with open(_meta_path, 'r', encoding='utf-8') as f:
    _meta = json.load(f)

# 模块缓存
_module_cache = {}

def load_module(module_path, module_name):
    """动态导入用户模块"""
    if module_name in _module_cache:
        return _module_cache[module_name]
    
    spec = importlib.util.spec_from_file_location(module_name, module_path)
    module = importlib.util.module_from_spec(spec)
    sys.modules[module_name] = module
    spec.loader.exec_module(module)
    _module_cache[module_name] = module
    return module

def get_handler_for_path(request_path):
    """根据请求路径获取对应的处理函数"""
    # 精确匹配优先
    for route in _meta['routes']:
        if request_path == route['path']:
            return _load_handler_from_route(route)
    
    # 前缀匹配
    for route in sorted(_meta['routes'], key=lambda r: len(r['path']), reverse=True):
        if request_path.startswith(route['path'] + '/') or request_path == route['path']:
            return _load_handler_from_route(route)
    
    return (None, None, None)

def _load_handler_from_route(route):
    """从路由配置加载处理函数"""
    module_path = os.path.join(os.path.dirname(__file__), route['file'])
    module_name = route['file'].replace('/', '_').replace('.py', '')
    
    try:
        module = load_module(module_path, module_name)
    except Exception as e:
        print(f"Error loading module {module_path}: {e}")
        return (None, None, None)
    
    # 检测应用类型
    variables = dir(module)
    
    # 1. 检查 handler/Handler 函数
    if 'handler' in variables:
        return ('handler', getattr(module, 'handler'), route)
    if 'Handler' in variables:
        return ('handler', getattr(module, 'Handler'), route)
    
    # 2. 检查 app 变量
    if 'app' in variables:
        app_obj = getattr(module, 'app')
        
        # 检查是否是 ASGI 应用
        if _is_asgi_app(app_obj):
            return ('asgi', app_obj, route)
        
        # 否则认为是 WSGI 应用
        return ('wsgi', app_obj, route)
    
    # 3. 检查 application 变量（Django 风格）
    if 'application' in variables:
        app_obj = getattr(module, 'application')
        if _is_asgi_app(app_obj):
            return ('asgi', app_obj, route)
        return ('wsgi', app_obj, route)
    
    return (None, None, None)

def _is_asgi_app(app):
    """检测是否是 ASGI 应用"""
    # 检查是否是协程函数
    if inspect.iscoroutinefunction(app):
        return True
    
    # 检查是否有 __call__ 方法且是协程
    if hasattr(app, '__call__'):
        call_method = getattr(app, '__call__', None)
        if call_method and inspect.iscoroutinefunction(call_method):
            return True
    
    # 检查常见 ASGI 框架的类型
    app_class_name = type(app).__name__
    asgi_frameworks = ['FastAPI', 'Starlette', 'Quart', 'Sanic']
    if app_class_name in asgi_frameworks:
        return True
    
    # 检查模块名
    app_module = type(app).__module__
    asgi_modules = ['fastapi', 'starlette', 'quart', 'sanic']
    for mod in asgi_modules:
        if app_module.startswith(mod):
            return True
    
    return False


# ============================================================
# Flask 应用包装器（用于服务端启动）
# ============================================================

from flask import Flask, request, Response

app = Flask(__name__)

@app.route('/', defaults={'path': ''}, methods=['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'])
@app.route('/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'])
def catch_all(path):
    """捕获所有请求并分发到对应的处理函数"""
    request_path = '/' + path if path else '/'
    app_type, handler, route = get_handler_for_path(request_path)
    
    if app_type == 'handler':
        return _handle_handler_request(handler, request)
    
    elif app_type == 'wsgi':
        return _handle_wsgi_request(handler, request)
    
    elif app_type == 'asgi':
        return _handle_asgi_request(handler, request)
    
    return Response('Not Found', status=404, content_type='text/plain')

def _handle_handler_request(handler, req):
    """处理 handler 函数请求"""
    try:
        # 检查是否是 BaseHTTPRequestHandler 子类
        from http.server import BaseHTTPRequestHandler
        if inspect.isclass(handler) and issubclass(handler, BaseHTTPRequestHandler):
            return _handle_base_http_handler(handler, req)
        
        # 普通函数调用
        result = handler(req)
        
        if isinstance(result, dict):
            body = result.get('body', '')
            status_code = result.get('statusCode', 200)
            headers = result.get('headers', {})
            
            # 处理 body
            if isinstance(body, dict):
                import json
                body = json.dumps(body, ensure_ascii=False)
                if 'Content-Type' not in headers:
                    headers['Content-Type'] = 'application/json; charset=utf-8'
            
            return Response(body, status=status_code, headers=headers)
        
        elif isinstance(result, Response):
            return result
        
        elif isinstance(result, str):
            return Response(result, status=200, content_type='text/plain; charset=utf-8')
        
        elif isinstance(result, bytes):
            return Response(result, status=200, content_type='application/octet-stream')
        
        elif result is None:
            return Response('', status=204)  # No Content
        
        else:
            import json
            return Response(json.dumps(result, ensure_ascii=False), status=200, content_type='application/json; charset=utf-8')
    
    except Exception as e:
        import traceback
        error_msg = f"Handler error: {str(e)}\n{traceback.format_exc()}"
        print(error_msg, file=sys.stderr)
        return Response(error_msg, status=500, content_type='text/plain')

def _handle_base_http_handler(handler_class, req):
    """处理 BaseHTTPRequestHandler 子类"""
    try:
        import io
        from http.server import BaseHTTPRequestHandler
        
        # 构建请求数据
        request_line = f"{req.method} {req.path}"
        if req.query_string:
            request_line += f"?{req.query_string.decode('utf-8')}"
        request_line += " HTTP/1.1\r\n"
        
        # 构建请求头
        headers_str = ""
        for key, value in req.headers:
            headers_str += f"{key}: {value}\r\n"
        headers_str += "\r\n"
        
        # 构建完整请求
        request_text = request_line + headers_str
        request_body = req.get_data()
        
        # 创建输入输出流
        request_input = io.BytesIO(request_text.encode() + request_body)
        wfile = io.BytesIO()
        
        # 创建模拟的 socket 和 server
        class MockSocket:
            def __init__(self):
                self._wfile = wfile
            
            def makefile(self, mode, buffering=-1):
                if 'r' in mode or 'b' in mode:
                    return request_input
                return self._wfile
            
            def sendall(self, data):
                """模拟 socket.sendall()"""
                self._wfile.write(data)
            
            def close(self):
                """模拟 socket.close()"""
                pass
        
        class MockServer:
            def __init__(self):
                self.server_name = req.host.split(':')[0] if req.host else 'localhost'
                self.server_port = int(req.host.split(':')[1]) if ':' in (req.host or '') else 80
        
        # 实例化处理器
        mock_socket = MockSocket()
        mock_server = MockServer()
        
        # 实例化 handler（BaseHTTPRequestHandler 会自动调用 handle()）
        handler_instance = handler_class(mock_socket, (req.remote_addr or '127.0.0.1', 0), mock_server)
        
        # 获取响应数据
        wfile.seek(0)
        response_data = wfile.read()
        
        # 解析 HTTP 响应
        if not response_data:
            return Response('', status=200)
        
        response_text = response_data.decode('utf-8', errors='ignore')
        lines = response_text.split('\r\n')
        
        # 解析状态行
        status_line = lines[0] if lines else 'HTTP/1.1 200 OK'
        status_code = 200
        if ' ' in status_line:
            parts = status_line.split(' ', 2)
            if len(parts) >= 2:
                try:
                    status_code = int(parts[1])
                except ValueError:
                    pass
        
        # 解析响应头
        response_headers = {}
        body_start = 0
        for i, line in enumerate(lines[1:], 1):
            if not line:
                body_start = i + 1
                break
            if ':' in line:
                key, value = line.split(':', 1)
                response_headers[key.strip()] = value.strip()
        
        # 提取响应体
        response_body = '\r\n'.join(lines[body_start:]) if body_start > 0 else ''
        
        return Response(response_body, status=status_code, headers=response_headers)
    
    except Exception as e:
        import traceback
        error_msg = f"BaseHTTPRequestHandler error: {str(e)}\n{traceback.format_exc()}"
        print(error_msg, file=sys.stderr)
        return Response(error_msg, status=500, content_type='text/plain')

def _handle_wsgi_request(wsgi_app, req):
    """处理 WSGI 应用请求"""
    try:
        from werkzeug.wrappers import Response as WerkzeugResponse
        environ = req.environ.copy()
        response = WerkzeugResponse.from_app(wsgi_app, environ)
        return Response(
            response.get_data(),
            status=response.status_code,
            headers=dict(response.headers)
        )
    except Exception as e:
        import traceback
        error_msg = f"WSGI error: {str(e)}\n{traceback.format_exc()}"
        print(error_msg, file=sys.stderr)
        return Response(error_msg, status=500, content_type='text/plain')

def _handle_asgi_request(asgi_app, req):
    """处理 ASGI 应用请求"""
    try:
        import asyncio
        
        # 构建 ASGI scope
        scope = {
            'type': 'http',
            'asgi': {'version': '3.0'},
            'http_version': '1.1',
            'method': req.method,
            'scheme': req.scheme,
            'path': req.path,
            'query_string': req.query_string,
            'root_path': '',
            'headers': [(k.lower().encode(), v.encode()) for k, v in req.headers],
            'server': (req.host.split(':')[0], int(req.host.split(':')[1]) if ':' in req.host else 80),
        }
        
        # 请求体
        body = req.get_data()
        body_sent = False
        
        async def receive():
            nonlocal body_sent
            if not body_sent:
                body_sent = True
                return {'type': 'http.request', 'body': body, 'more_body': False}
            return {'type': 'http.request', 'body': b'', 'more_body': False}
        
        # 响应收集
        response_started = False
        response_status = 200
        response_headers = []
        response_body = []
        
        async def send(message):
            nonlocal response_started, response_status, response_headers, response_body
            
            if message['type'] == 'http.response.start':
                response_started = True
                response_status = message.get('status', 200)
                response_headers = [
                    (k.decode() if isinstance(k, bytes) else k, 
                     v.decode() if isinstance(v, bytes) else v)
                    for k, v in message.get('headers', [])
                ]
            elif message['type'] == 'http.response.body':
                body_part = message.get('body', b'')
                if body_part:
                    response_body.append(body_part)
        
        # 运行 ASGI 应用（复用事件循环，提升性能）
        try:
            loop = asyncio.get_event_loop()
            if loop.is_closed():
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
        except RuntimeError:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
        
        # 使用 run_until_complete 执行 ASGI 应用
        loop.run_until_complete(asgi_app(scope, receive, send))
        
        return Response(
            b''.join(response_body),
            status=response_status,
            headers=dict(response_headers)
        )
    
    except Exception as e:
        import traceback
        error_msg = f"ASGI error: {str(e)}\n{traceback.format_exc()}"
        print(error_msg, file=sys.stderr)
        return Response(error_msg, status=500, content_type='text/plain')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9010, debug=False)
