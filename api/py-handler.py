from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qs
import json

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # 解析查询参数
        query_string = self.path.split('?')[1] if '?' in self.path else ''
        params = parse_qs(query_string)
        
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        
        response = {
            'message': 'Hello from Vercel Python!',
            'path': self.path,
            'params': {k: v[0] for k, v in params.items()}
        }
        
        self.wfile.write(json.dumps(response).encode())
    
    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length).decode()
        
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        
        try:
            data = json.loads(body) if body else {}
        except:
            data = {'raw': body}
        
        response = {
            'message': 'POST received',
            'data': data
        }
        
        self.wfile.write(json.dumps(response).encode())
