#!/usr/bin/env python3
"""
自动化测试脚本
测试所有 Python 框架的云函数功能
"""
import requests
import sys
import time
from typing import Dict, List, Tuple

BASE_URL = "http://localhost:8088"

# ANSI 颜色代码
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'


class TestRunner:
    def __init__(self, base_url: str):
        self.base_url = base_url
        self.passed = 0
        self.failed = 0
        self.results: List[Tuple[str, bool, str]] = []
    
    def test(self, name: str, method: str, path: str, **kwargs) -> bool:
        """执行单个测试"""
        url = f"{self.base_url}{path}"
        try:
            start = time.time()
            response = requests.request(method, url, timeout=10, **kwargs)
            duration = time.time() - start
            
            success = 200 <= response.status_code < 300
            status_msg = f"{response.status_code} ({duration:.2f}s)"
            
            if success:
                self.passed += 1
                print(f"{GREEN}✓{RESET} {name}: {status_msg}")
            else:
                self.failed += 1
                print(f"{RED}✗{RESET} {name}: {status_msg}")
                print(f"  Response: {response.text[:100]}")
            
            self.results.append((name, success, status_msg))
            return success
            
        except Exception as e:
            self.failed += 1
            error_msg = str(e)[:100]
            print(f"{RED}✗{RESET} {name}: {error_msg}")
            self.results.append((name, False, error_msg))
            return False
    
    def print_summary(self):
        """打印测试总结"""
        total = self.passed + self.failed
        pass_rate = (self.passed / total * 100) if total > 0 else 0
        
        print(f"\n{'=' * 60}")
        print(f"测试总结")
        print(f"{'=' * 60}")
        print(f"总计: {total} | {GREEN}通过: {self.passed}{RESET} | {RED}失败: {self.failed}{RESET}")
        print(f"通过率: {pass_rate:.1f}%")
        print(f"{'=' * 60}\n")


def test_fastapi(runner: TestRunner):
    """测试 FastAPI"""
    print(f"\n{BLUE}{'=' * 60}{RESET}")
    print(f"{BLUE}测试 FastAPI{RESET}")
    print(f"{BLUE}{'=' * 60}{RESET}\n")
    
    # 基础路由
    runner.test("FastAPI - 根路径", "GET", "/demo-fastapi")
    runner.test("FastAPI - 健康检查", "GET", "/demo-fastapi/health")
    
    # 路径参数
    runner.test("FastAPI - 获取用户", "GET", "/demo-fastapi/users/123")
    runner.test("FastAPI - 用户（不含邮箱）", "GET", "/demo-fastapi/users/123?include_email=false")
    
    # 查询参数
    runner.test("FastAPI - 搜索", "GET", "/demo-fastapi/search?q=test&skip=0&limit=5")
    
    # POST 请求
    runner.test(
        "FastAPI - 创建项目", "POST", "/demo-fastapi/items",
        json={"name": "Test Item", "price": 99.99, "tags": ["test"]}
    )
    
    # 流式响应
    runner.test("FastAPI - SSE 流", "GET", "/demo-fastapi/stream")
    runner.test("FastAPI - JSON 流", "GET", "/demo-fastapi/stream/json")
    
    # 异步操作
    runner.test("FastAPI - 异步延迟", "GET", "/demo-fastapi/async/delay/1")
    runner.test("FastAPI - 并发操作", "GET", "/demo-fastapi/async/parallel")
    
    # 请求头
    runner.test("FastAPI - 回显请求头", "GET", "/demo-fastapi/headers/echo")
    
    # 性能测试
    runner.test("FastAPI - 性能测试", "GET", "/demo-fastapi/performance/compute/10000")


def test_flask(runner: TestRunner):
    """测试 Flask"""
    print(f"\n{BLUE}{'=' * 60}{RESET}")
    print(f"{BLUE}测试 Flask{RESET}")
    print(f"{BLUE}{'=' * 60}{RESET}\n")
    
    # 基础路由
    runner.test("Flask - 根路径", "GET", "/demo-flask")
    runner.test("Flask - 健康检查", "GET", "/demo-flask/health")
    
    # RESTful API
    runner.test("Flask - 获取用户", "GET", "/demo-flask/users/123")
    runner.test(
        "Flask - 创建用户", "POST", "/demo-flask/users",
        json={"username": "test_user", "email": "test@example.com"}
    )
    
    # 查询参数
    runner.test("Flask - 搜索", "GET", "/demo-flask/search?q=test&limit=5")
    
    # 流式响应
    runner.test("Flask - SSE 流", "GET", "/demo-flask/stream")
    runner.test("Flask - JSON 流", "GET", "/demo-flask/stream/json")
    
    # Cookie
    runner.test("Flask - 设置 Cookie", "GET", "/demo-flask/cookie/set")
    runner.test("Flask - 获取 Cookie", "GET", "/demo-flask/cookie/get")
    
    # 请求头
    runner.test("Flask - 回显请求头", "GET", "/demo-flask/headers/echo")
    runner.test("Flask - 自定义响应头", "GET", "/demo-flask/headers/custom")
    
    # 性能测试
    runner.test("Flask - 性能测试", "GET", "/demo-flask/performance/compute/10000")


def test_django(runner: TestRunner):
    """测试 Django"""
    print(f"\n{BLUE}{'=' * 60}{RESET}")
    print(f"{BLUE}测试 Django{RESET}")
    print(f"{BLUE}{'=' * 60}{RESET}\n")
    
    # 基础路由
    runner.test("Django - 根路径", "GET", "/demo-django")
    runner.test("Django - 健康检查", "GET", "/demo-django/health")
    
    # RESTful API
    runner.test("Django - 获取用户", "GET", "/demo-django/users/123/")
    runner.test(
        "Django - 创建用户", "POST", "/demo-django/users/create/",
        json={"username": "django_user", "email": "django@example.com"}
    )
    
    # 查询参数
    runner.test("Django - 搜索", "GET", "/demo-django/search/?q=test&limit=5")
    
    # 流式响应
    runner.test("Django - SSE 流", "GET", "/demo-django/stream/")
    runner.test("Django - JSON 流", "GET", "/demo-django/stream/json/")
    
    # Cookie
    runner.test("Django - 设置 Cookie", "GET", "/demo-django/cookie/set/")
    runner.test("Django - 获取 Cookie", "GET", "/demo-django/cookie/get/")
    
    # 请求头
    runner.test("Django - 回显请求头", "GET", "/demo-django/headers/echo/")
    
    # 性能测试
    runner.test("Django - 性能测试", "GET", "/demo-django/performance/compute/10000/")


def test_sanic(runner: TestRunner):
    """测试 Sanic"""
    print(f"\n{BLUE}{'=' * 60}{RESET}")
    print(f"{BLUE}测试 Sanic{RESET}")
    print(f"{BLUE}{'=' * 60}{RESET}\n")
    
    # 基础路由
    runner.test("Sanic - 根路径", "GET", "/demo-sanic")
    runner.test("Sanic - 健康检查", "GET", "/demo-sanic/health")
    
    # RESTful API
    runner.test("Sanic - 获取用户", "GET", "/demo-sanic/users/123")
    runner.test(
        "Sanic - 创建用户", "POST", "/demo-sanic/users",
        json={"username": "sanic_user", "email": "sanic@example.com"}
    )
    
    # 查询参数
    runner.test("Sanic - 搜索", "GET", "/demo-sanic/search?q=test&limit=5")
    
    # 异步操作
    runner.test("Sanic - 异步延迟", "GET", "/demo-sanic/async/delay/1")
    runner.test("Sanic - 并发操作", "GET", "/demo-sanic/async/parallel")
    runner.test("Sanic - 异步数据库", "GET", "/demo-sanic/async/database")
    
    # 流式响应
    runner.test("Sanic - SSE 流", "GET", "/demo-sanic/stream")
    runner.test("Sanic - JSON 流", "GET", "/demo-sanic/stream/json")
    
    # Cookie
    runner.test("Sanic - 设置 Cookie", "GET", "/demo-sanic/cookie/set")
    runner.test("Sanic - 获取 Cookie", "GET", "/demo-sanic/cookie/get")
    
    # 性能测试
    runner.test("Sanic - 性能测试", "GET", "/demo-sanic/performance/compute/10000")


def main():
    """主函数"""
    print(f"\n{YELLOW}{'=' * 60}{RESET}")
    print(f"{YELLOW}Python Cloud Functions 自动化测试{RESET}")
    print(f"{YELLOW}{'=' * 60}{RESET}\n")
    print(f"测试服务器: {BASE_URL}\n")
    
    # 检查服务器是否运行
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        if response.status_code != 200:
            print(f"{RED}错误: 服务器未就绪{RESET}")
            sys.exit(1)
    except Exception as e:
        print(f"{RED}错误: 无法连接到服务器{RESET}")
        print(f"请确保运行: edgeone pages dev")
        sys.exit(1)
    
    # 创建测试运行器
    runner = TestRunner(BASE_URL)
    
    # 运行所有测试
    test_fastapi(runner)
    test_flask(runner)
    test_django(runner)
    test_sanic(runner)
    
    # 打印总结
    runner.print_summary()
    
    # 根据测试结果设置退出码
    sys.exit(0 if runner.failed == 0 else 1)


if __name__ == "__main__":
    main()
