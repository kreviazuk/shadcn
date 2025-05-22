import { ProductTable } from "./components/product-table";
import type { Product } from "./types";
import { useState, useEffect } from 'react';
import { getProducts, type GetProductsParams } from '@/api/product';

export function ProductPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [name,setName] = useState('')
  const [description,setDescription] = useState('') 
  const [price,setPrice] = useState(1)
  const [sku,setSku] = useState('')
  const [stockQuantity,setStockQuantity] = useState(1)
  const [category,setCategory] = useState('')
  // 定义商品列表
  const [products, setProducts] = useState<Product[]>([]);
  // 请求数据
  useEffect(() => {
    const fetchProducts = async () => {
      const searchParams: GetProductsParams = {
        page,
        limit,
        sortBy,
        sortOrder,
        name,
        description,
        price,
        sku,
        stockQuantity,
        category,
      };
      const response = await getProducts(searchParams);
      setProducts(response.data);
    };
    fetchProducts();
  }, []);

  return <div>
    <ProductTable products={products} />
  </div>;
}