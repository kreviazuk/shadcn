// product-backend/src/modules/auth/auth.middleware.ts
import jwt from 'jsonwebtoken';
import Redis from 'ioredis';

const JWT_SECRET = process.env.JWT_SECRET!;
const redis = new Redis(); // 默认本地6379

export async function authMiddleware(ctx, next) {
  const authHeader = ctx.headers.authorization;
  if (!authHeader) {
    ctx.status = 401;
    ctx.body = { error: '未登录' };
    return;
  }
  const token = authHeader.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
    // 查询 Redis
    const latestToken = await redis.get(`user:token:${payload.userId}`);
    if (token !== latestToken) {
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