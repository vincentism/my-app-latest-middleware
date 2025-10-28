/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

/**
 * 简化版JWT验证 - 适用于EdgeOne环境
 * 使用HMAC-SHA256签名，简化实现
 */

/**
 * 验证简化版JWT Token
 * @param {string} token - JWT token
 * @param {string} secret - JWT secret
 * @returns {Object|null} - 验证成功返回payload，失败返回null
 */
export async function verifyTokenSimple(token, secret) {
  try {
    console.log('🔍 开始验证简化版JWT Token');
    console.log('Token长度:', token.length);
    
    // 检查token格式
    if (!isValidTokenFormat(token)) {
      console.log('❌ Token格式无效');
      return null;
    }

    const parts = token.split('.');
    const header = JSON.parse(atob(parts[0]));
    const payload = JSON.parse(atob(parts[1]));
    const signature = parts[2];

    console.log('Token Header:', header);
    console.log('Token Payload:', payload);

    // 检查算法
    if (header.alg !== 'HS256') {
      console.log('❌ 不支持的算法:', header.alg);
      return null;
    }

    // 检查过期时间
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      console.log('❌ Token已过期');
      return null;
    }

    // 验证签名 (简化版)
    const message = parts[0] + '.' + parts[1];
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signatureBuffer = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(message)
    );

    const expectedSignature = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    if (signature !== expectedSignature) {
      console.log('❌ 签名验证失败');
      return null;
    }

    console.log('✅ Token验证成功');
    return payload;

  } catch (error) {
    console.log('❌ Token验证错误:', error.message);
    return null;
  }
}

/**
 * 创建简化版JWT Token
 * @param {Object} payload - Token payload
 * @param {string} secret - JWT secret
 * @param {Object} options - 选项
 * @returns {string} - JWT token
 */
export async function createTokenSimple(payload, secret, options = {}) {
  try {
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };

    const now = Math.floor(Date.now() / 1000);
    const tokenPayload = {
      ...payload,
      iat: now,
      exp: options.expiresIn ? now + options.expiresIn : now + 3600 // 默认1小时
    };

    const encoder = new TextEncoder();
    const encodedHeader = btoa(JSON.stringify(header)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    const encodedPayload = btoa(JSON.stringify(tokenPayload)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

    const message = encodedHeader + '.' + encodedPayload;
    
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signatureBuffer = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(message)
    );

    const signature = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    const token = message + '.' + signature;
    
    console.log('✅ Token创建成功');
    return token;

  } catch (error) {
    console.log('❌ Token创建错误:', error.message);
    throw error;
  }
}

/**
 * 检查Token格式是否有效
 */
function isValidTokenFormat(token) {
  if (!token || typeof token !== 'string') {
    return false;
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return false;
  }

  try {
    JSON.parse(atob(parts[0]));
    JSON.parse(atob(parts[1]));
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * 检查Token是否即将过期（5分钟内）
 */
export function isTokenExpiringSoon(token) {
  try {
    const parts = token.split('.');
    const payload = JSON.parse(atob(parts[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp && (payload.exp - now) < 300; // 5分钟内过期
  } catch (error) {
    return false;
  }
}

/**
 * Edge Function兼容的Token验证函数
 * @param {Request} request - 请求对象
 * @param {Object} env - 环境变量
 * @param {Object} options - 选项
 * @returns {Object} - 验证结果
 */
export async function verifyToken(request, env, options = {}) {
  try {
    console.log('🔍 Edge Function Token验证开始');
    
    const authHeader = request.headers.get('Authorization');
    console.log('Authorization 头:', authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ Authorization 头格式错误');
      return null;
    }

    const token = authHeader.split(' ')[1];
    console.log('Token 长度:', token.length);
    
    return await verifyTokenSimple(token, env.JWT_SECRET);
    
  } catch (error) {
    console.log('❌ Edge Function Token验证错误:', error.message);
    return null;
  }
}

/**
 * Edge Function兼容的Token创建函数
 * @param {Object} payload - Token payload
 * @param {Object} env - 环境变量
 * @param {Object} options - 选项
 * @returns {string} - JWT token
 */
export async function createToken(payload, env, options = {}) {
  try {
    console.log('🔍 Edge Function Token创建开始');
    
    if (!env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not set');
    }
    
    return await createTokenSimple(payload, env.JWT_SECRET, options);
    
  } catch (error) {
    console.log('❌ Edge Function Token创建错误:', error.message);
    throw error;
  }
}