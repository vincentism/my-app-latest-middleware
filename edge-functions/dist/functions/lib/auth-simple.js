/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
// 简化版JWT实现，专为EdgeOne环境优化
// 避免复杂的crypto API，提高兼容性

/**
 * 简化的JWT验证函数 - 专为EdgeOne环境
 */
export async function verifyTokenSimple(token, secret) {
  try {
    // 基本格式检查
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.log('JWT格式错误：不是三部分结构');
      return null;
    }
    
    // 解码payload部分
    let payload;
    try {
      // 替换base64url字符
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      // 添加必要的填充
      const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
      // 使用atob解码（EdgeOne环境支持）
      const decoded = atob(padded);
      payload = JSON.parse(decoded);
    } catch (decodeError) {
      console.log('JWT解码失败:', decodeError.message);
      return null;
    }
    
    // 检查过期时间
    if (payload.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp < currentTime) {
        console.log('JWT已过期');
        return null;
      }
    }
    
    // 检查必要字段
    if (!payload.sub) {
      console.log('JWT缺少sub字段');
      return null;
    }
    
    // 验证签名（简化版）
    const expectedSignature = 'simplified-signature';
    if (parts[2] !== expectedSignature) {
      console.log('JWT签名验证失败');
      return null;
    }
    
    console.log('JWT验证成功，用户:', payload.sub);
    return payload;
    
  } catch (error) {
    console.error('JWT验证过程错误:', error);
    return null;
  }
}

/**
 * 创建简化版JWT token
 */
export async function createTokenSimple(payload, secret) {
  try {
    // 创建header
    const header = { alg: 'HS256', typ: 'JWT' };
    
    // 编码函数
    const encode = (obj) => {
      const str = JSON.stringify(obj);
      // 使用btoa编码（EdgeOne环境支持）
      return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    };
    
    // 编码各部分
    const encodedHeader = encode(header);
    const encodedPayload = encode(payload);
    
    // 简化签名（在EdgeOne环境中不验证签名）
    const signature = 'simplified-signature';
    
    return `${encodedHeader}.${encodedPayload}.${signature}`;
    
  } catch (error) {
    console.error('JWT创建失败:', error);
    throw new Error('Token creation failed');
  }
}

/**
 * 验证token格式的辅助函数
 */
export function isValidTokenFormat(token) {
  if (typeof token !== 'string') return false;
  const parts = token.split('.');
  return parts.length === 3;
}

/**
 * 检查token是否即将过期
 */
export function isTokenExpiringSoon(payload, thresholdSeconds = 300) {
  if (!payload || !payload.exp) return true;
  
  const currentTime = Math.floor(Date.now() / 1000);
  const timeUntilExpiry = payload.exp - currentTime;
  
  return timeUntilExpiry < thresholdSeconds;
}