# Django demo for Vercel
from django.conf import settings
from django.http import HttpResponse, JsonResponse
from django.urls import path
from django.core.wsgi import get_wsgi_application
import os

# Django 最小配置
if not settings.configured:
    settings.configure(
        DEBUG=True,
        SECRET_KEY='django-insecure-demo-key-for-testing-only',
        ROOT_URLCONF=__name__,
        ALLOWED_HOSTS=['*'],
        MIDDLEWARE=[
            'django.middleware.common.CommonMiddleware',
        ],
    )

# 视图函数
def index(request):
    return JsonResponse({
        "message": "Hello from Django on Vercel!",
        "path": "/api/django-demo",
        "framework": "Django"
    })

def hello(request):
    return JsonResponse({
        "message": "Hello from Django API",
        "status": "success",
        "framework": "Django"
    })

# URL 路由配置
urlpatterns = [
    path('', index),
    path('hello/', hello),
]

# WSGI 应用
os.environ.setdefault('DJANGO_SETTINGS_MODULE', __name__)
app = get_wsgi_application()
