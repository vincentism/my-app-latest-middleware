#!/bin/bash
# 编译 Netlify Go Function 的脚本

set -e

echo "🔍 检查 Go 环境..."
if ! command -v go &> /dev/null; then
    echo "❌ Go 未安装，请先运行："
    echo "   brew install go"
    exit 1
fi

echo "✅ Go 版本: $(go version)"

# 进入 functions 目录
cd "$(dirname "$0")/netlify/functions"

echo "📦 下载 Go 依赖..."
go mod download

echo "🔨 编译 Go Function..."
# 编译为 Lambda 格式（Linux AMD64）
GOOS=linux GOARCH=amd64 go build -o ../../.netlify/functions/hello hello.go

echo "✅ 编译成功！"
ls -lh ../../.netlify/functions/hello

echo "📊 文件大小："
du -h ../../.netlify/functions/hello
