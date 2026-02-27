#!/usr/bin/env python3
"""
快速验证测试 - 验证所有框架的基本加载和语法
"""
import os
import sys

print("=" * 80)
print("Python 云函数快速验证测试".center(80))
print("=" * 80)
print()

# 测试文件列表
test_files = [
    "index.py",
    "demo-fastapi.py",
    "demo-flask.py",
    "demo-django.py",
    "demo-sanic.py"
]

print("📝 测试 1: Python 语法检查")
print("-" * 80)

passed = 0
failed = 0

for file in test_files:
    if os.path.exists(file):
        ret = os.system(f"python3 -m py_compile {file} 2>/dev/null")
        if ret == 0:
            print(f"✅ {file:<30} 语法正确")
            passed += 1
        else:
            print(f"❌ {file:<30} 语法错误")
            failed += 1
    else:
        print(f"⚠️  {file:<30} 文件不存在")
        failed += 1

print()
print(f"结果: {passed}/{len(test_files)} 通过")

if failed > 0:
    print(f"❌ {failed} 个文件有问题")
    sys.exit(1)

print()
print("=" * 80)
print("✅ 所有文件验证通过！")
print("=" * 80)
print()
print("下一步:")
print("1. 运行 Dev 模式测试: python3 test_dev_mode.py")
print("2. 运行 Build 模式测试: python3 test_build_mode.py")
print("3. 运行完整测试: ./run_full_test.sh")
print()
