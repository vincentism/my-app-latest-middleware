#!/bin/bash
# 验证 Go 编译产物

echo "📁 检查编译产物..."
if [ -f ".netlify/functions/hello" ]; then
    echo "✅ 找到 Go 二进制文件"
    
    echo ""
    echo "📊 文件信息："
    ls -lh .netlify/functions/hello
    
    echo ""
    echo "🔍 文件类型："
    file .netlify/functions/hello
    
    echo ""
    echo "📦 大小对比："
    echo "Node.js Functions:"
    ls -lh .netlify/functions/*.zip 2>/dev/null | awk '{print "  " $9 ": " $5}'
    echo ""
    echo "Go Function:"
    du -h .netlify/functions/hello
    
else
    echo "❌ 未找到 Go 编译产物"
    echo "请先运行: ./build-go.sh"
fi
