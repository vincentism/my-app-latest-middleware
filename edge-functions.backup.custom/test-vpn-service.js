/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// 全面测试 VPN 服务脚本
// 测试地址: https://vpn-eo.oilpipe.xyz

const BASE_URL = 'https://vpn-eo.oilpipe.xyz';

// 测试配置
const TEST_CONFIG = {
  baseUrl: BASE_URL,
  testUser: {
    email: 'test@privanet.com',
    password: 'test123'
  },
  timeout: 10000
};

// 测试结果收集器
class TestResults {
  constructor() {
    this.results = [];
    this.passed = 0;
    this.failed = 0;
  }

  add(testName, passed, details = '') {
    this.results.push({ testName, passed, details, timestamp: new Date().toISOString() });
    if (passed) {
      this.passed++;
      console.log(`✅ ${testName}`);
    } else {
      this.failed++;
      console.log(`❌ ${testName}: ${details}`);
    }
  }

  summary() {
    console.log('\n=== 测试摘要 ===');
    console.log(`总测试数: ${this.results.length}`);
    console.log(`通过: ${this.passed}`);
    console.log(`失败: ${this.failed}`);
    console.log(`成功率: ${((this.passed / this.results.length) * 100).toFixed(1)}%`);
    
    if (this.failed > 0) {
      console.log('\n失败的测试:');
      this.results.filter(r => !r.passed).forEach(r => {
        console.log(`  - ${r.testName}: ${r.details}`);
      });
    }
    
    return this.failed === 0;
  }
}

// HTTP 请求工具
async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      timeout: TEST_CONFIG.timeout,
      ...options
    });
    
    const data = await response.json().catch(() => ({}));
    
    return {
      status: response.status,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries()),
      data
    };
  } catch (error) {
    return {
      status: 0,
      ok: false,
      error: error.message,
      data: null
    };
  }
}

// 测试函数
async function testHealthEndpoint() {
  console.log('\n=== 测试健康检查端点 ===');
  const results = new TestResults();
  
  const response = await makeRequest(`${TEST_CONFIG.baseUrl}/api/health`);
  
  results.add('健康检查响应状态', response.ok && response.status === 200);
  results.add('健康检查响应数据', 
    response.data && response.data.status === 'ok',
    `期望: {status: 'ok'}, 实际: ${JSON.stringify(response.data)}`
  );
  
  return results;
}

async function testSimpleTestEndpoint() {
  console.log('\n=== 测试简单测试端点 ===');
  const results = new TestResults();
  
  const response = await makeRequest(`${TEST_CONFIG.baseUrl}/api/simple-test`);
  
  results.add('简单测试响应状态', response.ok && response.status === 200);
  results.add('简单测试响应数据',
    response.data && response.data.message && response.data.timestamp,
    `期望包含 message 和 timestamp, 实际: ${JSON.stringify(response.data)}`
  );
  
  return results;
}

async function testUltraSimpleEndpoint() {
  console.log('\n=== 测试极简端点 ===');
  const results = new TestResults();
  
  const response = await makeRequest(`${TEST_CONFIG.baseUrl}/api/ultra-simple`);
  
  results.add('极简端点响应状态', response.ok && response.status === 200);
  results.add('极简端点响应数据',
    response.data && response.data.message === 'Ultra simple test endpoint working!',
    `期望: {message: 'Ultra simple test endpoint working!'}, 实际: ${JSON.stringify(response.data)}`
  );
  
  return results;
}

async function testEnvironmentTestEndpoint() {
  console.log('\n=== 测试环境变量端点 ===');
  const results = new TestResults();
  
  const response = await makeRequest(`${TEST_CONFIG.baseUrl}/api/env-test`);
  
  results.add('环境测试响应状态', response.ok && response.status === 200);
  results.add('环境测试数据完整性',
    response.data && 
    response.data.hasOwnProperty('env_vars') &&
    response.data.hasOwnProperty('timestamp') &&
    response.data.hasOwnProperty('node_env'),
    `期望包含 env_vars, timestamp, node_env, 实际: ${JSON.stringify(response.data)}`
  );
  
  return results;
}

async function testKVTestEndpoint() {
  console.log('\n=== 测试 KV 存储端点 ===');
  const results = new TestResults();
  
  const response = await makeRequest(`${TEST_CONFIG.baseUrl}/api/kv-test`);
  
  results.add('KV测试响应状态', response.status !== 0);
  results.add('KV测试数据格式',
    response.data && 
    response.data.hasOwnProperty('kv_available') &&
    response.data.hasOwnProperty('test_result'),
    `期望包含 kv_available 和 test_result, 实际: ${JSON.stringify(response.data)}`
  );
  
  // 如果KV不可用，检查是否有降级处理
  if (response.data && !response.data.kv_available) {
    results.add('KV降级处理',
      response.data.hasOwnProperty('fallback_message'),
      'KV不可用时应该有降级消息'
    );
  }
  
  return results;
}

async function testBareTestEndpoint() {
  console.log('\n=== 测试裸端点 ===');
  const results = new TestResults();
  
  const response = await makeRequest(`${TEST_CONFIG.baseUrl}/api/bare-test`);
  
  results.add('裸端点响应状态', response.ok && response.status === 200);
  results.add('裸端点响应数据',
    response.data && response.data.message === 'Bare test endpoint',
    `期望: {message: 'Bare test endpoint'}, 实际: ${JSON.stringify(response.data)}`
  );
  
  return results;
}

async function testPublicNodesEndpoint() {
  console.log('\n=== 测试公共节点端点 ===');
  const results = new TestResults();
  
  const response = await makeRequest(`${TEST_CONFIG.baseUrl}/api/public-nodes`);
  
  results.add('公共节点响应状态', response.ok && response.status === 200);
  results.add('公共节点数据格式',
    response.data && 
    Array.isArray(response.data.nodes) &&
    response.data.nodes.length > 0,
    `期望包含 nodes 数组, 实际: ${JSON.stringify(response.data)}`
  );
  
  // 验证节点数据格式
  if (response.data && response.data.nodes && response.data.nodes.length > 0) {
    const firstNode = response.data.nodes[0];
    results.add('节点数据结构',
      firstNode.hasOwnProperty('name') &&
      firstNode.hasOwnProperty('server') &&
      firstNode.hasOwnProperty('port') &&
      firstNode.hasOwnProperty('protocol'),
      `节点应包含 name, server, port, protocol, 实际: ${JSON.stringify(firstNode)}`
    );
  }
  
  return results;
}

async function testSubscriptionStatusEndpoint() {
  console.log('\n=== 测试订阅状态端点 ===');
  const results = new TestResults();
  
  // 注意：这个端点需要认证，我们先测试未认证的情况
  const response = await makeRequest(`${TEST_CONFIG.baseUrl}/api/subscription/status`);
  
  results.add('订阅状态认证保护',
    response.status === 401 || response.status === 403,
    `期望401或403未认证状态, 实际: ${response.status}`
  );
  
  return results;
}

async function testAuthEndpoints() {
  console.log('\n=== 测试认证端点 ===');
  const results = new TestResults();
  
  // 测试登录端点
  const loginResponse = await makeRequest(`${TEST_CONFIG.baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: TEST_CONFIG.testUser.email,
      password: TEST_CONFIG.testUser.password
    })
  });
  
  results.add('登录端点响应',
    loginResponse.status !== 0,
    `登录端点可访问: ${loginResponse.status}`
  );
  
  // 测试注册端点
  const registerResponse = await makeRequest(`${TEST_CONFIG.baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: 'newuser@example.com',
      password: 'password123'
    })
  });
  
  results.add('注册端点响应',
    registerResponse.status !== 0,
    `注册端点可访问: ${registerResponse.status}`
  );
  
  return results;
}

async function testPaymentEndpoints() {
  console.log('\n=== 测试支付端点 ===');
  const results = new TestResults();
  
  // 测试创建结账会话
  const checkoutResponse = await makeRequest(`${TEST_CONFIG.baseUrl}/api/payment/create-checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      priceId: 'price_test_123'
    })
  });
  
  results.add('支付结账端点响应',
    checkoutResponse.status !== 0,
    `支付结账端点可访问: ${checkoutResponse.status}`
  );
  
  // 检查是否有降级处理
  if (checkoutResponse.data) {
    results.add('支付降级处理',
      checkoutResponse.data.hasOwnProperty('kv_available'),
      '支付端点应包含KV可用性信息'
    );
  }
  
  return results;
}

async function testProxyEndpoints() {
  console.log('\n=== 测试代理端点 ===');
  const results = new TestResults();
  
  // 测试代理认证
  const proxyAuthResponse = await makeRequest(`${TEST_CONFIG.baseUrl}/api/proxy/auth`);
  
  results.add('代理认证端点响应',
    proxyAuthResponse.status !== 0,
    `代理认证端点可访问: ${proxyAuthResponse.status}`
  );
  
  // 测试代理节点
  const proxyNodesResponse = await makeRequest(`${TEST_CONFIG.baseUrl}/api/proxy/nodes`);
  
  results.add('代理节点端点响应',
    proxyNodesResponse.status !== 0,
    `代理节点端点可访问: ${proxyNodesResponse.status}`
  );
  
  return results;
}

async function testFrontendAssets() {
  console.log('\n=== 测试前端资源 ===');
  const results = new TestResults();
  
  // 测试主页
  const homeResponse = await makeRequest(TEST_CONFIG.baseUrl);
  results.add('主页可访问',
    homeResponse.ok && homeResponse.status === 200,
    `主页状态: ${homeResponse.status}`
  );
  
  // 测试静态资源
  const staticResponse = await makeRequest(`${TEST_CONFIG.baseUrl}/assets/index.js`);
  results.add('静态资源可访问',
    staticResponse.status !== 404,
    `静态资源状态: ${staticResponse.status}`
  );
  
  return results;
}

async function testSecurityHeaders() {
  console.log('\n=== 测试安全头 ===');
  const results = new TestResults();
  
  const response = await makeRequest(`${TEST_CONFIG.baseUrl}/api/health`);
  
  if (response.headers) {
    results.add('X-Content-Type-Options',
      response.headers['x-content-type-options'] === 'nosniff',
      `X-Content-Type-Options: ${response.headers['x-content-type-options']}`
    );
    
    results.add('X-Frame-Options',
      response.headers['x-frame-options'] === 'DENY',
      `X-Frame-Options: ${response.headers['x-frame-options']}`
    );
    
    results.add('Referrer-Policy',
      response.headers['referrer-policy'] === 'strict-origin-when-cross-origin',
      `Referrer-Policy: ${response.headers['referrer-policy']}`
    );
  }
  
  return results;
}

// 主测试运行器
async function runComprehensiveTests() {
  console.log('🚀 开始 VPN 服务全面测试');
  console.log(`测试目标: ${TEST_CONFIG.baseUrl}`);
  console.log(`开始时间: ${new Date().toLocaleString()}`);
  
  const allResults = [];
  
  try {
    // 基础端点测试
    allResults.push(await testHealthEndpoint());
    allResults.push(await testSimpleTestEndpoint());
    allResults.push(await testUltraSimpleEndpoint());
    allResults.push(await testEnvironmentTestEndpoint());
    allResults.push(await testKVTestEndpoint());
    allResults.push(await testBareTestEndpoint());
    allResults.push(await testPublicNodesEndpoint());
    
    // 认证相关测试
    allResults.push(await testSubscriptionStatusEndpoint());
    allResults.push(await testAuthEndpoints());
    
    // 支付和代理测试
    allResults.push(await testPaymentEndpoints());
    allResults.push(await testProxyEndpoints());
    
    // 前端和安全测试
    allResults.push(await testFrontendAssets());
    allResults.push(await testSecurityHeaders());
    
  } catch (error) {
    console.error('测试执行失败:', error);
  }
  
  // 汇总结果
  console.log('\n=== 全面测试完成 ===');
  
  let totalPassed = 0;
  let totalFailed = 0;
  
  allResults.forEach(result => {
    totalPassed += result.passed;
    totalFailed += result.failed;
  });
  
  console.log(`总测试项: ${totalPassed + totalFailed}`);
  console.log(`通过: ${totalPassed}`);
  console.log(`失败: ${totalFailed}`);
  console.log(`整体成功率: ${((totalPassed / (totalPassed + totalFailed)) * 100).toFixed(1)}%`);
  
  const allPassed = totalFailed === 0;
  
  if (allPassed) {
    console.log('\n🎉 所有测试通过！VPN 服务运行正常！');
  } else {
    console.log('\n⚠️  部分测试失败，请查看详细结果');
  }
  
  console.log(`\n结束时间: ${new Date().toLocaleString()}`);
  
  return allPassed;
}

// 运行测试
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runComprehensiveTests, TEST_CONFIG };
} else {
  runComprehensiveTests().catch(console.error);
}