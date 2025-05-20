import Router from '@koa/router';

export const loginRouter = new Router();

loginRouter.post('/login', async (ctx) => {
  const { email, password } = ctx.request.body as { email?: string; password?: string };
  if (!email || !password) {
    ctx.status = 400;
    ctx.body = { error: '参数错误' };
    return;
  }
  // 这里只做示例，实际应校验用户信息
  if (email === 'admin@example.com' && password === 'password123') {
    ctx.body = { message: '登录成功', token: 'mock-token' };
  } else {
    ctx.status = 401;
    ctx.body = { error: '邮箱或密码错误' };
  }
}); 