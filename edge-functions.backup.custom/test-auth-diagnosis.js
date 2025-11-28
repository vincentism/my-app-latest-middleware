/**
 * VPN 服务认证诊断测试
 * 用于诊断认证相关的问题
 */

async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    const text = await response.text();
    let data = null;
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = { text, raw: text };
    }
    
    return {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      data,
      url
    };
  } catch (error) {
    return {
      status: 0,
      statusText: 'Network Error',
      error: error.message,
      url
    };
  }
}

async function testAuthFlow() {
  console.log('🔍 开始认证流程诊断测试...\n');
  
  const baseUrl = 'https://vpn-eo.oilpipe.xyz';
  
  // 1. 测试无认证的订阅状态
  console.log('1️⃣ 测试无认证的订阅状态...');
  const noAuthResponse = await makeRequest(`${baseUrl}/api/subscription/status`);
  console.log('状态:', noAuthResponse.status);
  console.log('数据:', JSON.stringify(noAuthResponse.data, null, 2));
  console.log('');
  
  // 2. 测试无效token
  console.log('2️⃣ 测试无效token...');
  const invalidTokenResponse = await makeRequest(`${baseUrl}/api/subscription/status`, {
    headers: {
      'Authorization': 'Bearer invalid-token-12345'
    }
  });
  console.log('状态:', invalidTokenResponse.status);
  console.log('数据:', JSON.stringify(invalidTokenResponse.data, null, 2));
  console.log('');
  
  // 3. 测试格式错误的Authorization头
  console.log('3️⃣ 测试格式错误的Authorization头...');
  const malformedAuthResponse = await makeRequest(`${baseUrl}/api/subscription/status`, {
    headers: {
      'Authorization': 'InvalidFormat token'
    }
  });
  console.log('状态:', malformedAuthResponse.status);
  console.log('数据:', JSON.stringify(malformedAuthResponse.data, null, 2));
  console.log('');
  
  // 4. 测试缺少Authorization头
  console.log('4️⃣ 测试缺少Authorization头...');
  const missingAuthResponse = await makeRequest(`${baseUrl}/api/subscription/status`, {
    headers: {} // 明确不添加Authorization
  });
  console.log('状态:', missingAuthResponse.status);
  console.log('数据:', JSON.stringify(missingAuthResponse.data, null, 2));
  console.log('');
  
  // 5. 测试其他需要认证的端点
  console.log('5️⃣ 测试代理认证端点...');
  const proxyAuthResponse = await makeRequest(`${baseUrl}/api/proxy/auth`);
  console.log('状态:', proxyAuthResponse.status);
  console.log('数据:', JSON.stringify(proxyAuthResponse.data, null, 2));
  console.log('');
  
  // 6. 测试环境变量端点
  console.log('6️⃣ 测试环境变量端点...');
  const envResponse = await makeRequest(`${baseUrl}/api/env-test`);
  console.log('状态:', envResponse.status);
  console.log('数据:', JSON.stringify(envResponse.data, null, 2));
  console.log('');
  
  // 7. 测试JWT_SECRET是否存在
  if (envResponse.data && envResponse.data.env) {
    console.log('7️⃣ 环境变量检查...');
    console.log('JWT_SECRET 存在:', !!envResponse.data.env.JWT_SECRET);
    console.log('JWT_SECRET 长度:', envResponse.data.env.JWT_SECRET ? envResponse.data.env.JWT_SECRET.length : 0);
    console.log('NODE_ENV:', envResponse.data.env.NODE_ENV);
    console.log('');
  }
  
  console.log('🔍 诊断测试完成！');
  
  // 总结
  console.log('\n📊 诊断总结:');
  const responses = [
    { name: '无认证订阅状态', response: noAuthResponse },
    { name: '无效token', response: invalidTokenResponse },
    { name: '格式错误Auth', response: malformedAuthResponse },
    { name: '缺少Auth', response: missingAuthResponse },
    { name: '代理认证', response: proxyAuthResponse }
  ];
  
  responses.forEach(({ name, response }) => {
    const status = response.status;
    const expected = name.includes('无认证') || name.includes('无效') || name.includes('格式错误') || name.includes('缺少') ? [401, 545] : [200];
    const isExpected = expected.includes(status);
    console.log(`${isExpected ? '✅' : '❌'} ${name}: ${status} ${isExpected ? '(符合预期)' : '(不符合预期)'}`);
  });
}

// 运行诊断测试
testAuthFlow().catch(console.error);