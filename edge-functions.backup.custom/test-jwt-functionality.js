/**
 * JWT功能测试脚本
 * 测试简化版JWT的创建和验证功能
 */

import { createTokenSimple, verifyTokenSimple } from './lib/auth-simple.js';

async function testJWTFunctionality() {
  console.log('🔐 开始JWT功能测试...\n');
  
  const testSecret = 'test-secret-key';
  const testPayload = {
    sub: 'test@privanet.com',
    email: 'test@privanet.com',
    exp: Math.floor(Date.now() / 1000) + 3600 // 1小时后过期
  };
  
  try {
    // 测试1: 创建token
    console.log('🧪 测试1: 创建JWT Token');
    const token = await createTokenSimple(testPayload, testSecret);
    console.log(`✅ Token创建成功: ${token}`);
    console.log(`📊 Token长度: ${token.length}`);
    
    // 测试2: 验证token
    console.log('\n🧪 测试2: 验证JWT Token');
    const verifiedPayload = await verifyTokenSimple(token, testSecret);
    if (verifiedPayload) {
      console.log('✅ Token验证成功');
      console.log('📋 Payload:', JSON.stringify(verifiedPayload, null, 2));
    } else {
      console.log('❌ Token验证失败');
    }
    
    // 测试3: 验证过期token
    console.log('\n🧪 测试3: 验证过期Token');
    const expiredPayload = {
      sub: 'expired@privanet.com',
      exp: Math.floor(Date.now() / 1000) - 3600 // 1小时前过期
    };
    const expiredToken = await createTokenSimple(expiredPayload, testSecret);
    const expiredResult = await verifyTokenSimple(expiredToken, testSecret);
    if (expiredResult) {
      console.log('⚠️  过期token验证通过（意外）');
    } else {
      console.log('✅ 过期token正确被拒绝');
    }
    
    // 测试4: 验证无效token
    console.log('\n🧪 测试4: 验证无效Token');
    const invalidResults = await Promise.all([
      verifyTokenSimple('invalid-token', testSecret),
      verifyTokenSimple('header.payload.invalid-sig', testSecret),
      verifyTokenSimple('invalid', testSecret)
    ]);
    
    const allInvalid = invalidResults.every(result => result === null);
    if (allInvalid) {
      console.log('✅ 所有无效token都被正确拒绝');
    } else {
      console.log('⚠️  某些无效token被错误接受');
    }
    
    // 测试5: 使用测试脚本中的token
    console.log('\n🧪 测试5: 验证测试脚本中的Token');
    const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0QHByaXZhbmV0LmNvbSIsImVtYWlsIjoidGVzdEBwcml2YW5ldC5jb20iLCJleHAiOjE3MzU2ODAwMDB9.test-signature';
    const testResult = await verifyTokenSimple(testToken, testSecret);
    if (testResult) {
      console.log('✅ 测试脚本token验证成功');
    } else {
      console.log('❌ 测试脚本token验证失败');
      console.log('🔍 可能原因: token格式不正确或签名不匹配');
    }
    
    console.log('\n🎯 JWT功能测试完成！');
    
  } catch (error) {
    console.error('❌ JWT测试失败:', error);
  }
}

// 运行测试
testJWTFunctionality().catch(console.error);