import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import { PrismaClient } from '../generated/prisma';
import { loginRouter } from './modules/auth/login.route';

const app = new Koa();
const router = new Router();
const prisma = new PrismaClient();

// 注册登录模块路由
router.use(loginRouter.routes());

router.get('/products', async (ctx) => {
  const products = await prisma.product.findMany();
  ctx.body = products;
});

router.get('/products/:id', async (ctx) => {
  const id = Number(ctx.params.id);
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    ctx.status = 404;
    ctx.body = { error: '未找到商品' };
    return;
  }
  ctx.body = product;
});

router.post('/products', async (ctx) => {
  const { name, price } = ctx.request.body as { name: string; price: number };
  if (!name || typeof price !== 'number') {
    ctx.status = 400;
    ctx.body = { error: '参数错误' };
    return;
  }
  const product = await prisma.product.create({ data: { name, price } });
  ctx.body = product;
});

router.put('/products/:id', async (ctx) => {
  const id = Number(ctx.params.id);
  const { name, price } = ctx.request.body as { name?: string; price?: number };
  try {
    const product = await prisma.product.update({
      where: { id },
      data: { name, price },
    });
    ctx.body = product;
  } catch {
    ctx.status = 404;
    ctx.body = { error: '未找到商品' };
  }
});

router.delete('/products/:id', async (ctx) => {
  const id = Number(ctx.params.id);
  try {
    await prisma.product.delete({ where: { id } });
    ctx.status = 204;
  } catch {
    ctx.status = 404;
    ctx.body = { error: '未找到商品' };
  }
});

app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  // 服务启动
}); 