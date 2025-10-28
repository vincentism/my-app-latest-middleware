/**
 * 特定错误测试
 * 用于识别具体的运行时错误
 */

async function testSpecificEndpoints() {
  console.log('🔍 开始特定端点错误测试...\n');
  
  const baseUrl = 'https://vpn-eo.oilpipe.xyz';
  
  // 1. 测试支付端点是否存在
  console.log('1️⃣ 测试支付端点...');
  const paymentEndpoints = [
    '/api/payment/create-checkout',
    '/api/payment/webhook',
    '/api/payment/status',
    '/api/payment/success',
    '/api/payment/cancel'
  ];
  
  for (const endpoint of paymentEndpoints) {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: endpoint.includes('webhook') ? 'POST' : 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log(`${endpoint}: ${response.status} ${response.statusText}`);
    
    if (response.status === 404) {
      console.log('  ⚠️  端点不存在 - 文件可能未部署');
    } else if (response.status === 545) {
      console.log('  ❌ 运行时错误 - 脚本执行失败');
      const text = await response.text();
      console.log('  响应:', text);
    } else if (response.status === 401) {
      console.log('  🔒 需要认证 - 这是预期的');
    } else {
      console.log('  ✅ 端点存在');
      try {
        const data = await response.json();
        console.log('  数据:', JSON.stringify(data, null, 2));
      } catch (e) {
        const text = await response.text();
        console.log('  原始响应:', text.substring(0, 200));
      }
    }
  }
  
  console.log('\n2️⃣ 测试代理端点...');
  const proxyEndpoints = [
    '/api/proxy/auth',
    '/api/proxy/nodes',
    '/api/proxy/status',
    '/api/proxy/config'
  ];
  
  for (const endpoint of proxyEndpoints) {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log(`${endpoint}: ${response.status} ${response.statusText}`);
    
    if (response.status === 404) {
      console.log('  ⚠️  端点不存在 - 文件可能未部署');
    } else if (response.status === 545) {
      console.log('  ❌ 运行时错误 - 脚本执行失败');
      const text = await response.text();
      console.log('  响应:', text);
    } else if (response.status === 401) {
      console.log('  🔒 需要认证 - 这是预期的');
    } else {
      console.log('  ✅ 端点存在');
      try {
        const data = await response.json();
        console.log('  数据:', JSON.stringify(data, null, 2));
      } catch (e) {
        const text = await response.text();
        console.log('  原始响应:', text.substring(0, 200));
      }
    }
  }
  
  console.log('\n3️⃣ 测试认证端点...');
  const authEndpoints = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/google/redirect',
    '/api/auth/google/callback',
    '/api/auth/status'
  ];
  
  for (const endpoint of authEndpoints) {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: ['login', 'register'].some(e => endpoint.includes(e)) ? 'POST' : 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log(`${endpoint}: ${response.status} ${response.statusText}`);
    
    if (response.status === 404) {
      console.log('  ⚠️  端点不存在 - 文件可能未部署');
    } else if (response.status === 545) {
      console.log('  ❌ 运行时错误 - 脚本执行失败');
      const text = await response.text();
      console.log('  响应:', text);
    } else if (response.status === 401) {
      console.log('  🔒 需要认证 - 这是预期的');
    } else {
      console.log('  ✅ 端点存在');
      try {
        const data = await response.json();
        console.log('  数据:', JSON.stringify(data, null, 2));
      } catch (e) {
        const text = await response.text();
        console.log('  原始响应:', text.substring(0, 200));
      }
    }
  }
  
  console.log('\n4️⃣ 检查 EdgeOne 配置...');
  
  // 检查 edgeone.json 配置
  const edgeoneConfig = await fetch(`${baseUrl}/edgeone.json`);
  if (edgeoneConfig.status === 200) {
    try {
      const config = await edgeoneConfig.json();
      console.log('EdgeOne 配置存在');
      console.log('函数包含规则:', config.functions?.include || '未配置');
      console.log('路由配置:', config.routes || '未配置');
    } catch (e) {
      console.log('EdgeOne 配置解析失败');
    }
  } else {
    console.log('EdgeOne 配置未找到');
  }
  
  console.log('\n🔍 测试完成！');
  
  console.log('\n📊 问题分析:');
  console.log('1. 545 错误表示 EdgeOne Functions 运行时错误');
  console.log('2. 可能的原因:');
  console.log('   - JWT 验证函数中的运行时错误');
  console.log('   - 环境变量在 EdgeOne 环境中未正确设置');
  console.log('   - EdgeOne Functions 不支持某些 Node.js API');
  console.log('   - 文件路径或导入问题');
  console.log('3. 建议检查 EdgeOne 控制台日志');
  console.log('4. 考虑添加更详细的错误处理');
}

// 运行测试
testSpecificEndpoints().catch(console.error);