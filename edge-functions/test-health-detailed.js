/**
 * Detailed test for health endpoint and deployment status
 */

const testHealthEndpoint = async () => {
  console.log('🏥 Testing Health Endpoint: https://vpn-eo.oilpipe.xyz/api/health\n');

  try {
    const response = await fetch('https://vpn-eo.oilpipe.xyz/api/health', {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Health-Test-Script'
      }
    });

    console.log('📊 Response Status:', response.status, response.statusText);
    console.log('📋 Response Headers:');
    for (const [key, value] of response.headers.entries()) {
      console.log(`  ${key}: ${value}`);
    }

    const content = await response.text();
    const isJson = response.headers.get('content-type')?.includes('application/json');
    const isHtml = content.includes('<!DOCTYPE html>') || content.includes('<html');

    console.log('\n🔍 Content Analysis:');
    console.log(`Content-Type: ${response.headers.get('content-type')}`);
    console.log(`Content Length: ${content.length} characters`);
    console.log(`Is JSON: ${isJson}`);
    console.log(`Is HTML: ${isHtml}`);

    if (isJson) {
      console.log('✅ Health endpoint is working correctly (JSON response)');
      try {
        const data = JSON.parse(content);
        console.log('📄 Response Data:', JSON.stringify(data, null, 2));
      } catch (e) {
        console.log('❌ Invalid JSON response:', e.message);
      }
    } else if (isHtml) {
      console.log('❌ Health endpoint NOT working (HTML fallback)');
      console.log('ℹ️  This means the EdgeOne Function is not deployed');
      console.log('📄 First 200 characters of HTML:');
      console.log(content.substring(0, 200) + '...');
    } else {
      console.log('⚠️  Unknown response type');
      console.log('📄 Content:', content.substring(0, 200));
    }

    // Compare with expected health function output
    console.log('\n🔍 Expected vs Actual:');
    const expectedPattern = /"status":\s*"ok"/;
    const hasExpectedContent = expectedPattern.test(content);
    console.log(`Expected JSON with "status": "ok": ${hasExpectedContent}`);
    
    // Check if it's the main HTML page
    const isMainPage = content.includes('PrivaNet - Secure Browser Proxy');
    console.log(`Is main HTML page: ${isMainPage}`);

  } catch (error) {
    console.log('❌ Network Error:', error.message);
  }
};

const checkLocalHealthFunction = () => {
  console.log('\n📁 Checking Local Health Function File:');
  const fs = require('fs');
  const path = 'api/health.js';
  
  if (fs.existsSync(path)) {
    console.log('✅ Local health.js file exists');
    const content = fs.readFileSync(path, 'utf8');
    console.log('📄 Function exports onRequestGet:', content.includes('onRequestGet'));
    console.log('📄 Returns JSON response:', content.includes('application/json'));
    console.log('📄 Has status field:', content.includes('"status": "ok"'));
  } else {
    console.log('❌ Local health.js file not found');
  }
  
  const distPath = 'dist/functions/api/health.js';
  if (fs.existsSync(distPath)) {
    console.log('✅ Dist health.js file exists');
  } else {
    console.log('❌ Dist health.js file not found');
  }
};

// Run tests
testHealthEndpoint().then(() => {
  checkLocalHealthFunction();
});