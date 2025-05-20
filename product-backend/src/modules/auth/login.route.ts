import Router from '@koa/router';
import { PrismaClient } from '../../../generated/prisma';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const loginRouter = new Router();
const prisma = new PrismaClient();

// 存储验证码（生产建议用 Redis 或数据库）
const codeStore = new Map<string, string>();

const JWT_SECRET = process.env.JWT_SECRET;

// 注册接口
loginRouter.post('/register', async (ctx) => {
  const { email, password } = ctx.request.body as { email?: string; password?: string };
  if (!email || !password) {
    ctx.status = 400;
    ctx.body = { error: '参数错误' };
    return;
  }
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    ctx.status = 409;
    ctx.body = { error: '邮箱已被注册' };
    return;
  }
  const user = await prisma.user.create({
    data: { email, password },
  });
  ctx.body = { message: '注册成功', userId: user.id };
});

// 登录接口
loginRouter.post('/login', async (ctx) => {
  const { email, password } = ctx.request.body as { email?: string; password?: string };
  if (!email || !password) {
    ctx.status = 400;
    ctx.body = { error: '参数错误' };
    return;
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.password !== password) {
    ctx.status = 401;
    ctx.body = { error: '邮箱或密码错误' };
    return;
  }
  if (!JWT_SECRET) {
    ctx.status = 500;
    ctx.body = { error: 'JWT_SECRET 未配置' };
    return;
  }
  // 生成 JWT token
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' } // token 有效期7天
  );
  ctx.body = { message: '登录成功', token };
});

loginRouter.post('/send-code', async (ctx) => {
  const { email } = ctx.request.body as { email?: string };
  if (!email) {
    ctx.status = 400;
    ctx.body = { error: '邮箱不能为空' };
    return;
  }
  // 生成6位验证码
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  codeStore.set(email, code);

  // 发送邮件（请配置你的邮箱服务）
  const transporter = nodemailer.createTransport({
    service: 'qq', // 如 'qq', 'gmail'
    auth: {
      user: '940025541@qq.com',
      pass: 'njskmqcmcsosbcjj',
    },
  });

  await transporter.sendMail({
    from: '940025541@qq.com',
    to: email,
    subject: '验证码',
    text: `您的验证码是：${code}`,
  });

  ctx.body = { message: '验证码已发送' };
}); 