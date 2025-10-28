/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { errorResponse } from './utils.js';
import { verifyTokenSimple } from './auth-simple.js';

export function requireAuth(handler, options = {}) {
  return async function(context) {
    try {
      console.log('🔐 认证中间件开始执行');
      
      const { JWT_SECRET } = context.env;
      console.log('JWT_SECRET 配置状态:', !!JWT_SECRET);
      
      if (!JWT_SECRET) {
        console.error('❌ JWT_SECRET 未配置');
        return errorResponse("JWT_SECRET environment variable is not set.", 500);
      }
      
      const authHeader = context.request.headers.get('Authorization');
      console.log('Authorization 头:', authHeader);
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('❌ Authorization 头格式错误');
        
        // 如果允许降级，使用测试用户
        if (options.allowFallback) {
          console.log('🔄 使用降级模式 - 测试用户');
          context.user = { 
            sub: 'test@privanet.com', 
            email: 'test@privanet.com',
            fallback: true 
          };
          return handler(context);
        }
        
        return errorResponse('Authorization header is missing or invalid', 401);
      }

      const token = authHeader.split(' ')[1];
      console.log('Token 长度:', token.length);
      console.log('Token 前20字符:', token.substring(0, 20) + '...');
      
      // 使用简化版JWT验证
      const payload = await verifyTokenSimple(token, JWT_SECRET);
      console.log('Token 验证结果:', !!payload);
      
      if (!payload) {
        console.log('❌ Token 验证失败');
        
        // 如果允许降级，使用测试用户
        if (options.allowFallback) {
          console.log('🔄 使用降级模式 - 测试用户');
          context.user = { 
            sub: 'test@privanet.com', 
            email: 'test@privanet.com',
            fallback: true 
          };
          return handler(context);
        }
        
        return errorResponse('Invalid or expired token', 401);
      }
      
      console.log('✅ Token 验证成功，用户:', payload.sub);
      
      // Attach user payload to the context for the handler to use
      context.user = payload; 
      
      // 继续处理请求
      console.log('🚀 调用处理器...');
      const result = await handler(context);
      console.log('✅ 处理器执行完成');
      return result;
      
    } catch (error) {
      console.error("💥 认证中间件错误:", error.message);
      console.error("错误堆栈:", error.stack);
      
      // 如果允许降级，返回测试用户
      if (options.allowFallback) {
        console.log('🔄 使用降级模式 - 测试用户');
        context.user = { 
          sub: 'test@privanet.com', 
          email: 'test@privanet.com',
          fallback: true 
        };
        return handler(context);
      }
      
      return errorResponse(`Authentication error: ${error.message}`, 500);
    }
  };
}

/**
 * 带降级功能的认证中间件
 */
export function requireAuthWithFallback(handler) {
  return requireAuth(handler, { allowFallback: true });
}
