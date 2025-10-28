/**
 * 详细错误测试
 * 尝试获取EdgeOne Functions的具体错误信息
 */

async function testErrorDetails() {
  console.log('🔍 开始详细错误测试...\n');
  
  const BASE_URL = 'https://vpn-eo.oilpipe.xyz';
  
  // 测试不同的端点和场景
  const tests = [
    {
      name: '代理认证 - 无token',
      url: `${BASE_URL}/api/proxy/auth`,
      headers: {}
    },
    {
      name: '代理认证 - 无效token',
      url: `${BASE_URL}/api/proxy/auth`,
      headers: { 'Authorization': 'Bearer invalid-token' }
    },
    {
      name: '代理认证 - 有效token',
      url: `${BASE_URL}/api/proxy/auth`,
      headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0QHByaXZhbmV0LmNvbSIsImVtYWlsIjoidGVzdEBwcml2YW5ldC5jb20iLCJleHAiOjE3NjExNDU5OTV9.simplified-signature' }
    },
    {
      name: '订阅状态 - 无token',
      url: `${BASE_URL}/api/subscription/status`,
      headers: {}
    },
    {
      name: '订阅状态 - 有效token',
      url: `${BASE_URL}/api/subscription/status`,
      headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0QHByaXZhbmV0LmNvbSIsImVtYWlsIjoidGVzdEBwcml2YW5ldC5jb20iLCJleHAiOjE3NjExNDU5OTV9.simplified-signature' }
    }
  ];
  
  for (const test of tests) {
    console.log(`🧪 ${test.name}`);
    console.log(`🚀 URL: ${test.url}`);
    console.log(`📋 Headers:`, JSON.stringify(test.headers, null, 2));
    
    try {
      const response = await fetch(test.url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...test.headers
        }
      });
      
      console.log(`📊 状态码: ${response.status} ${response.statusText}`);
      
      // 读取响应体
      const responseText = await response.text();
      console.log(`📄 响应文本: ${responseText}`);
      
      // 尝试解析为JSON
      try {
        const jsonData = JSON.parse(responseText);
        console.log(`📦 JSON响应:`, JSON.stringify(jsonData, null, 2));
      } catch (e) {
        console.log(`⚠️  不是有效的JSON响应`);
      }
      
      // 检查响应头
      console.log(`📋 响应头:`);
      for (const [key, value] of response.headers.entries()) {
        console.log(`  ${key}: ${value}`);
      }
      
    } catch (error) {
      console.log(`❌ 网络错误: ${error.message}`);
    }
    
    console.log('\n' + '='.repeat(60) + '\n');
  }
  
  console.log('🎯 详细错误测试完成！');
}

// 运行测试
testErrorDetails().catch(console.error);