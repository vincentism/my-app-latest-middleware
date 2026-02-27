# Vercel Serverless Function format
from http.server import BaseHTTPRequestHandler
import json

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        
        response = {
            "message": "Hello from Python Serverless Function!",
            "framework": "Python BaseHTTPRequestHandler",
            "path": self.path
        }
        
        self.wfile.write(json.dumps(response).encode('utf-8'))
        return
    
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        
        response = {
            "message": "POST received",
            "data": post_data.decode('utf-8')
        }
        
        self.wfile.write(json.dumps(response).encode('utf-8'))
        return
