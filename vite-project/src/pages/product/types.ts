// 与 Prisma 模型对应的前端 Product 类型
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
export interface ProductFormValues {
  name: string;
  description?: string | null;
  price: number | string; 
  sku: string;
  stockQuantity?: number;
  category?: string | null;
}

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