#!/bin/bash
# 测试 Python Cloud Function

echo "🧪 测试 Python Function..."
echo ""

# 等待服务启动
sleep 2

echo "1️⃣ 测试根路径 (index.py):"
curl -s http://localhost:9000/
echo -e "\n"

echo ""
echo "✅ 测试完成！"
