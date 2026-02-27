#!/bin/bash

# 完整测试脚本 - Dev 模式和 Build 模式

PROJECT_ROOT="/Users/vincentlli/Documents/demo/netlify/my-app-latest"
CF_DIR="$PROJECT_ROOT/cloud-functions"

echo "======================================================================"
echo "                    Python 云函数完整测试                             "
echo "======================================================================"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查依赖
echo ">>> 检查 Python 依赖..."
cd "$CF_DIR"
if ! pip3 list | grep -q "fastapi"; then
    echo ">>> 安装依赖..."
    pip3 install -r requirements.txt
fi

echo ""
echo "======================================================================"
echo "                        模式 1: Dev 模式测试                          "
echo "======================================================================"
echo ""

# 清理端口
echo ">>> 清理端口..."
lsof -ti:8088 | xargs kill -9 2>/dev/null
lsof -ti:8089 | xargs kill -9 2>/dev/null
lsof -ti:9000 | xargs kill -9 2>/dev/null
lsof -ti:9100 | xargs kill -9 2>/dev/null
sleep 2

# 启动 dev 服务
echo ">>> 启动 Dev 服务..."
cd "$PROJECT_ROOT"
echo "N" | edgeone pages dev > /tmp/edgeone-dev.log 2>&1 &
DEV_PID=$!

echo ">>> 等待服务启动（15秒）..."
sleep 15

# 检查服务状态
if tail -50 /tmp/edgeone-dev.log | grep -q "Running at"; then
    echo -e "${GREEN}✅ Dev 服务启动成功${NC}"
    
    # 运行 dev 模式测试
    echo ""
    echo ">>> 开始 Dev 模式测试..."
    cd "$CF_DIR"
    python3 test_dev_mode.py
    
    DEV_RESULT=$?
else
    echo -e "${RED}❌ Dev 服务启动失败${NC}"
    echo ">>> 查看日志:"
    tail -50 /tmp/edgeone-dev.log
    DEV_RESULT=1
fi

# 停止 dev 服务
echo ""
echo ">>> 停止 Dev 服务..."
kill $DEV_PID 2>/dev/null
pkill -f "edgeone pages dev" 2>/dev/null
sleep 3

echo ""
echo "======================================================================"
echo "                      模式 2: Build 模式测试                          "
echo "======================================================================"
echo ""

# 执行 build
echo ">>> 执行 edgeone pages build..."
cd "$PROJECT_ROOT"
echo "N" | edgeone pages build > /tmp/edgeone-build.log 2>&1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build 完成${NC}"
else
    echo -e "${RED}❌ Build 失败${NC}"
    tail -50 /tmp/edgeone-build.log
    exit 1
fi

# 进入 python 目录并启动服务
PYTHON_DIR="$PROJECT_ROOT/.edgeone/cloud-functions/python"

if [ -d "$PYTHON_DIR" ]; then
    echo ">>> 进入 $PYTHON_DIR"
    cd "$PYTHON_DIR"
    
    # 安装依赖
    echo ">>> 安装 Build 模式依赖..."
    if [ -f "requirements.txt" ]; then
        pip3 install --target . -r requirements.txt --upgrade > /tmp/build-pip-install.log 2>&1
        echo -e "${GREEN}✅ 依赖安装完成${NC}"
    fi
    
    # 启动 app.py
    echo ">>> 启动 Build 模式服务 (python3 app.py)..."
    python3 app.py > /tmp/build-server.log 2>&1 &
    BUILD_PID=$!
    
    echo ">>> 等待服务启动（10秒）..."
    sleep 10
    
    # 检查服务
    if curl -s http://localhost:9000 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Build 服务启动成功${NC}"
        
        # 运行 build 模式测试
        echo ""
        echo ">>> 开始 Build 模式测试..."
        cd "$CF_DIR"
        python3 test_build_mode.py
        
        BUILD_RESULT=$?
    else
        echo -e "${RED}❌ Build 服务启动失败${NC}"
        echo ">>> 查看日志:"
        tail -50 /tmp/build-server.log
        BUILD_RESULT=1
    fi
    
    # 停止服务
    echo ""
    echo ">>> 停止 Build 服务..."
    kill $BUILD_PID 2>/dev/null
    lsof -ti:9000 | xargs kill -9 2>/dev/null
else
    echo -e "${RED}❌ 找不到 $PYTHON_DIR${NC}"
    BUILD_RESULT=1
fi

# 清理
echo ""
echo ">>> 清理端口..."
lsof -ti:8088 | xargs kill -9 2>/dev/null
lsof -ti:8089 | xargs kill -9 2>/dev/null
lsof -ti:9000 | xargs kill -9 2>/dev/null
lsof -ti:9100 | xargs kill -9 2>/dev/null

echo ""
echo "======================================================================"
echo "                           测试总结                                   "
echo "======================================================================"
echo ""

if [ $DEV_RESULT -eq 0 ]; then
    echo -e "Dev 模式:  ${GREEN}✅ 通过${NC}"
else
    echo -e "Dev 模式:  ${RED}❌ 失败${NC}"
fi

if [ $BUILD_RESULT -eq 0 ]; then
    echo -e "Build 模式: ${GREEN}✅ 通过${NC}"
else
    echo -e "Build 模式: ${RED}❌ 失败${NC}"
fi

echo ""
echo "日志文件:"
echo "  - Dev 模式:   /tmp/edgeone-dev.log"
echo "  - Build 模式: /tmp/edgeone-build.log"
echo "  - Build 服务: /tmp/build-server.log"
echo ""

if [ $DEV_RESULT -eq 0 ] && [ $BUILD_RESULT -eq 0 ]; then
    echo -e "${GREEN}🎉 所有测试通过!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  部分测试失败${NC}"
    exit 1
fi
