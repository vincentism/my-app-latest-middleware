/**
 * 详细认证测试脚本
 * 专门测试认证相关端点，分析545错误
 */

const BASE_URL = 'https://vpn-eo.oilpipe.xyz';

// 测试token - 格式正确但可能已过期的JWT
const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0QHByaXZhbmV0LmNvbSIsImVtYWlsIjoidGVzdEBwcml2YW5ldC5jb20iLCJleHAiOjE3MzU2ODAwMDB9.test-signature';

// 无效格式的token
const INVALID_TOKEN = 'invalid-token-format';

async function testAuthEndpoints() {
  console.log('🔐 开始详细认证测试...\n');
  
  const tests = [
    {
      name: '系统状态（无认证）',
      url: `${BASE_URL}/api/system/status`,
      headers: {}
    },
    {
      name: '环境变量（无认证）',
      url: `${BASE_URL}/api/env`,
      headers: {}
    },
    {
      name: '代理认证（有效token）',
      url: `${BASE_URL}/api/proxy/auth`,
      headers: { 'Authorization': `Bearer ${TEST_TOKEN}` }
    },
    {
      name: '代理认证（无token，降级模式）',
      url: `${BASE_URL}/api/proxy/auth`,
      headers: {}
    },
    {
      name: '代理认证（无效token）',
      url: `${BASE_URL}/api/proxy/auth`,
      headers: { 'Authorization': `Bearer ${INVALID_TOKEN}` }
    },
    {
      name: '订阅状态（有效token）',
      url: `${BASE_URL}/api/subscription/status`,
      headers: { 'Authorization': `Bearer ${TEST_TOKEN}` }
    },
    {
      name: '订阅状态（无token，降级模式）',
      url: `${BASE_URL}/api/subscription/status`,
      headers: {}
    }
  ];
  
  for (const test of tests) {
    console.log(`🧪 测试: ${test.name}`);
    console.log(`🌐 URL: ${test.url}`);
    
    if (test.headers.Authorization) {
      console.log(`🔑 Authorization: ${test.headers.Authorization}`);
    } else {
      console.log(`🔑 Authorization: 无`);
    }
    
    try {
      const startTime = Date.now();
      const response = await fetch(test.url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...test.headers
        },
        signal: AbortSignal.timeout(15000)
      });
      
      const duration = Date.now() - startTime;
      console.log(`⏱️  响应时间: ${duration}ms`);
      console.log(`📊 状态码: ${response.status} ${response.statusText}`);
      
      // 获取响应头
      const contentType = response.headers.get('content-type');
      const contentLength = response.headers.get('content-length');
      console.log(`📄 Content-Type: ${contentType || '未知'}`);
      console.log(`📏 Content-Length: ${contentLength || '未知'}`);
      
      // 尝试读取响应体
      let responseData = null;
      try {
        if (response.ok || response.status === 545) {
          const text = await response.text();
          console.log(`📝 响应体: ${text}`);
          
          // 尝试解析JSON
          try {
            responseData = JSON.parse(text);
            console.log(`📋 JSON数据:`, JSON.stringify(responseData, null, 2));
          } catch {
            console.log(`📋 原始响应: ${text}`);
          }
        }
      } catch (error) {
        console.log(`⚠️  无法读取响应体: ${error.message}`);
      }
      
      // 分析状态码
      if (response.status === 545) {
        console.log(`🔍 545错误分析:`);
        console.log(`   - 这是EdgeOne Functions的运行时错误`);
        console.log(`   - 可能是JWT验证失败或代码错误`);
        if (responseData && responseData.error) {
          console.log(`   - 错误详情: ${responseData.error}`);
        }
      } else if (response.ok) {
        console.log(`✅ 测试通过`);
      } else {
        console.log(`⚠️  请求失败，状态码: ${response.status}`);
      }
      
    } catch (error) {
      console.log(`❌ 请求异常: ${error.message}`);
      if (error.name === 'AbortError') {
        console.log(`⏰ 请求超时`);
      }
    }
    
    console.log('━'.repeat(60));
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('🎯 认证测试完成！');
}

// 运行测试
testAuthEndpoints().catch(console.error);