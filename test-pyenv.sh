#!/bin/sh
  echo "=== 当前默认 Python 版本 ==="
  python3 --version 2>&1

  echo ""
  echo "=== 测试 python3.10 ==="
  python3.10 -V 2>&1

  echo ""
  echo "=== 测试 python3.12 ==="
  python3.12 -V 2>&1

  echo ""
  echo "=== 测试 pyenv 切换 ==="
  echo "pyenv 可用版本:"
  pyenv versions --bare 2>/dev/null || echo "pyenv not available"

  echo ""
  echo "--- 通过 PYENV_VERSION 切换到 3.10 ---"
  PYENV_VERSION=$(pyenv versions --bare 2>/dev/null | grep '^3\.10\.' | sort -V | tail -1)
  echo "PYENV_VERSION=$PYENV_VERSION"
  if [ -n "$PYENV_VERSION" ]; then
    export PYENV_VERSION
    python3 --version 2>&1
    unset PYENV_VERSION
  else
    echo "no 3.10.x in pyenv"
  fi

  echo ""
  echo "--- 通过 PYENV_VERSION 切换到 3.12 ---"
  PYENV_VERSION=$(pyenv versions --bare 2>/dev/null | grep '^3\.12\.' | sort -V | tail -1)
  echo "PYENV_VERSION=$PYENV_VERSION"
  if [ -n "$PYENV_VERSION" ]; then
    export PYENV_VERSION
    python3 --version 2>&1
    unset PYENV_VERSION
  else
    echo "no 3.12.x in pyenv"
  fi

  echo ""
  echo "=== 模拟用户 .python-version=3.11.9 场景 ==="
  echo "3.11.9" > /tmp/test_python_version
  cd /tmp
  echo "--- 不设 PYENV_VERSION (应该报错) ---"
  PYENV_DIR=/tmp python3 --version 2>&1
  echo ""
  echo "--- 设 PYENV_VERSION 绕过 (应该成功) ---"
  FALLBACK=$(pyenv versions --bare 2>/dev/null | grep '^3\.11\.' | sort -V | tail -1)
  echo "Fallback: $FALLBACK"
  if [ -n "$FALLBACK" ]; then
    PYENV_VERSION=$FALLBACK python3 --version 2>&1
  fi
  rm -f /tmp/test_python_version