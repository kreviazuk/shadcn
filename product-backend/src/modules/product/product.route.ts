import Router from '@koa/router';
import { PrismaClient, Prisma } from '../../../generated/prisma';
import { v4 as uuidv4 } from 'uuid'; // 用于生成 ID
import { Decimal } from '@prisma/client/runtime/library';

export const productRouter = new Router({ prefix: '/products' });
const prisma = new PrismaClient();

interface ProductRequestBody {
  name?: string;
  description?: string;
  price?: string | number; // 客户端可能发送字符串或数字
  sku?: string;
  stockQuantity?: number;
  category?: string;
}

// 新增产品
productRouter.post('/', async (ctx) => {
  const { name, description, price, sku, stockQuantity, category } = ctx.request.body as ProductRequestBody;

  if (!name || !sku || price === undefined || price === null) {
    ctx.status = 400;
    ctx.body = { error: '参数不完整，产品名称、SKU和价格为必填项' };
    return;
  }

  let priceDecimal: Decimal;
  try {
    priceDecimal = new Decimal(price.toString()); // 确保转换为字符串再构造 Decimal
    if (priceDecimal.isNaN() || !priceDecimal.isFinite() || priceDecimal.isNegative()) {
      throw new Error('无效的价格');
    }
  } catch (e) {
    ctx.status = 400;
    ctx.body = { error: '价格必须是一个有效的正数数字' };
    return;
  }
  
  const stockQty = stockQuantity === undefined ? 0 : Number(stockQuantity);
  if (isNaN(stockQty) || stockQty < 0 || !Number.isInteger(stockQty)) { // 确保存库是整数
    ctx.status = 400;
    ctx.body = { error: '库存数量必须是一个非负整数' };
    return;
  }

  try {
    const newProduct = await prisma.product.create({
      data: {
        id: uuidv4(),
        name,
        description: description || null,
        price: priceDecimal,
        sku,
        stockQuantity: stockQty,
        category: category || null,
      },
    });
    // 将 Decimal 转换为字符串以便 JSON 序列化和客户端展示
    ctx.status = 201;
    ctx.body = { ...newProduct, price: newProduct.price.toString() };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002' && error.meta && error.meta.target) {
        const targets = Array.isArray(error.meta.target) ? error.meta.target : [error.meta.target as string];
        if (targets.includes('sku')) {
          ctx.status = 409;
          ctx.body = { error: '该 SKU 已被使用' };
          return;
        }
      }
    }
    console.error('创建产品失败:', error);
    ctx.status = 500;
    ctx.body = { error: '创建产品失败' };
  }
});

// 获取产品列表
productRouter.get('/', async (ctx) => {
  const { page = '1', limit = '10', searchTerm, sortBy, sortOrder = 'asc' } = ctx.query as {
    page?: string;
    limit?: string;
    searchTerm?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  };

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);

  const where: Prisma.ProductWhereInput = {};
  if (searchTerm) {
    where.OR = [
      { name: { contains: searchTerm } }, 
      { sku: { contains: searchTerm } },
      { category: { contains: searchTerm } },
    ];
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput = {};
  const validSortByFields = ['id', 'name', 'price', 'sku', 'stockQuantity', 'category', 'createdAt', 'updatedAt'];
  if (sortBy && validSortByFields.includes(sortBy)) {
    orderBy[sortBy as keyof Prisma.ProductOrderByWithRelationInput] = sortOrder;
  } else if (sortBy) {
    console.warn(`无效的排序字段: ${sortBy}`); // 修正模板字符串
  }

  try {
    const products = await prisma.product.findMany({
      where,
      orderBy: Object.keys(orderBy).length > 0 ? orderBy : { createdAt: 'desc' },
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
    });

    const totalProducts = await prisma.product.count({ where });

    ctx.body = {
      data: products.map(p => ({ ...p, price: p.price.toString() })), // 转换 price
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(totalProducts / limitNum),
      totalItems: totalProducts,
    };
  } catch (error) {
    console.error('获取产品列表失败:', error);
    ctx.status = 500;
    ctx.body = { error: '获取产品列表失败' };
  }
});

// 获取单个产品
productRouter.get('/:id', async (ctx) => {
  const { id } = ctx.params;
  if (!id) {
    ctx.status = 400;
    ctx.body = { error: '产品 ID 不能为空' };
    return;
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      ctx.status = 404;
      ctx.body = { error: '未找到该产品' };
      return;
    }
    ctx.body = { ...product, price: product.price.toString() }; // 转换 price
  } catch (error) {
    console.error('获取单个产品失败:', error);
    ctx.status = 500;
    ctx.body = { error: '获取产品信息失败' };
  }
});

// 更新产品信息
productRouter.put('/:id', async (ctx) => {
  const { id } = ctx.params;
  const { name, description, price, sku, stockQuantity, category } = ctx.request.body as ProductRequestBody;

  if (!id) {
    ctx.status = 400;
    ctx.body = { error: '产品 ID 不能为空' };
    return;
  }
  
  if (name === undefined && description === undefined && price === undefined && sku === undefined && stockQuantity === undefined && category === undefined) {
    ctx.status = 400;
    ctx.body = { error: '没有提供任何需要更新的产品信息' };
    return;
  }

  const dataToUpdate: Prisma.ProductUpdateInput = {};
  if (name !== undefined) dataToUpdate.name = name;
  if (description !== undefined) dataToUpdate.description = description || null;
  if (sku !== undefined) dataToUpdate.sku = sku;
  if (category !== undefined) dataToUpdate.category = category || null;
  
  if (price !== undefined && price !== null) {
    try {
      const priceDecimal = new Decimal(price.toString());
      if (priceDecimal.isNaN() || !priceDecimal.isFinite() || priceDecimal.isNegative()) {
        throw new Error('无效的价格');
      }
      dataToUpdate.price = priceDecimal;
    } catch (e) {
      ctx.status = 400;
      ctx.body = { error: '价格必须是一个有效的正数数字' };
      return;
    }
  }

  if (stockQuantity !== undefined) {
    const stockQty = Number(stockQuantity);
    if (isNaN(stockQty) || stockQty < 0 || !Number.isInteger(stockQty)) {
      ctx.status = 400;
      ctx.body = { error: '库存数量必须是一个非负整数' };
      return;
    }
    dataToUpdate.stockQuantity = stockQty;
  }

  try {
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: dataToUpdate,
    });
    ctx.body = { ...updatedProduct, price: updatedProduct.price.toString() }; // 转换 price
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        ctx.status = 404;
        ctx.body = { error: '要更新的产品不存在' };
        return;
      }
      if (error.code === 'P2002' && error.meta && error.meta.target) {
        const targets = Array.isArray(error.meta.target) ? error.meta.target : [error.meta.target as string];
        if (targets.includes('sku')) {
          ctx.status = 409;
          ctx.body = { error: '该 SKU 已被其他产品使用' };
          return;
        }
      }
    }
    console.error('更新产品失败:', error);
    ctx.status = 500;
    ctx.body = { error: '更新产品信息失败' };
  }
});

// 删除产品
productRouter.delete('/:id', async (ctx) => {
  const { id } = ctx.params;
  if (!id) {
    ctx.status = 400;
    ctx.body = { error: '产品 ID 不能为空' };
    return;
  }

  try {
    await prisma.product.delete({
      where: { id },
    });
    ctx.status = 200;
    ctx.body = { message: '产品删除成功' };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        ctx.status = 404;
        ctx.body = { error: '要删除的产品不存在' };
        return;
      }
    }
    console.error('删除产品失败:', error);
    ctx.status = 500;
    ctx.body = { error: '删除产品失败' };
  }
}); 