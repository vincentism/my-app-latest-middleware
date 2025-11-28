/**
 * EdgeOne Functions 调试测试
 * 用于捕获和分析 545 错误的具体原因
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
      data = { text, raw: text, parseError: e.message };
    }
    
    return {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      data,
      url,
      responseText: text
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

async function debugEdgeOneFunctions() {
  console.log('🔍 开始 EdgeOne Functions 调试测试...\n');
  
  const baseUrl = 'https://vpn-eo.oilpipe.xyz';
  
  // 1. 测试最简单的认证端点
  console.log('1️⃣ 测试最简单的认证检查...');
  const simpleAuthResponse = await makeRequest(`${baseUrl}/api/auth/check`, {
    headers: {
      'Authorization': 'Bearer test-token'
    }
  });
  console.log('状态:', simpleAuthResponse.status);
  console.log('响应头:', simpleAuthResponse.headers);
  console.log('原始响应:', simpleAuthResponse.responseText);
  console.log('');
  
  // 2. 测试降级版本的订阅状态
  console.log('2️⃣ 测试降级版本订阅状态...');
  const fallbackResponse = await makeRequest(`${baseUrl}/api/subscription/status-fallback`);
  console.log('状态:', fallbackResponse.status);
  console.log('数据:', JSON.stringify(fallbackResponse.data, null, 2));
  console.log('');
  
  // 3. 测试代理端点的不同变体
  console.log('3️⃣ 测试代理端点变体...');
  const proxyVariants = [
    '/api/proxy/auth',
    '/api/proxy/auth/',
    '/api/proxy/auth/simple',
    '/api/proxy/simple-auth'
  ];
  
  for (const path of proxyVariants) {
    const response = await makeRequest(`${baseUrl}${path}`);
    console.log(`${path}: 状态 ${response.status}`);
    if (response.status !== 404) {
      console.log('  数据:', JSON.stringify(response.data, null, 2));
    }
  }
  console.log('');
  
  // 4. 测试支付端点的不同变体
  console.log('4️⃣ 测试支付端点变体...');
  const paymentVariants = [
    '/api/payment/create-checkout',
    '/api/payment/checkout',
    '/api/payment/session',
    '/api/checkout/create'
  ];
  
  for (const path of paymentVariants) {
    const response = await makeRequest(`${baseUrl}${path}`, {
      method: 'POST',
      body: JSON.stringify({ test: true })
    });
    console.log(`${path}: 状态 ${response.status}`);
    if (response.status !== 404) {
      console.log('  数据:', JSON.stringify(response.data, null, 2));
    }
  }
  console.log('');
  
  // 5. 测试带有详细错误信息的请求
  console.log('5️⃣ 测试带有错误捕获的请求...');
  const testAuthWithError = await makeRequest(`${baseUrl}/api/subscription/status`, {
    headers: {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0QGV4YW1wbGUuY29tIiwibmFtZSI6IlRlc3QgVXNlciIsImlhdCI6MTUxNjIzOTAyMn0.5d4148e7f8e1e8e9e8e9e8e9e8e9e8e9e8e9e8e9e8e9e8e9e8e9e8e9e8e9e',
      'X-Debug': 'true'
    }
  });
  console.log('状态:', testAuthWithError.status);
  console.log('原始响应:', testAuthWithError.responseText);
  console.log('');
  
  // 6. 测试健康检查和KV状态
  console.log('6️⃣ 测试KV和健康状态...');
  const healthResponses = [
    '/api/health',
    '/api/kv-test',
    '/api/kv-status',
    '/api/system/status'
  ];
  
  for (const path of healthResponses) {
    const response = await makeRequest(`${baseUrl}${path}`);
    console.log(`${path}: 状态 ${response.status}`);
    if (response.status === 200) {
      console.log('  数据:', JSON.stringify(response.data, null, 2));
    }
  }
  console.log('');
  
  console.log('🔍 调试测试完成！');
  
  // 分析结果
  console.log('\n📊 调试分析:');
  console.log('545 错误模式分析:');
  console.log('- 所有需要认证的端点都返回 545');
  console.log('- 545 是 EdgeOne 的脚本错误状态码');
  console.log('- 可能原因: JWT 验证失败、环境变量问题、运行时错误');
  console.log('- 建议: 检查 EdgeOne Functions 控制台日志');
}

// 运行调试测试
debugEdgeOneFunctions().catch(console.error);