# normal demo

# from http.server import BaseHTTPRequestHandler
 
# class handler(BaseHTTPRequestHandler):
 
#     def do_GET(self):
#         self.send_response(200)
#         self.send_header('Content-type','text/plain')
#         self.end_headers()
#         self.wfile.write('Hello, world!'.encode('utf-8'))
#         return



# fastapi demo
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}


# flask demo


# from flask import Flask

# app = Flask(__name__)

# @app.route("/")
# def hello_world():
#     return "<p>Hello, World111!</p>"


# django demo

# from django.conf import settings
# from django.http import HttpResponse, JsonResponse
# from django.urls import path
# from django.core.wsgi import get_wsgi_application
# import os

# # Django 最小配置
# if not settings.configured:
#     settings.configure(
#         DEBUG=True,
#         SECRET_KEY='django-insecure-demo-key-for-testing-only',
#         ROOT_URLCONF=__name__,
#         ALLOWED_HOSTS=['*'],
#         MIDDLEWARE=[
#             'django.middleware.common.CommonMiddleware',
#         ],
#     )

# # 视图函数
# def index(request):
#     return HttpResponse("<h1>Hello, Django World!</h1><p>This is a Django demo.</p>")

# def api_hello(request):
#     return JsonResponse({
#         "message": "Hello from Django API",
#         "status": "success",
#         "framework": "Django"
#     })

# def user_detail(request, user_id):
#     return JsonResponse({
#         "user_id": user_id,
#         "name": f"User {user_id}",
#         "framework": "Django"
#     })

# # URL 路由配置
# urlpatterns = [
#     path('', index),
#     path('api/hello111/', api_hello),
#     path('api/users/<int:user_id>/', user_detail),
# ]

# # WSGI 应用
# os.environ.setdefault('DJANGO_SETTINGS_MODULE', __name__)
# app = get_wsgi_application()



# sanic demo
# from sanic import Sanic
# from sanic.response import json
# app = Sanic("myapp")  # Sanic 21.x+ 需要 name 参数
 
 

# @app.route('/<path:path>')
# async def index(request, path=""):
#     return json({'hello': path})