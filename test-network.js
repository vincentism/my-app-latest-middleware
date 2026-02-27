const { chromium } = require('playwright');

async function checkNetworkRequests() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  const requests = [];
  const responses = [];
  const failedRequests = [];

  // 监听所有请求
  page.on('request', request => {
    requests.push({
      url: request.url(),
      method: request.method(),
      headers: request.headers(),
      resourceType: request.resourceType(),
      timestamp: new Date().toISOString()
    });
  });

  // 监听所有响应
  page.on('response', async response => {
    try {
      responses.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText(),
        headers: response.headers(),
        fromCache: response.fromCache,
        timing: null,
        timestamp: new Date().toISOString()
      });
    } catch (e) {
      // 忽略响应处理错误
    }
  });

  // 监听失败的请求
  page.on('requestfailed', request => {
    failedRequests.push({
      url: request.url(),
      method: request.method(),
      failure: request.failure(),
      timestamp: new Date().toISOString()
    });
  });

  // 监听控制台输出
  page.on('console', msg => {
    console.log(`[浏览器控制台 ${msg.type()}]`, msg.text());
  });

  // 监听页面错误
  page.on('pageerror', error => {
    console.error('[页面错误]', error.message);
  });

  console.log('正在访问 http://localhost:8088...\n');

  try {
    await page.goto('http://localhost:8088', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });

    // 等待额外的异步请求
    await page.waitForTimeout(3000);

    console.log('\n========== 网络请求分析报告 ==========\n');
    
    // 统计信息
    console.log('📊 请求统计:');
    console.log(`  总请求数: ${requests.length}`);
    console.log(`  成功响应: ${responses.filter(r => r.status >= 200 && r.status < 400).length}`);
    console.log(`  失败请求: ${failedRequests.length + responses.filter(r => r.status >= 400).length}`);
    console.log('');

    // 失败的请求
    if (failedRequests.length > 0) {
      console.log('❌ 完全失败的请求 (网络错误):');
      failedRequests.forEach(req => {
        console.log(`  [${req.method}] ${req.url}`);
        console.log(`      失败原因: ${req.failure?.errorText || '未知'}`);
      });
      console.log('');
    }

    // HTTP 错误状态码
    const errorResponses = responses.filter(r => r.status >= 400);
    if (errorResponses.length > 0) {
      console.log('⚠️  HTTP 错误状态码:');
      errorResponses.forEach(res => {
        console.log(`  [${res.status}] ${res.url}`);
      });
      console.log('');
    }

    // 按资源类型分类
    console.log('📁 按资源类型分类:');
    const typeGroups = {};
    requests.forEach(req => {
      const type = req.resourceType;
      typeGroups[type] = (typeGroups[type] || 0) + 1;
    });
    Object.entries(typeGroups).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });
    console.log('');

    // 详细请求列表
    console.log('📋 所有请求详情:\n');
    responses.forEach((res, index) => {
      const req = requests[index];
      const statusIcon = res.status >= 200 && res.status < 300 ? '✓' : 
                         res.status >= 300 && res.status < 400 ? '↪' : '✗';
      
      console.log(`${statusIcon} [${res.status}] ${req?.method || 'GET'} ${res.url}`);
      console.log(`   类型: ${req?.resourceType || 'unknown'}`);
      console.log(`   缓存: ${res.fromCache ? '是' : '否'}`);
      if (res.timing && res.timing.responseEnd && res.timing.requestStart) {
        console.log(`   耗时: ${Math.round(res.timing.responseEnd - res.timing.requestStart)}ms`);
      }
      console.log('');
    });

    // API 请求详情
    const apiRequests = responses.filter(r => 
      r.url.includes('/api/') || 
      r.url.includes('/_next/') ||
      r.url.match(/\.(json|js|css)$/)
    );
    
    if (apiRequests.length > 0) {
      console.log('🔌 API 和关键资源请求:');
      for (const res of apiRequests) {
        console.log(`  [${res.status}] ${res.url}`);
        
        // 尝试获取响应内容
        try {
          const response = await page.goto(res.url, { waitUntil: 'networkidle' });
          if (response && response.ok() && res.url.includes('/api/')) {
            const text = await response.text();
            console.log(`      响应预览: ${text.substring(0, 200)}${text.length > 200 ? '...' : ''}`);
          }
        } catch (e) {
          // 忽略获取响应内容的错误
        }
      }
      console.log('');
    }

    console.log('========== 报告结束 ==========\n');

  } catch (error) {
    console.error('❌ 访问页面时出错:', error.message);
  } finally {
    await browser.close();
  }
}

checkNetworkRequests();
