const { chromium } = require('playwright');
const fs = require('fs');

async function checkAllPages() {
  console.log('🚀 启动完整的网络测试...\n');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  
  const pagesToTest = [
    { url: 'http://localhost:8088/', name: '首页' },
    { url: 'http://localhost:8088/auth', name: '认证页面' },
    { url: 'http://localhost:8088/home', name: '主页' },
    { url: 'http://localhost:8088/en', name: '英文页面' },
    { url: 'http://localhost:8088/zh', name: '中文页面' },
  ];

  const allResults = [];

  for (const pageInfo of pagesToTest) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📄 测试页面: ${pageInfo.name} (${pageInfo.url})`);
    console.log('='.repeat(60));
    
    const result = await testPage(context, pageInfo.url, pageInfo.name);
    allResults.push(result);
    
    // 打印简要结果
    console.log(`\n✓ 请求总数: ${result.requests.length}`);
    console.log(`✓ 成功: ${result.successCount}`);
    if (result.errorCount > 0) {
      console.log(`⚠️  失败: ${result.errorCount}`);
    }
    if (result.errors.length > 0) {
      console.log('\n❌ 错误详情:');
      result.errors.forEach(err => {
        console.log(`   ${err}`);
      });
    }
  }

  // 生成汇总报告
  const summaryReport = generateSummaryReport(allResults);
  console.log('\n' + summaryReport);
  
  // 保存详细报告
  fs.writeFileSync('network-test-full-report.txt', summaryReport);
  console.log('\n💾 完整报告已保存到: network-test-full-report.txt\n');

  await browser.close();
}

async function testPage(context, url, name) {
  const page = await context.newPage();
  
  const requests = [];
  const responses = [];
  const failedRequests = [];
  const consoleLogs = [];
  const pageErrors = [];

  page.on('request', request => {
    requests.push({
      url: request.url(),
      method: request.method(),
      resourceType: request.resourceType(),
    });
  });

  page.on('response', async response => {
    try {
      responses.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText(),
        fromCache: response.fromCache,
      });
    } catch (e) {
      // 忽略
    }
  });

  page.on('requestfailed', request => {
    failedRequests.push({
      url: request.url(),
      method: request.method(),
      failure: request.failure(),
    });
  });

  page.on('console', msg => {
    consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
  });

  page.on('pageerror', error => {
    pageErrors.push(error.message);
  });

  try {
    await page.goto(url, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    await page.waitForTimeout(2000);

    const errorResponses = responses.filter(r => r.status >= 400);
    const errors = [
      ...failedRequests.map(r => `[网络错误] ${r.method} ${r.url} - ${r.failure?.errorText}`),
      ...errorResponses.map(r => `[HTTP ${r.status}] ${r.url}`),
      ...pageErrors.map(e => `[页面错误] ${e}`)
    ];

    await page.close();

    return {
      name,
      url,
      requests,
      responses,
      failedRequests,
      errorResponses,
      consoleLogs,
      pageErrors,
      errors,
      successCount: responses.filter(r => r.status >= 200 && r.status < 400).length,
      errorCount: failedRequests.length + errorResponses.length + pageErrors.length
    };
  } catch (error) {
    await page.close();
    return {
      name,
      url,
      requests,
      responses,
      failedRequests,
      errorResponses: [],
      consoleLogs,
      pageErrors: [error.message],
      errors: [`[访问失败] ${error.message}`],
      successCount: 0,
      errorCount: 1
    };
  }
}

function generateSummaryReport(results) {
  let report = '';
  
  report += '\n' + '='.repeat(70) + '\n';
  report += '                    完整网络测试报告\n';
  report += '='.repeat(70) + '\n\n';
  report += `⏰ 测试时间: ${new Date().toLocaleString('zh-CN')}\n\n`;

  // 总体统计
  const totalRequests = results.reduce((sum, r) => sum + r.requests.length, 0);
  const totalSuccess = results.reduce((sum, r) => sum + r.successCount, 0);
  const totalErrors = results.reduce((sum, r) => sum + r.errorCount, 0);

  report += '📊 总体统计:\n';
  report += `   测试页面数: ${results.length}\n`;
  report += `   总请求数: ${totalRequests}\n`;
  report += `   成功请求: ${totalSuccess} ✓\n`;
  report += `   失败请求: ${totalErrors} ${totalErrors > 0 ? '⚠️' : '✓'}\n\n`;

  // 各页面详情
  results.forEach(result => {
    report += '-'.repeat(70) + '\n';
    report += `📄 ${result.name}\n`;
    report += `   URL: ${result.url}\n`;
    report += `   请求数: ${result.requests.length}\n`;
    report += `   成功: ${result.successCount}\n`;
    report += `   失败: ${result.errorCount}\n`;

    if (result.errors.length > 0) {
      report += '\n   ❌ 错误:\n';
      result.errors.forEach(err => {
        report += `      ${err}\n`;
      });
    }

    // 资源类型统计
    const typeGroups = {};
    result.requests.forEach(req => {
      typeGroups[req.resourceType] = (typeGroups[req.resourceType] || 0) + 1;
    });
    report += '\n   📁 资源类型:\n';
    Object.entries(typeGroups).sort((a, b) => b[1] - a[1]).forEach(([type, count]) => {
      report += `      ${type.padEnd(12)}: ${count}\n`;
    });

    // 详细请求列表
    report += '\n   📋 所有请求:\n';
    result.responses.forEach(res => {
      const statusIcon = res.status >= 200 && res.status < 300 ? '✓' : 
                         res.status >= 300 && res.status < 400 ? '↪' : '✗';
      report += `      ${statusIcon} [${res.status}] ${res.url}\n`;
    });

    // 控制台警告和错误
    const warnings = result.consoleLogs.filter(log => 
      log.includes('[warning]') || log.includes('[error]')
    );
    if (warnings.length > 0) {
      report += '\n   ⚠️  控制台警告/错误:\n';
      warnings.forEach(log => {
        report += `      ${log.substring(0, 100)}${log.length > 100 ? '...' : ''}\n`;
      });
    }

    report += '\n';
  });

  report += '='.repeat(70) + '\n';
  report += '                      报告结束\n';
  report += '='.repeat(70) + '\n';

  return report;
}

checkAllPages().catch(console.error);
