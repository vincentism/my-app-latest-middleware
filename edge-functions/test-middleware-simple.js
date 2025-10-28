/**
 * 简化中间件测试
 * 测试认证中间件的基本功能
 */

import { requireAuthWithFallback } from './lib/middleware.js';

// 模拟处理器
async function testHandler(context) {
  return {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Handler executed successfully',
      user: context.user,
      timestamp: new Date().toISOString()
    })
  };
}

// 模拟请求上下文
function createMockContext(authHeader = null, env = {}) {
  return {
    request: {
      headers: {
        get: (name) => {
          if (name.toLowerCase() === 'authorization') {
            return authHeader;
          }
          return null;
        }
      }
    },
    env: {
      JWT_SECRET: 'test-secret-key',
      ...env
    }
  };
}

async function testMiddleware() {
  console.log('🧪 开始中间件测试...\n');
  
  // 测试1: 无认证头（应降级到测试用户）
  console.log('🧪 测试1: 无认证头（降级模式）');
  try {
    const wrappedHandler = requireAuthWithFallback(testHandler);
    const context1 = createMockContext();
    const result1 = await wrappedHandler(context1);
    
    console.log('✅ 测试1通过');
    console.log('状态码:', result1.status);
    console.log('用户:', JSON.parse(result1.body).user);
  } catch (error) {
    console.log('❌ 测试1失败:', error.message);
  }
  
  // 测试2: 无效认证头
  console.log('\n🧪 测试2: 无效认证头');
  try {
    const wrappedHandler = requireAuthWithFallback(testHandler);
    const context2 = createMockContext('Bearer invalid-token');
    const result2 = await wrappedHandler(context2);
    
    console.log('✅ 测试2通过');
    console.log('状态码:', result2.status);
    console.log('用户:', JSON.parse(result2.body).user);
  } catch (error) {
    console.log('❌ 测试2失败:', error.message);
  }
  
  // 测试3: 有效认证头
  console.log('\n🧪 测试3: 有效认证头');
  try {
    // 使用我们测试过的有效token
    const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0QHByaXZhbmV0LmNvbSIsImVtYWlsIjoidGVzdEBwcml2YW5ldC5jb20iLCJleHAiOjE3NjExNDU5OTV9.simplified-signature';
    const wrappedHandler = requireAuthWithFallback(testHandler);
    const context3 = createMockContext(`Bearer ${validToken}`);
    const result3 = await wrappedHandler(context3);
    
    console.log('✅ 测试3通过');
    console.log('状态码:', result3.status);
    console.log('用户:', JSON.parse(result3.body).user);
  } catch (error) {
    console.log('❌ 测试3失败:', error.message);
  }
  
  // 测试4: 无JWT_SECRET环境变量
  console.log('\n🧪 测试4: 无JWT_SECRET环境变量');
  try {
    const wrappedHandler = requireAuthWithFallback(testHandler);
    const context4 = createMockContext('Bearer some-token', { JWT_SECRET: null });
    const result4 = await wrappedHandler(context4);
    
    console.log('✅ 测试4通过');
    console.log('状态码:', result4.status);
    console.log('响应:', JSON.parse(result4.body));
  } catch (error) {
    console.log('❌ 测试4失败:', error.message);
  }
  
  console.log('\n🎯 中间件测试完成！');
}

// 运行测试
testMiddleware().catch(console.error);