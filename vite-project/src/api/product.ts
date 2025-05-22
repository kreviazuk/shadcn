import { apiFetch } from '@/lib/request';
import type { Product } from '@/pages/product/types'; // 路径假设，后续会创建

export interface GetProductsParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sortBy?: string; // 后端接受字符串，如 'name', 'price'
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedProductsResponse {
  data: Product[];
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
}

// 在 Prisma schema 中，price 是 Decimal。后端API返回时已将其转为 string。
// 前端接收到的 Product 类型定义中，price 应该是 string，以便直接显示。
// ProductFormValues 中 price 可以是 number | string，方便表单输入和验证。
export interface ProductFormValues {
  name: string;
  description?: string | null;
  price: number | string; 
  sku: string;
  stockQuantity?: number;
  category?: string | null;
}

// 获取产品列表
export function getProducts(params: GetProductsParams = {}): Promise<PaginatedProductsResponse> {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm);
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
  
  return apiFetch<PaginatedProductsResponse>(`/api/products?${queryParams.toString()}`);
}

// 获取单个产品
export function getProduct(id: string): Promise<Product> {
  return apiFetch<Product>(`/api/products/${id}`);
}

// 创建产品
export function createProduct(data: ProductFormValues): Promise<Product> {
  const payload = {
    ...data,
    price: data.price.toString(), // 确保价格是字符串，以便后端 Decimal 正确构造
    stockQuantity: data.stockQuantity === undefined || data.stockQuantity === null || data.stockQuantity < 0 
                     ? 0 
                     : Number(data.stockQuantity),
  };
  return apiFetch<Product>('/api/products', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// 更新产品
export function updateProduct(id: string, data: Partial<ProductFormValues>): Promise<Product> {
  const payload: Partial<ProductFormValues> = { ...data };
  if (data.price !== undefined) {
    payload.price = data.price.toString();
  }
  if (data.stockQuantity !== undefined && data.stockQuantity !== null) {
    payload.stockQuantity = Number(data.stockQuantity) < 0 ? 0 : Number(data.stockQuantity);
  } else if (data.stockQuantity === null) {
    payload.stockQuantity = 0;
  }
  return apiFetch<Product>(`/api/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

// 删除产品
export function deleteProduct(id: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/api/products/${id}`, {
    method: 'DELETE',
  });
} 