// product-backend/src/modules/auth/auth.middleware.ts
import jwt from 'jsonwebtoken';
import Redis from 'ioredis';
import { Context, Next } from 'koa'; // 导入 Koa 类型

const JWT_SECRET = process.env.JWT_SECRET!;
const redis = new Redis(); // 默认本地6379

export async function authMiddleware(ctx: Context, next: Next) {
  const authHeader = ctx.headers.authorization;
  if (!authHeader) {
    ctx.status = 401;
    ctx.body = { error: '未登录' };
    return;
  }
  const token = authHeader.replace('Bearer ', '');
  try {
    console.log(`准备比较token`);
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
    // 查询 Redis
    let latestToken;
    try {
      latestToken = await redis.get(`user:token:${payload.userId}`);
      console.log(`[Auth] latestToken: ${latestToken}`);
      if (latestToken) {
        console.log(`[Auth] Successfully retrieved token from Redis for user ${payload.userId}. Retrieved token: ${latestToken}`);
      } else {
        console.warn(`[Auth] No token found in Redis for user ${payload.userId}. User might not be logged in or token expired from Redis.`);
      }
    } catch (redisError) {
      console.error(`[Auth] Failed to retrieve token from Redis for user ${payload.userId}:`, redisError);
      // 如果 Redis 读取失败，这本身就是一个问题，可能需要拒绝访问
      ctx.status = 500;
      ctx.body = { error: '会话服务暂时不可用' };
      return;
    }

    console.log(`[Auth] Comparing tokens for user ${payload.userId}:`);
    console.log(`[Auth] Token from request (OLD): ${token}`);
    console.log(`[Auth] Token from Redis (NEW): ${latestToken}`);

    if (token !== latestToken) {
      console.log(`[Auth] Token mismatch detected for user ${payload.userId}. Kicking out.`);
      ctx.status = 401;
      ctx.body = { error: '登录已过期，请重新登录' };
      return;
    }
    ctx.state.user = payload;
    await next();
  } catch (e) {
    ctx.status = 401;
    ctx.body = { error: '无效的 token' };
  }
}