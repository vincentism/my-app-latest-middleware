const testEndpoint = async (url, name) => {
  try {
    console.log(`🚀 测试: ${name}`);
    const response = await fetch(url);
    console.log(`📊 状态码: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ ${name} 成功`);
      console.log(`📄 响应: ${JSON.stringify(data, null, 2)}`);
    } else {
      console.log(`❌ ${name} 失败`);
      const text = await response.text();
      console.log(`📄 错误响应: ${text}`);
    }
  } catch (error) {
    console.log(`❌ ${name} 错误: ${error.message}`);
  }
  console.log('');
};

(async () => {
  await testEndpoint('https://vpn-eo.oilpipe.xyz/api/test-context', 'Context Structure Test');
  await testEndpoint('https://vpn-eo.oilpipe.xyz/api/test-middleware-import', 'Middleware Import Test');
})();