#!/usr/bin/env python3
"""
Build 模式测试脚本
先执行 edgeone pages build，然后进入 .edgeone/cloud-functions/python 启动 app.py
"""
import requests
import json
import time
from typing import Dict, List

# Build 模式下默认端口是 9000
BASE_URL = "http://localhost:9000"

# 使用与 dev 模式相同的测试用例
TEST_CASES = {
    "index": {
        "name": "测试索引页",
        "tests": [
            {"method": "GET", "path": "/cf/", "expect": 200, "check": "html"},
        ]
    },
    "fastapi": {
        "name": "FastAPI 框架测试",
        "tests": [
            {"method": "GET", "path": "/cf/fastapi/", "expect": 200, "check": "FastAPI"},
            {"method": "GET", "path": "/cf/fastapi/hello/test", "expect": 200},
            {"method": "POST", "path": "/cf/fastapi/users", "expect": 200, "json": {"name": "张三", "email": "zhangsan@example.com"}},
            {"method": "GET", "path": "/cf/fastapi/users/1", "expect": 200},
            {"method": "PUT", "path": "/cf/fastapi/users/1", "expect": 200, "json": {"name": "李四", "email": "lisi@example.com"}},
            {"method": "GET", "path": "/cf/fastapi/query?q=test&limit=10", "expect": 200},
            {"method": "GET", "path": "/cf/fastapi/headers", "expect": 200},
            {"method": "GET", "path": "/cf/fastapi/cookies", "expect": 200},
            {"method": "POST", "path": "/cf/fastapi/set-cookie", "expect": 200},
            {"method": "GET", "path": "/cf/fastapi/async-task", "expect": 200},
            {"method": "GET", "path": "/cf/fastapi/stream-sse", "expect": 200, "check": "stream"},
            {"method": "GET", "path": "/cf/fastapi/stream-json", "expect": 200, "check": "stream"},
            {"method": "GET", "path": "/cf/fastapi/error", "expect": 500},
        ]
    },
    "flask": {
        "name": "Flask 框架测试",
        "tests": [
            {"method": "GET", "path": "/cf/flask/", "expect": 200, "check": "Flask"},
            {"method": "GET", "path": "/cf/flask/hello", "expect": 200},
            {"method": "GET", "path": "/cf/flask/hello/world", "expect": 200},
            {"method": "POST", "path": "/cf/flask/data", "expect": 200, "json": {"key": "value"}},
            {"method": "GET", "path": "/cf/flask/query?name=test&age=25", "expect": 200},
            {"method": "GET", "path": "/cf/flask/headers", "expect": 200},
            {"method": "GET", "path": "/cf/flask/cookies", "expect": 200},
            {"method": "POST", "path": "/cf/flask/set-cookie", "expect": 200},
            {"method": "GET", "path": "/cf/flask/session", "expect": 200},
            {"method": "GET", "path": "/cf/flask/redirect-test", "expect": 302},
            {"method": "GET", "path": "/cf/flask/json-response", "expect": 200},
            {"method": "GET", "path": "/cf/flask/stream", "expect": 200, "check": "stream"},
            {"method": "GET", "path": "/cf/flask/error", "expect": 500},
        ]
    },
    "django": {
        "name": "Django 框架测试",
        "tests": [
            {"method": "GET", "path": "/cf/django/", "expect": 200, "check": "Django"},
            {"method": "GET", "path": "/cf/django/hello", "expect": 200},
            {"method": "GET", "path": "/cf/django/hello/world", "expect": 200},
            {"method": "POST", "path": "/cf/django/api/users", "expect": 201, "json": {"name": "王五", "email": "wangwu@example.com"}},
            {"method": "GET", "path": "/cf/django/api/users", "expect": 200},
            {"method": "GET", "path": "/cf/django/api/users/1", "expect": 200},
            {"method": "PUT", "path": "/cf/django/api/users/1", "expect": 200, "json": {"name": "赵六", "email": "zhaoliu@example.com"}},
            {"method": "GET", "path": "/cf/django/query?search=test&page=1", "expect": 200},
            {"method": "GET", "path": "/cf/django/headers", "expect": 200},
            {"method": "GET", "path": "/cf/django/cookies", "expect": 200},
            {"method": "POST", "path": "/cf/django/set-cookie", "expect": 200},
            {"method": "GET", "path": "/cf/django/redirect-test", "expect": 302},
            {"method": "GET", "path": "/cf/django/stream", "expect": 200, "check": "stream"},
            {"method": "GET", "path": "/cf/django/error", "expect": 500},
        ]
    },
    "sanic": {
        "name": "Sanic 框架测试",
        "tests": [
            {"method": "GET", "path": "/cf/sanic/", "expect": 200, "check": "Sanic"},
            {"method": "GET", "path": "/cf/sanic/hello/async", "expect": 200},
            {"method": "POST", "path": "/cf/sanic/users", "expect": 201, "json": {"name": "孙七", "email": "sunqi@example.com"}},
            {"method": "GET", "path": "/cf/sanic/users/1", "expect": 200},
            {"method": "PUT", "path": "/cf/sanic/users/1", "expect": 200, "json": {"name": "周八", "email": "zhouba@example.com"}},
            {"method": "GET", "path": "/cf/sanic/query?q=test&limit=20", "expect": 200},
            {"method": "GET", "path": "/cf/sanic/headers", "expect": 200},
            {"method": "GET", "path": "/cf/sanic/cookies", "expect": 200},
            {"method": "POST", "path": "/cf/sanic/set-cookie", "expect": 200},
            {"method": "GET", "path": "/cf/sanic/async-operation", "expect": 200},
            {"method": "GET", "path": "/cf/sanic/stream-sse", "expect": 200, "check": "stream"},
            {"method": "GET", "path": "/cf/sanic/stream-json", "expect": 200, "check": "stream"},
            {"method": "GET", "path": "/cf/sanic/error", "expect": 500},
        ]
    }
}


def test_endpoint(method: str, path: str, expect: int, check: str = None, json_data: dict = None) -> Dict:
    """测试单个端点"""
    url = f"{BASE_URL}{path}"
    result = {
        "method": method,
        "path": path,
        "expected": expect,
        "success": False,
        "actual_status": None,
        "error": None,
        "response_time": 0
    }
    
    try:
        start_time = time.time()
        
        if method == "GET":
            response = requests.get(url, timeout=10, stream=(check == "stream"))
        elif method == "POST":
            response = requests.post(url, json=json_data, timeout=10)
        elif method == "PUT":
            response = requests.put(url, json=json_data, timeout=10)
        elif method == "DELETE":
            response = requests.delete(url, timeout=10)
        else:
            result["error"] = f"Unsupported method: {method}"
            return result
        
        result["response_time"] = round((time.time() - start_time) * 1000, 2)
        result["actual_status"] = response.status_code
        
        # 检查状态码
        if response.status_code == expect:
            result["success"] = True
            
            # 额外检查
            if check == "html":
                result["success"] = "<!DOCTYPE html>" in response.text or "<html" in response.text
            elif check == "stream":
                result["success"] = response.headers.get("content-type", "").startswith(("text/event-stream", "application/stream+json"))
            elif check:
                result["success"] = check in response.text
                
    except requests.exceptions.Timeout:
        result["error"] = "Request timeout"
    except requests.exceptions.ConnectionError:
        result["error"] = "Connection failed"
    except Exception as e:
        result["error"] = str(e)
    
    return result


def run_tests():
    """运行所有测试"""
    print("=" * 80)
    print("Build 模式测试开始".center(80))
    print(f"测试 URL: {BASE_URL}")
    print("=" * 80)
    print()
    
    total_tests = 0
    passed_tests = 0
    failed_tests = 0
    
    results = {}
    
    for category, config in TEST_CASES.items():
        print(f"\n{'=' * 80}")
        print(f"  {config['name']}")
        print(f"{'=' * 80}")
        
        category_results = []
        
        for i, test in enumerate(config['tests'], 1):
            total_tests += 1
            result = test_endpoint(
                test['method'],
                test['path'],
                test['expect'],
                test.get('check'),
                test.get('json')
            )
            
            category_results.append(result)
            
            # 打印结果
            status_icon = "✅" if result['success'] else "❌"
            print(f"\n{i}. {status_icon} {result['method']} {result['path']}")
            print(f"   期望状态码: {result['expected']} | 实际状态码: {result['actual_status']}")
            print(f"   响应时间: {result['response_time']}ms")
            
            if result['success']:
                passed_tests += 1
            else:
                failed_tests += 1
                if result['error']:
                    print(f"   ❌ 错误: {result['error']}")
        
        results[category] = category_results
    
    # 总结
    print(f"\n\n{'=' * 80}")
    print("测试总结".center(80))
    print(f"{'=' * 80}")
    print(f"\n总测试数: {total_tests}")
    print(f"✅ 通过: {passed_tests} ({passed_tests/total_tests*100:.1f}%)")
    print(f"❌ 失败: {failed_tests} ({failed_tests/total_tests*100:.1f}%)")
    
    # 按框架统计
    print(f"\n{'框架统计':^80}")
    print("-" * 80)
    for category, config in TEST_CASES.items():
        category_results = results[category]
        category_passed = sum(1 for r in category_results if r['success'])
        category_total = len(category_results)
        print(f"{config['name']}: {category_passed}/{category_total} 通过 ({category_passed/category_total*100:.1f}%)")
    
    print("\n" + "=" * 80)
    print("测试完成!".center(80))
    print("=" * 80)
    
    return results


if __name__ == "__main__":
    print("\n⚠️  Build 模式测试")
    print("请确保:")
    print("1. 已执行: edgeone pages build")
    print("2. 已进入目录: cd .edgeone/cloud-functions/python")
    print("3. 已启动服务: python3 app.py")
    print()
    time.sleep(2)
    
    # 检查服务是否可用
    try:
        response = requests.get(BASE_URL, timeout=5)
        print(f"✅ 服务已启动 (状态码: {response.status_code})\n")
    except:
        print(f"❌ 无法连接到 {BASE_URL}")
        print("请按照上述步骤启动 build 模式服务")
        exit(1)
    
    run_tests()
