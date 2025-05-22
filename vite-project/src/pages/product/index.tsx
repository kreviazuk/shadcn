import { ProductTable } from "./components/product-table";
import type { Product } from "./types";
import { useState, useEffect } from 'react';
import { getProducts, type GetProductsParams } from '@/api/product';
import { ProductTableToolbar } from "./components/product-table-toolbar";
import { ProductFormDialog } from "./components/product-form-dialog";
export function ProductPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState<SortKey>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [name,setName] = useState('')
  const [description,setDescription] = useState('') 
  const [price,setPrice] = useState(1)
  const [sku,setSku] = useState('')
  const [stockQuantity,setStockQuantity] = useState(1)
  const [category,setCategory] = useState('')
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  // 定义商品列表
  const [products, setProducts] = useState<Product[]>([]);
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
  // 请求数据
  useEffect(() => {
    
    fetchProducts();
  }, []);
  const  handleSearchChange = (name: string) => {
    console.log('搜索词:', name);
    setName(name)
    fetchProducts()
  }
  const handleAddNewClick = () => {
    console.log('新增按钮被点击');
    setIsFormModalOpen(true)
  }
  return <div>
    <ProductTableToolbar
      onSearchChange={handleSearchChange}
      onAddNewClick={handleAddNewClick}
    />
    <ProductTable products={products} />
    <ProductFormDialog isOpen={isFormModalOpen} onOpenChange={setIsFormModalOpen} />
  </div>;
}