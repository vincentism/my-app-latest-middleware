#!/bin/bash
# Python Cloud Functions 测试启动脚本

set -e

echo "🐍 Python Cloud Functions 测试环境"
echo "===================================="
echo ""

# 检查 Python 版本
if ! command -v python3 &> /dev/null; then
    echo "❌ 错误: 未找到 python3"
    echo "请安装 Python 3.10 或更高版本"
    exit 1
fi

PYTHON_VERSION=$(python3 --version | awk '{print $2}')
echo "✅ Python 版本: $PYTHON_VERSION"

# 检查虚拟环境
if [ ! -d "venv" ]; then
    echo ""
    echo "📦 创建虚拟环境..."
    python3 -m venv venv
    echo "✅ 虚拟环境创建成功"
fi

# 激活虚拟环境
echo ""
echo "🔧 激活虚拟环境..."
source venv/bin/activate

# 安装依赖
echo ""
echo "📥 安装依赖..."
pip install -q -r requirements.txt
echo "✅ 依赖安装完成"

# 检查 EdgeOne CLI
if ! command -v edgeone &> /dev/null; then
    echo ""
    echo "⚠️  警告: 未找到 edgeone CLI"
    echo "请安装: npm install -g @edgeone/cli"
    exit 1
fi

echo ""
echo "✅ 环境准备完成"
echo ""
echo "🚀 启动选项:"
echo "  1. edgeone pages dev     - 启动开发服务器"
echo "  2. python test_all.py    - 运行自动化测试"
echo "  3. open http://localhost:8088/ - 打开浏览器"
echo ""
echo "💡 提示: 在另一个终端运行测试脚本"
echo ""

# 询问用户要执行什么操作
read -p "选择操作 (1/2/3/skip): " choice

case $choice in
    1)
        echo ""
        echo "🌟 启动开发服务器..."
        cd ..
        edgeone pages dev
        ;;
    2)
        echo ""
        echo "🧪 运行测试（请确保开发服务器在另一个终端运行）..."
        sleep 2
        python test_all.py
        ;;
    3)
        echo ""
        echo "🌐 打开浏览器..."
        if command -v open &> /dev/null; then
            open http://localhost:8088/
        elif command -v xdg-open &> /dev/null; then
            xdg-open http://localhost:8088/
        else
            echo "请手动打开: http://localhost:8088/"
        fi
        ;;
    *)
        echo ""
        echo "✨ 环境已准备，请手动运行命令"
        ;;
esac
