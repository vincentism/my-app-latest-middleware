"""
MiroFish Backend - Cloud Function Entry Point (EdgeOne Pages Compatible)
云函数入口文件 - EdgeOne Pages 标准 WSGI 模式

EdgeOne Pages 支持直接部署 Flask/Django 等 WSGI 应用
只需导出 app 或 application 对象即可
"""

import os
import sys

# 解决 Windows 控制台中文乱码问题：在所有导入之前设置 UTF-8 编码
if sys.platform == 'win32':
    os.environ.setdefault('PYTHONIOENCODING', 'utf-8')
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    if hasattr(sys.stderr, 'reconfigure'):
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')

# 添加项目根目录到路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from app.config import Config

# 验证配置
errors = Config.validate()
if errors:
    print("⚠️  配置警告:", file=sys.stderr)
    for err in errors:
        print(f"  - {err}", file=sys.stderr)
    print("提示: 在云函数环境中，可通过环境变量设置配置", file=sys.stderr)

# 创建 Flask 应用实例并导出
# EdgeOne Pages 会自动识别 app 变量并使用 WSGI 模式运行
app = create_app()

# 也可以使用 application 作为变量名（WSGI 标准）
application = app


# ============= 本地开发模式支持 =============
if __name__ == '__main__':
    """本地开发模式 - 直接运行 Flask 服务器"""
    # 获取运行配置
    host = os.environ.get('FLASK_HOST', '0.0.0.0')
    port = int(os.environ.get('FLASK_PORT', 5001))
    debug = Config.DEBUG
    
    print("=" * 60)
    print("🚀 本地开发模式启动")
    print(f"📍 服务地址: http://{host}:{port}")
    print(f"🔧 调试模式: {debug}")
    print("=" * 60)
    
    # 启动服务
    app.run(host=host, port=port, debug=debug, threaded=True)


# ============= 本地开发模式支持 =============
def main():
    """本地开发模式 - 直接运行 Flask 服务器"""
    app = get_app()
    
    # 获取运行配置
    host = os.environ.get('FLASK_HOST', '0.0.0.0')
    port = int(os.environ.get('FLASK_PORT', 5001))
    debug = Config.DEBUG
    
    print("=" * 60)
    print("🚀 本地开发模式启动")
    print(f"📍 服务地址: http://{host}:{port}")
    print(f"🔧 调试模式: {debug}")
    print("=" * 60)
    
    # 启动服务
    app.run(host=host, port=port, debug=debug, threaded=True)


if __name__ == '__main__':
    main()

