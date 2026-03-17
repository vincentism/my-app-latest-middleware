# from http.server import BaseHTTPRequestHandler
 
# class handler(BaseHTTPRequestHandler):
 
#     def do_GET(self):
#         self.send_response(200)
#         self.send_header('Content-type','text/plain')
#         self.end_headers()
#         self.wfile.write('Hello, world! 1221'.encode('utf-8'))
#         return




from fastapi import FastAPI
from typing import Any 

app: Any = FastAPI()

@app.get("/api/{id}")
async def get_index(id: str):
    return {"message": f"Hello! The index param is: {id}", "index": id}
