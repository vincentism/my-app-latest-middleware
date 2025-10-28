import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Check deployment status and provide recommendations
async function checkDeploymentStatus() {
  console.log('🔍 Checking EdgeOne Functions Deployment Status...\n');
  
  // Check if edgeone.json exists and is valid
  try {
    const fs = require('fs');
    const edgeoneConfig = JSON.parse(fs.readFileSync('./edgeone.json', 'utf8'));
    console.log('✅ edgeone.json found and valid');
    console.log(`📊 Found ${edgeoneConfig.functions.length} functions configured`);
    
    // List configured functions
    edgeoneConfig.functions.forEach(func => {
      console.log(`   - ${func.name}: ${func.method} ${func.path} → ${func.entry}`);
    });
    
  } catch (error) {
    console.log('❌ edgeone.json error:', error.message);
    return;
  }
  
  // Check if function files exist
  console.log('\n📁 Checking function files...');
  const functionFiles = [
    'api/subscription/status.js',
    'api/proxy/nodes.js',
    'api/proxy/auth.js',
    'api/payment/create-checkout.js',
    'api/payment/webhook.js'
  ];
  
  let filesExist = 0;
  functionFiles.forEach(file => {
    try {
      require('fs').accessSync(file);
      console.log(`✅ ${file} exists`);
      filesExist++;
    } catch (error) {
      console.log(`❌ ${file} not found`);
    }
  });
  
  console.log(`\n📊 Files check: ${filesExist}/${functionFiles.length} files exist`);
  
  // Test local function execution
  console.log('\n🧪 Testing local function execution...');
  try {
    const subscriptionModule = await import('./api/subscription/status.js');
    if (subscriptionModule.default && typeof subscriptionModule.default.fetch === 'function') {
      console.log('✅ Subscription status function structure is correct');
    } else {
      console.log('❌ Subscription status function structure is incorrect');
    }
  } catch (error) {
    console.log('❌ Subscription status function error:', error.message);
  }
  
  // Check deployment recommendations
  console.log('\n💡 Deployment Recommendations:');
  console.log('1. Ensure edgeone.json is in the root of your deployment');
  console.log('2. Verify all function files exist in the correct paths');
  console.log('3. Check EdgeOne Pages deployment logs for errors');
  console.log('4. Ensure functions are exported as default with fetch method');
  console.log('5. Verify environment variables are set in EdgeOne dashboard');
  
  console.log('\n🔧 Next Steps:');
  console.log('1. Check EdgeOne Pages deployment settings');
  console.log('2. Verify function routing configuration');
  console.log('3. Test with EdgeOne CLI if available');
  console.log('4. Check EdgeOne dashboard for function deployment status');
  
  // Test a simple function call to verify structure
  console.log('\n🎯 Final Verification Test:');
  try {
    const mockEnv = { MY_KV: new Map() };
    const mockRequest = new Request('https://example.com/api/test', {
      method: 'GET',
      headers: {}
    });
    
    const subscriptionModule = await import('./api/subscription/status.js');
    const response = await subscriptionModule.default.fetch(mockRequest, mockEnv);
    
    console.log('✅ Function executes without errors');
    console.log(`📊 Response status: ${response.status}`);
    
    const data = await response.json();
    console.log('✅ Function returns JSON response');
    console.log('📄 Response data:', data);
    
  } catch (error) {
    console.log('❌ Function execution failed:', error.message);
  }
  
  console.log('\n🎉 Deployment status check completed!');
}

// Run the check
checkDeploymentStatus().catch(console.error);