#!/usr/bin/env python3
"""
Sanic 独立测试启动脚本

由于 Sanic 是异步框架，不能和其他同步框架（FastAPI、Flask、Django）在同一进程中运行。
使用此脚本可以独立启动 Sanic 服务进行测试。

使用方法:
    python3 run_sanic.py
    
然后访问: http://localhost:8000
"""

if __name__ == '__main__':
    import importlib.util
    import sys
    from pathlib import Path
    
    # 动态导入带连字符的模块
    module_path = Path(__file__).parent / 'demo-sanic.py'
    spec = importlib.util.spec_from_file_location("demo_sanic", module_path)
    demo_sanic = importlib.util.module_from_spec(spec)
    sys.modules["demo_sanic"] = demo_sanic
    spec.loader.exec_module(demo_sanic)
    
    app = demo_sanic.app
    
    print("=" * 60)
    print("🚀 Sanic 测试服务器")
    print("=" * 60)
    print("访问测试页面: http://localhost:8001")
    print("按 Ctrl+C 停止服务器")
    print("=" * 60)
    
    app.run(
        host='0.0.0.0',
        port=8001,
        debug=True,
        auto_reload=True,
        access_log=True
    )
