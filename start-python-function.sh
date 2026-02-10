#!/bin/bash
# 启动 EdgeOne Python Cloud Function 本地服务

set -e

cd "$(dirname "$0")/.edgeone/cloud-functions/python"

echo "🔍 检查虚拟环境..."
if [ ! -d "venv" ]; then
    echo "📦 创建虚拟环境..."
    python3 -m venv venv
fi

source venv/bin/activate
echo "✅ 虚拟环境已激活"

# 检查依赖
if ! python3 -c "import flask" 2>/dev/null; then
    echo "📥 安装依赖..."
    pip3 install -r requirements.txt
fi

# 清理 Python 缓存
echo "🧹 清理缓存..."
find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
rm -f *.pyc 2>/dev/null || true

# 停止旧进程
echo "🛑 停止旧服务..."
lsof -ti:9000 | xargs kill -9 2>/dev/null || true
sleep 1

echo ""
echo "🚀 启动 Flask 服务..."
echo "📍 访问地址: http://localhost:9000"
echo "📍 路由："
echo "   - http://localhost:9000/       (index.py)"
echo ""
echo "按 Ctrl+C 停止服务"
echo ""

python3 app.py
