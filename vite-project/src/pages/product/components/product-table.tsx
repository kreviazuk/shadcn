import React from 'react';
import type { Product } from '../types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ProductTableProps {
    products: Product[];
}

export function ProductTable({ products }: ProductTableProps) {
  // 处理搜索词变化的回调函数
  const handleSearchChange = (name: string) => {
    console.log('搜索词:', name);

  };
  return <div>
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