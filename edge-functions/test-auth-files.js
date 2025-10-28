#!/usr/bin/env node

/**
 * Test authentication endpoints in /api/auth/
 */

const https = require('https');
const http = require('http');

// Configuration
const BASE_URL = 'https://vpn-eo.oilpipe.xyz';
const TIMEOUT = 10000;

// Test endpoints
const authEndpoints = [
  {
    name: 'Login (Web3)',
    path: '/api/auth/login',
    method: 'POST',
    testData: {
      message: "test_message",
      signature: "test_signature", 
      walletAddress: "0x1234567890123456789012345678901234567890"
    }
  },
  {
    name: 'Register',
    path: '/api/auth/register',
    method: 'POST',
    testData: {
      email: "test@example.com",
      password: "testpassword"
    }
  },
  {
    name: 'Google Redirect',
    path: '/api/auth/google/redirect',
    method: 'GET'
  },
  {
    name: 'Google Callback',
    path: '/api/auth/google/callback',
    method: 'GET'
  }
];

// Utility function to make HTTP request
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'EdgeOne-Auth-Test/1.0',
        ...options.headers
      },
      timeout: TIMEOUT,
      ...options
    };

    const req = client.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          statusText: res.statusMessage,
          headers: res.headers,
          data: data
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (options.body) {
      req.write(options.body);
    }

    req.end();
  });
}

// Test function
async function testAuthEndpoints() {
  console.log('🧪 Testing Authentication Endpoints');
  console.log('=====================================');
  console.log(`Base URL: ${BASE_URL}`);
  console.log('');

  const results = [];

  for (const endpoint of authEndpoints) {
    console.log(`🧪 Testing: ${endpoint.name}`);
    console.log(`📍 Path: ${endpoint.path}`);
    console.log(`🔧 Method: ${endpoint.method}`);

    try {
      const url = `${BASE_URL}${endpoint.path}`;
      const options = {
        method: endpoint.method,
        headers: {}
      };

      // Add test data for POST requests
      if (endpoint.method === 'POST' && endpoint.testData) {
        options.body = JSON.stringify(endpoint.testData);
      }

      // Add query parameters for GET requests that need them
      if (endpoint.method === 'GET' && endpoint.path.includes('callback')) {
        const callbackUrl = new URL(url);
        callbackUrl.searchParams.set('code', 'test_code');
        const response = await makeRequest(callbackUrl.toString(), options);
      } else {
        const response = await makeRequest(url, options);
      }

      const response = await makeRequest(url, options);
      
      console.log(`📊 Status: ${response.status} ${response.statusText}`);
      console.log(`📋 Content-Type: ${response.headers['content-type'] || 'unknown'}`);

      // Check if response is JSON or HTML
      const contentType = response.headers['content-type'] || '';
      const isJson = contentType.includes('application/json');
      const isHtml = contentType.includes('text/html');

      if (isJson) {
        console.log('✅ JSON Response - Function deployed');
        try {
          const jsonData = JSON.parse(response.data);
          console.log('📄 Response data:', JSON.stringify(jsonData, null, 2));
        } catch (e) {
          console.log('⚠️  Invalid JSON in response');
        }
      } else if (isHtml) {
        console.log('❌ HTML Response - Function not deployed (fallback)');
        const isErrorPage = response.data.includes('error') || response.data.includes('Error');
        if (isErrorPage) {
          console.log('⚠️  This appears to be an error page');
        }
        // Show first 100 characters of HTML
        console.log('📄 First 100 chars:', response.data.substring(0, 100).replace(/\n/g, ' '));
      } else {
        console.log('⚠️  Unknown response type');
        console.log('📄 First 100 chars:', response.data.substring(0, 100).replace(/\n/g, ' '));
      }

      results.push({
        name: endpoint.name,
        path: endpoint.path,
        method: endpoint.method,
        status: response.status,
        contentType: contentType,
        isJson: isJson,
        isHtml: isHtml,
        success: isJson && response.status < 400
      });

    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
      results.push({
        name: endpoint.name,
        path: endpoint.path,
        method: endpoint.method,
        error: error.message,
        success: false
      });
    }

    console.log('--------------------------------------------------');
    console.log('');
  }

  // Summary
  console.log('📊 Test Summary');
  console.log('================');
  
  const successfulTests = results.filter(r => r.success);
  const failedTests = results.filter(r => !r.success);
  
  console.log(`✅ Successful: ${successfulTests.length}`);
  console.log(`❌ Failed: ${failedTests.length}`);
  console.log(`📈 Success Rate: ${Math.round((successfulTests.length / results.length) * 100)}%`);
  console.log('');

  if (failedTests.length > 0) {
    console.log('❌ Failed Tests:');
    failedTests.forEach(test => {
      console.log(`  - ${test.name} (${test.path}): ${test.error || 'HTML fallback'}`);
    });
    console.log('');
  }

  if (successfulTests.length > 0) {
    console.log('✅ Working Tests:');
    successfulTests.forEach(test => {
      console.log(`  - ${test.name} (${test.path}): Status ${test.status}`);
    });
    console.log('');
  }

  // Check local files
  console.log('📁 Local Auth Files Check:');
  console.log('Note: These functions exist locally but deployment status unknown');
  console.log('');
}

// Run tests
testAuthEndpoints().catch(console.error);