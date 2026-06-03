"""Test: async calls inside BaseHTTPRequestHandler cloud function."""
from http.server import BaseHTTPRequestHandler
import json
import asyncio


async def fake_db_query(name):
    """Simulate an async I/O operation."""
    await asyncio.sleep(0.1)
    return {"user": name, "status": "active"}


async def _concurrent_queries(*names):
    """Wrap gather in a coroutine for asyncio.run() compatibility."""
    return await asyncio.gather(*[fake_db_query(n) for n in names])


class handler(BaseHTTPRequestHandler):

    def do_GET(self):
        results = asyncio.run(_concurrent_queries("world", "system"))

        data = {
            "message": "Hello from async call in BaseHTTPRequestHandler",
            "user_query": results[0],
            "system_query": results[1],
            "async_works": True,
        }
        self._respond(200, data)

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = json.loads(self.rfile.read(content_length)) if content_length else {}
        name = body.get("name", "world")

        results = asyncio.run(_concurrent_queries(name, "system"))

        data = {
            "message": f"Hello {name} from async call in BaseHTTPRequestHandler",
            "user_query": results[0],
            "system_query": results[1],
            "async_works": True,
        }
        self._respond(200, data)

    def _respond(self, status, data):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode())
