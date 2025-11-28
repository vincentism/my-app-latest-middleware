/**
 * 简单连接测试脚本
 * 测试基本的网络连接和EdgeOne Functions可用性
 */

// 测试不同的端点 - 使用实际域名
const endpoints = [
  'https://vpn-eo.oilpipe.xyz/api/system/status',
  'https://vpn-eo.oilpipe.xyz/api/env',
  'https://vpn-eo.oilpipe.xyz/api/health',
  'https://vpn-eo.oilpipe.xyz/api/simple-test',
  'https://vpn-eo.oilpipe.xyz/api/ultra-simple'
];

async function testConnection() {
  console.log('🔍 开始简单连接测试...\n');
  
  for (const url of endpoints) {
    try {
      console.log(`🚀 测试: ${url}`);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // 添加超时
        signal: AbortSignal.timeout(10000)
      });
      
      console.log(`✅ 连接成功! 状态码: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json().catch(() => null);
        if (data) {
          console.log(`📊 响应数据:`, JSON.stringify(data, null, 2));
        }
      }
      
    } catch (error) {
      console.log(`❌ 连接失败: ${error.message}`);
      
      // 如果是网络错误，提供更多信息
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.log(`🔍 这可能是网络连接问题或域名未生效`);
      }
    }
    
    console.log(''); // 空行分隔
    
    // 短暂延迟避免过快请求
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('🎯 测试完成！');
}

// 运行测试
testConnection().catch(console.error);