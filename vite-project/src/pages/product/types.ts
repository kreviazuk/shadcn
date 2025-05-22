// 与 Prisma 模型对应的前端 Product 类型
import { z } from "zod";

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: string; // 后端已转换为字符串
  sku: string;
  stockQuantity: number;
  category: string | null;
  createdAt: string; // DateTime 通常作为 ISO 字符串传递
  updatedAt: string;
}

// 产品表单值，用于创建和编辑
// 注意：这里的 price 是 number | string，方便表单处理，提交到API时会转为 string
// 现在使用 z.infer 来自动生成这个类型，见文件末尾

// 表格列定义辅助类型
export type ProductSortKey = keyof Product | 'select' | 'actions'; // 包含特殊列

export interface ColumnDefinition {
  key: ProductSortKey;
  label: string;
  sortable?: boolean;
  className?: string;
}

// 模态框模式
export type ModalMode = 'add' | 'edit';

// 商品表单校验的 schema
export const productSchema = z.object({
  name: z.string().min(1, { message: '名称不能为空' }),
  description: z.string().optional(),
  price: z.number().min(0, { message: '价格不能为负' }),
  sku: z.string().min(1, { message: 'SKU不能为空' }),
  stockQuantity: z.number().min(0, { message: '库存不能为负' }),
  category: z.string().optional(),
});

// 根据 productSchema 推断出的商品表单值的类型
export type ProductFormValues = z.infer<typeof productSchema>;
