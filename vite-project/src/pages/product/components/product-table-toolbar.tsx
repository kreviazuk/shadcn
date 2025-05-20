import React, { useState, type ChangeEvent, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';


// ProductTableToolbar 组件的 props 接口
export interface ProductTableToolbarProps {
  onSearchChange: (searchTerm: string) => void;
  onAddNewClick: () => void;
  initialSearchTerm?: string;
  searchPlaceholder?: string;
}

export function ProductTableToolbar({
  onSearchChange,
  onAddNewClick,
  initialSearchTerm = '',
  searchPlaceholder = '搜索表格数据...'
}: ProductTableToolbarProps) {
  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  const inputRef = useRef<HTMLInputElement>(null);

  // 处理搜索输入框内容变化
  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    onSearchChange(newSearchTerm);
  };

  // 处理 "新增" 按钮点击事件
  const handleAddNew = () => {
    onAddNewClick();
  };

  return (
    <div className="flex items-center space-x-2 py-4">
      <Input
        ref={inputRef}
        type="text"
        placeholder={searchPlaceholder}
        value={searchTerm}
        onChange={handleSearchInputChange}
        className="h-10 max-w-sm"
      />
      <Button onClick={handleAddNew} className="h-10">
        新增
      </Button>
    </div>
  );
}
