const { chromium } = require('playwright');
const fs = require('fs');

async function checkNetworkRequests() {
  console.log('🚀 启动 Chromium 浏览器（headless 模式）...\n');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const requests = [];
  const responses = [];
  const failedRequests = [];
  const consoleLogs = [];
  const pageErrors = [];

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
        timing: null, // timing 需要特殊处理
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
    const log = `[${msg.type()}] ${msg.text()}`;
    consoleLogs.push(log);
    console.log(`  ${log}`);
  });

  // 监听页面错误
  page.on('pageerror', error => {
    pageErrors.push(error.message);
    console.error(`  [页面错误] ${error.message}`);
  });

  console.log('📱 正在访问 http://localhost:8088...\n');

  try {
    await page.goto('http://localhost:8088', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });

    console.log('⏱️  等待额外的异步请求...\n');
    await page.waitForTimeout(3000);

    // 生成报告
    const report = generateReport(requests, responses, failedRequests, consoleLogs, pageErrors);
    
    // 输出到控制台
    console.log(report.console);
    
    // 保存到文件
    const reportFile = 'network-test-report.txt';
    fs.writeFileSync(reportFile, report.file);
    console.log(`\n💾 详细报告已保存到: ${reportFile}`);

  } catch (error) {
    console.error('❌ 访问页面时出错:', error.message);
  } finally {
    await browser.close();
  }
}

function generateReport(requests, responses, failedRequests, consoleLogs, pageErrors) {
  let consoleOutput = '';
  let fileOutput = '';
  
  const log = (text) => {
    consoleOutput += text + '\n';
    fileOutput += text + '\n';
  };

  log('========================================');
  log('        网络请求分析报告');
  log('========================================');
  log('');
  log(`⏰ 测试时间: ${new Date().toLocaleString('zh-CN')}`);
  log('');

  // 统计信息
  const successCount = responses.filter(r => r.status >= 200 && r.status < 400).length;
  const errorCount = failedRequests.length + responses.filter(r => r.status >= 400).length;
  
  log('📊 请求统计:');
  log(`   总请求数: ${requests.length}`);
  log(`   成功响应: ${successCount} ✓`);
  log(`   失败请求: ${errorCount} ${errorCount > 0 ? '⚠️' : '✓'}`);
  log('');

  // 失败的请求
  if (failedRequests.length > 0) {
    log('❌ 完全失败的请求 (网络错误):');
    failedRequests.forEach(req => {
      log(`   [${req.method}] ${req.url}`);
      log(`       失败原因: ${req.failure?.errorText || '未知'}`);
    });
    log('');
  }

  // HTTP 错误状态码
  const errorResponses = responses.filter(r => r.status >= 400);
  if (errorResponses.length > 0) {
    log('⚠️  HTTP 错误状态码:');
    errorResponses.forEach(res => {
      log(`   [${res.status}] ${res.url}`);
    });
    log('');
  }

  // 按资源类型分类
  log('📁 按资源类型分类:');
  const typeGroups = {};
  requests.forEach(req => {
    const type = req.resourceType;
    typeGroups[type] = (typeGroups[type] || 0) + 1;
  });
  Object.entries(typeGroups).sort((a, b) => b[1] - a[1]).forEach(([type, count]) => {
    log(`   ${type.padEnd(15)}: ${count}`);
  });
  log('');

  // 慢请求（>1秒）
  const slowRequests = responses.filter(r => {
    if (r.timing && r.timing.responseEnd && r.timing.requestStart) {
      const duration = r.timing.responseEnd - r.timing.requestStart;
      return duration > 1000;
    }
    return false;
  });
  
  if (slowRequests.length > 0) {
    log('🐌 慢请求 (>1秒):');
    slowRequests.forEach(res => {
      const duration = Math.round(res.timing.responseEnd - res.timing.requestStart);
      log(`   [${duration}ms] ${res.url}`);
    });
    log('');
  }

  // 页面错误
  if (pageErrors.length > 0) {
    log('🚨 页面错误:');
    pageErrors.forEach(error => {
      log(`   ${error}`);
    });
    log('');
  }

  // 详细请求列表
  fileOutput += '\n========================================\n';
  fileOutput += '        详细请求列表\n';
  fileOutput += '========================================\n\n';
  
  responses.forEach((res) => {
    const req = requests.find(r => r.url === res.url);
    const statusIcon = res.status >= 200 && res.status < 300 ? '✓' : 
                       res.status >= 300 && res.status < 400 ? '↪' : '✗';
    
    fileOutput += `${statusIcon} [${res.status}] ${req?.method || 'GET'} ${res.url}\n`;
    fileOutput += `   类型: ${req?.resourceType || 'unknown'}\n`;
    fileOutput += `   缓存: ${res.fromCache ? '是' : '否'}\n`;
    if (res.timing && res.timing.responseEnd && res.timing.requestStart) {
      fileOutput += `   耗时: ${Math.round(res.timing.responseEnd - res.timing.requestStart)}ms\n`;
    }
    fileOutput += '\n';
  });

  // API 请求
  const apiRequests = responses.filter(r => r.url.includes('/api/'));
  if (apiRequests.length > 0) {
    log('🔌 API 请求:');
    apiRequests.forEach(res => {
      log(`   [${res.status}] ${res.url}`);
    });
    log('');
  }

  // 控制台日志（仅保存到文件）
  if (consoleLogs.length > 0) {
    fileOutput += '\n========================================\n';
    fileOutput += '        浏览器控制台日志\n';
    fileOutput += '========================================\n\n';
    consoleLogs.forEach(log => {
      fileOutput += log + '\n';
    });
  }

  log('========================================');
  log('           报告结束');
  log('========================================');

  return {
    console: consoleOutput,
    file: fileOutput
  };
}

checkNetworkRequests();
