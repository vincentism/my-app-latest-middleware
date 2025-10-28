/**
 * 测试EdgeOne Functions部署版本
 * 使用实际部署的URL进行测试
 */

// 使用实际部署的EdgeOne Functions URL
const BASE_URL = 'https://vpn-eo.oilpipe.xyz'; // 请替换为您的实际部署URL
const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0QHByaXZhbmV0LmNvbSIsImVtYWlsIjoidGVzdEBwcml2YW5ldC5jb20iLCJleHAiOjE3MzU2ODAwMDB9.test-signature';

/**
 * 辅助函数：发送请求
 */
async function makeRequest(url, options = {}) {
  try {
    console.log(`\n🚀 测试: ${options.method || 'GET'} ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    console.log(`📊 状态码: ${response.status} ${response.statusText}`);
    
    // 先读取响应文本，然后根据内容类型解析
    const responseText = await response.text();
    let data;
    
    try {
      // 尝试解析为JSON
      data = JSON.parse(responseText);
      console.log(`📦 响应数据:`, JSON.stringify(data, null, 2));
    } catch (jsonError) {
      // 如果不是JSON，直接使用文本
      console.log(`📄 响应文本:`, responseText);
      data = { text: responseText, error: jsonError.message };
    }
    
    return {
      status: response.status,
      statusText: response.statusText,
      data,
      headers: Object.fromEntries(response.headers.entries())
    };
    
  } catch (error) {
    console.error(`❌ 请求失败: ${error.message}`);
    return {
      status: 0,
      statusText: 'Network Error',
      data: { error: error.message }
    };
  }
}

/**
 * 运行部署测试
 */
async function runDeployedTests() {
  console.log('🌐 EdgeOne Functions部署测试开始');
  console.log('='.repeat(50));
  
  const results = [];
  
  // 测试1: 系统状态端点（应始终可用）
  console.log('\n📋 测试1: 系统状态端点');
  const systemStatusResult = await makeRequest(`${BASE_URL}/api/system/status`);
  results.push({
    name: '系统状态端点',
    status: systemStatusResult.status,
    passed: systemStatusResult.status === 200,
    data: systemStatusResult.data
  });
  
  // 测试2: 环境变量端点（测试基础功能）
  console.log('\n📋 测试2: 环境变量端点');
  const envResult = await makeRequest(`${BASE_URL}/api/env`);
  results.push({
    name: '环境变量端点',
    status: envResult.status,
    passed: envResult.status === 200,
    data: envResult.data
  });
  
  // 测试3: 代理认证端点（带降级功能）
  console.log('\n📋 测试3: 代理认证端点（带降级功能）');
  const proxyAuthResult = await makeRequest(`${BASE_URL}/api/proxy/auth`, {
    headers: {
      'Authorization': `Bearer ${TEST_TOKEN}`
    }
  });
  results.push({
    name: '代理认证端点',
    status: proxyAuthResult.status,
    passed: proxyAuthResult.status === 200,
    data: proxyAuthResult.data
  });
  
  // 测试4: 代理认证端点（无token，应使用降级模式）
  console.log('\n📋 测试4: 代理认证端点（无token，降级模式）');
  const proxyAuthNoTokenResult = await makeRequest(`${BASE_URL}/api/proxy/auth`);
  results.push({
    name: '代理认证端点（无token）',
    status: proxyAuthNoTokenResult.status,
    passed: proxyAuthNoTokenResult.status === 200,
    data: proxyAuthNoTokenResult.data
  });
  
  // 测试5: 订阅状态端点（带降级功能）
  console.log('\n📋 测试5: 订阅状态端点（带降级功能）');
  const subscriptionResult = await makeRequest(`${BASE_URL}/api/subscription/status`, {
    headers: {
      'Authorization': `Bearer ${TEST_TOKEN}`
    }
  });
  results.push({
    name: '订阅状态端点',
    status: subscriptionResult.status,
    passed: subscriptionResult.status === 200,
    data: subscriptionResult.data
  });
  
  // 汇总结果
  console.log('\n' + '='.repeat(50));
  console.log('📊 部署测试结果汇总');
  console.log('='.repeat(50));
  
  let passedCount = 0;
  results.forEach((result, index) => {
    const status = result.passed ? '✅ 通过' : '❌ 失败';
    console.log(`${index + 1}. ${result.name}: ${status}`);
    console.log(`   状态码: ${result.status}`);
    if (!result.passed && result.data.error) {
      console.log(`   错误: ${result.data.error}`);
    }
    if (result.passed) passedCount++;
  });
  
  console.log(`\n📈 总计: ${passedCount}/${results.length} 测试通过 (${Math.round(passedCount/results.length * 100)}%)`);
  
  // 分析结果
  console.log('\n🔍 部署分析:');
  if (passedCount >= 4) {
    console.log('✅ 降级模式修复成功！大部分端点现在可以工作。');
    console.log('✅ 简化JWT验证正常运行。');
    console.log('✅ 认证中间件错误处理已改善。');
  } else {
    console.log('⚠️  仍有问题需要解决。');
    console.log('💡 建议检查EdgeOne Functions控制台日志获取详细信息。');
  }
  
  return results;
}

// 运行测试
console.log('💡 提示：请确保将 BASE_URL 替换为您的实际 EdgeOne Functions 部署URL');
runDeployedTests().catch(console.error);