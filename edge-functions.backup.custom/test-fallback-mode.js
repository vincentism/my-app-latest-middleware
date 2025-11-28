/**
 * 降级模式测试脚本
 * 测试认证失败时是否正确降级到测试用户
 */

const BASE_URL = 'https://vpn-eo.oilpipe.xyz';

async function testFallbackMode() {
  console.log('🛡️ 开始降级模式测试...\n');
  
  const tests = [
    {
      name: '代理认证端点 - 无token（应该降级）',
      url: `${BASE_URL}/api/proxy/auth`,
      headers: {},
      expectFallback: true
    },
    {
      name: '代理认证端点 - 无效token（应该降级）',
      url: `${BASE_URL}/api/proxy/auth`,
      headers: { 'Authorization': 'Bearer invalid-token' },
      expectFallback: true
    },
    {
      name: '订阅状态端点 - 无token（应该降级）',
      url: `${BASE_URL}/api/subscription/status`,
      headers: {},
      expectFallback: true
    },
    {
      name: '支付创建结账 - 无token（应该降级）',
      url: `${BASE_URL}/api/payment/create-checkout`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: 'monthly' }),
      expectFallback: true
    }
  ];
  
  for (const test of tests) {
    console.log(`🧪 ${test.name}`);
    console.log(`🌐 URL: ${test.url}`);
    
    try {
      const options = {
        method: test.method || 'GET',
        headers: test.headers,
        signal: AbortSignal.timeout(10000)
      };
      
      if (test.body) {
        options.body = test.body;
      }
      
      const response = await fetch(test.url, options);
      
      console.log(`📊 状态码: ${response.status}`);
      
      // 读取响应体
      const responseText = await response.text();
      console.log(`📝 响应: ${responseText}`);
      
      // 尝试解析JSON
      let responseData = null;
      try {
        responseData = JSON.parse(responseText);
      } catch {}
      
      // 分析结果
      if (response.status === 200) {
        if (responseData) {
          console.log(`✅ 成功返回数据`);
          if (responseData.user && responseData.user.email === 'test@privanet.com') {
            console.log(`🎯 降级模式正常工作 - 返回测试用户`);
          } else if (responseData.subscription || responseData.checkout) {
            console.log(`🎯 降级模式正常工作 - 返回测试数据`);
          } else {
            console.log(`📋 响应数据:`, JSON.stringify(responseData, null, 2));
          }
        } else {
          console.log(`✅ 请求成功但无数据返回`);
        }
      } else if (response.status === 545) {
        console.log(`⚠️  仍然返回545错误`);
        if (test.expectFallback) {
          console.log(`🔍 降级模式可能未生效`);
        }
      } else {
        console.log(`⚠️  意外状态码: ${response.status}`);
      }
      
    } catch (error) {
      console.log(`❌ 请求失败: ${error.message}`);
    }
    
    console.log('━'.repeat(60));
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('🎯 降级模式测试完成！');
}

// 运行测试
testFallbackMode().catch(console.error);