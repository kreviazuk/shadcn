import { ProductTable } from "./components/product-table";
import type { Product } from "./types";
export function ProductPage() {
  // 定义产品数据
  const products: Product[] = [
    {
      id: 1,
      name: '产品1',
      price: 100,
      description: '产品1的描述',
    },
    {
      id: 2,
      name: '产品2',
      price: 200,
      description: '产品2的描述',
    },
    {
      id: 3,
      name: '产品3',
      price: 300,
      description: '产品3的描述',
    },
  ];
  return <div>
    <ProductTable products={products} />
  </div>;
}