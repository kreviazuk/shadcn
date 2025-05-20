import React from 'react';
import type { Product } from '../types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ProductTableToolbar } from './product-table-toolbar';

interface ProductTableProps {
    products: Product[];
}

export function ProductTable({ products }: ProductTableProps) {
  // 处理搜索词变化的回调函数
  const handleSearchChange = (searchTerm: string) => {
    console.log('搜索词:', searchTerm);
    // 在这里实现基于 searchTerm 筛选 products 的逻辑
    // 例如: setFilteredProducts(products.filter(p => p.name.includes(searchTerm)));
  };

  // 处理新增按钮点击的回调函数
  const handleAddNewClick = () => {
    console.log('新增按钮被点击');
    // 在这里实现新增产品的逻辑，例如打开一个模态框
   // toolbarRef.current?.clearSearch(); // 示例：调用子组件的方法
  };

  return <div>
    <ProductTableToolbar
      onSearchChange={handleSearchChange}
      onAddNewClick={handleAddNewClick}
    />
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map(product => (
          <TableRow key={product.id}>
            <TableCell>{product.id}</TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell>{product.price}</TableCell>
            <TableCell>{product.description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>;
}