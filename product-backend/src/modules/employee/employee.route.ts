import Router from '@koa/router';
import { PrismaClient, Prisma } from '../../../generated/prisma';
import { v4 as uuidv4 } from 'uuid'; // 用于生成 ID

export const employeeRouter = new Router({ prefix: '/employees' });
const prisma = new PrismaClient();

// 类型定义 (基于前端 Employee 类型)
interface EmployeeRequestBody {
  name?: string;
  email?: string;
  department?: string;
  title?: string;
  status?: 'active' | 'inactive';
}

// 新增员工
employeeRouter.post('/', async (ctx) => {
  const { name, email, department, title, status } = ctx.request.body as EmployeeRequestBody;

  if (!name || !email || !department || !title || !status) {
    ctx.status = 400;
    ctx.body = { error: '参数不完整，姓名、邮箱、部门、职位和状态均为必填项' };
    return;
  }

  if (!['active', 'inactive'].includes(status)) {
    ctx.status = 400;
    ctx.body = { error: '无效的状态值，必须是 active 或 inactive' };
    return;
  }

  try {
    const newEmployee = await prisma.employee.create({
      data: {
        id: uuidv4(),
        name,
        email,
        department,
        title,
        status,
      },
    });
    ctx.status = 201;
    ctx.body = newEmployee;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002' && error.meta && error.meta.target) {
        const targets = Array.isArray(error.meta.target) ? error.meta.target : [error.meta.target as string];
        if (targets.includes('email')) {
          ctx.status = 409; // Conflict
          ctx.body = { error: '该邮箱已被使用' };
          return;
        }
      }
    }
    console.error('创建员工失败:', error);
    ctx.status = 500;
    ctx.body = { error: '创建员工失败' };
  }
});

// 获取员工列表 (支持分页和筛选)
employeeRouter.get('/', async (ctx) => {
  const { page = '1', limit = '10', searchTerm, sortBy, sortOrder = 'asc' } = ctx.query as {
    page?: string;
    limit?: string;
    searchTerm?: string;
    sortBy?: string; // 例如 'name', 'email'
    sortOrder?: 'asc' | 'desc';
  };

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);

  const where: Prisma.EmployeeWhereInput = {};
  if (searchTerm) {
    where.OR = [
      { name: { contains: searchTerm } },
      { email: { contains: searchTerm } },
      { department: { contains: searchTerm } },
      { title: { contains: searchTerm } },
    ];
  }

  const orderBy: Prisma.EmployeeOrderByWithRelationInput = {};
  if (sortBy && ['id', 'name', 'email', 'department', 'title', 'status'].includes(sortBy)) {
    orderBy[sortBy as keyof Prisma.EmployeeOrderByWithRelationInput] = sortOrder;
  }

  try {
    const employees = await prisma.employee.findMany({
      where,
      orderBy,
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
    });

    const totalEmployees = await prisma.employee.count({ where });

    ctx.body = {
      data: employees,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(totalEmployees / limitNum),
      totalItems: totalEmployees,
    };
  } catch (error) {
    console.error('获取员工列表失败:', error);
    ctx.status = 500;
    ctx.body = { error: '获取员工列表失败' };
  }
});

// 获取单个员工
employeeRouter.get('/:id', async (ctx) => {
  const { id } = ctx.params;
  if (!id) {
    ctx.status = 400;
    ctx.body = { error: '员工 ID 不能为空' };
    return;
  }

  try {
    const employee = await prisma.employee.findUnique({
      where: { id },
    });

    if (!employee) {
      ctx.status = 404;
      ctx.body = { error: '未找到该员工' };
      return;
    }
    ctx.body = employee;
  } catch (error) {
    console.error('获取单个员工失败:', error);
    ctx.status = 500;
    ctx.body = { error: '获取员工信息失败' };
  }
});

// 更新员工信息
employeeRouter.put('/:id', async (ctx) => {
  const { id } = ctx.params;
  const { name, email, department, title, status } = ctx.request.body as EmployeeRequestBody;

  if (!id) {
    ctx.status = 400;
    ctx.body = { error: '员工 ID 不能为空' };
    return;
  }

  if (status && !['active', 'inactive'].includes(status)) {
    ctx.status = 400;
    ctx.body = { error: '无效的状态值，必须是 active 或 inactive' };
    return;
  }

  // 至少需要一个待更新的字段
  if (!name && !email && !department && !title && !status) {
    ctx.status = 400;
    ctx.body = { error: '没有提供任何需要更新的员工信息' };
    return;
  }

  const dataToUpdate: Prisma.EmployeeUpdateInput = {};
  if (name) dataToUpdate.name = name;
  if (email) dataToUpdate.email = email;
  if (department) dataToUpdate.department = department;
  if (title) dataToUpdate.title = title;
  if (status) dataToUpdate.status = status;

  try {
    const updatedEmployee = await prisma.employee.update({
      where: { id },
      data: dataToUpdate,
    });
    ctx.body = updatedEmployee;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') { // 未找到记录
        ctx.status = 404;
        ctx.body = { error: '要更新的员工不存在' };
        return;
      }
      if (error.code === 'P2002' && error.meta && error.meta.target) {
        const targets = Array.isArray(error.meta.target) ? error.meta.target : [error.meta.target as string];
        if (targets.includes('email')) {
          ctx.status = 409; // Conflict
          ctx.body = { error: '该邮箱已被其他员工使用' };
          return;
        }
      }
    }
    console.error('更新员工失败:', error);
    ctx.status = 500;
    ctx.body = { error: '更新员工信息失败' };
  }
});

// 删除员工
employeeRouter.delete('/:id', async (ctx) => {
  const { id } = ctx.params;
  if (!id) {
    ctx.status = 400;
    ctx.body = { error: '员工 ID 不能为空' };
    return;
  }

  try {
    await prisma.employee.delete({
      where: { id },
    });
    ctx.status = 200;
    ctx.body = { message: '员工删除成功' };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') { // Record to delete does not exist.
        ctx.status = 404;
        ctx.body = { error: '要删除的员工不存在' };
        return;
      }
    }
    console.error('删除员工失败:', error);
    ctx.status = 500;
    ctx.body = { error: '删除员工失败' };
  }
}); 