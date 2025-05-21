import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import { PrismaClient } from '../generated/prisma';
import { loginRouter } from './modules/auth/login.route';
import cors from 'koa2-cors';

const app = new Koa();
const router = new Router();
const prisma = new PrismaClient();

// 注册登录模块路由
router.use(loginRouter.routes());

app.use(cors({
  origin: 'http://localhost:5173', // 只允许前端本地开发端口访问
  credentials: true, // 如果需要支持 cookie
}));
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  // 服务启动
}); 