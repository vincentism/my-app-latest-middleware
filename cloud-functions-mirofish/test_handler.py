"""
云函数本地测试脚本
用于测试改写后的 handler 函数是否正常工作
"""

import sys
import os

# 添加项目路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from index import handler


class MockRequest:
    """模拟云函数请求对象"""
    
    def __init__(self, method='GET', path='/', headers=None, body=None, query=None):
        self.method = method
        self.path = path
        self.headers = headers or {}
        self.body = body
        self.query = query or {}


def test_health_check():
    """测试健康检查接口"""
    print("\n" + "="*60)
    print("🧪 测试 1: 健康检查接口")
    print("="*60)
    
    request = MockRequest(
        method='GET',
        path='/health',
        headers={'Content-Type': 'application/json'}
    )
    
    response = handler(request)
    
    print(f"状态码: {response['statusCode']}")
    print(f"响应头: {response['headers']}")
    print(f"响应体: {response['body']}")
    
    assert response['statusCode'] == 200, "健康检查应返回 200"
    print("✅ 测试通过")


def test_api_route():
    """测试 API 路由"""
    print("\n" + "="*60)
    print("🧪 测试 2: API 路由")
    print("="*60)
    
    request = MockRequest(
        method='GET',
        path='/api/graph',
        headers={'Content-Type': 'application/json'}
    )
    
    response = handler(request)
    
    print(f"状态码: {response['statusCode']}")
    print(f"响应头: {response['headers']}")
    print(f"响应体: {response['body'][:200]}...")  # 只显示前 200 个字符
    
    print("✅ 测试完成")


def test_post_request():
    """测试 POST 请求"""
    print("\n" + "="*60)
    print("🧪 测试 3: POST 请求")
    print("="*60)
    
    import json
    
    body_data = {
        "node_id": "test_node",
        "data": {
            "name": "Test Node",
            "type": "test"
        }
    }
    
    request = MockRequest(
        method='POST',
        path='/api/graph/add_node',
        headers={
            'Content-Type': 'application/json',
            'Content-Length': str(len(json.dumps(body_data)))
        },
        body=json.dumps(body_data).encode('utf-8')
    )
    
    response = handler(request)
    
    print(f"状态码: {response['statusCode']}")
    print(f"响应头: {response['headers']}")
    print(f"响应体: {response['body'][:200]}...")
    
    print("✅ 测试完成")


def test_not_found():
    """测试 404 路由"""
    print("\n" + "="*60)
    print("🧪 测试 4: 404 Not Found")
    print("="*60)
    
    request = MockRequest(
        method='GET',
        path='/this-route-does-not-exist',
        headers={'Content-Type': 'application/json'}
    )
    
    response = handler(request)
    
    print(f"状态码: {response['statusCode']}")
    print(f"响应头: {response['headers']}")
    print(f"响应体: {response['body'][:200]}...")
    
    assert response['statusCode'] == 404, "不存在的路由应返回 404"
    print("✅ 测试通过")


def main():
    """运行所有测试"""
    print("\n" + "🚀 " * 20)
    print("开始测试云函数 Handler")
    print("🚀 " * 20)
    
    try:
        test_health_check()
        test_api_route()
        test_post_request()
        test_not_found()
        
        print("\n" + "="*60)
        print("✅ 所有测试完成！")
        print("="*60)
        print("\n💡 提示: 如果所有测试通过，说明云函数改写成功！")
        print("📦 现在可以部署到 Vercel/EdgeOne/Netlify 等平台了。")
        print("\n")
        
    except Exception as e:
        print(f"\n❌ 测试失败: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main()
