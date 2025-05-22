import React, { useState, type ChangeEvent, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";

// ProductTableToolbar 组件的 props 接口
export interface ProductTableToolbarProps {
  onSearchChange: (name: string) => void;
  onAddNewClick: () => void;
  initialSearchTerm?: string;
  searchPlaceholder?: string;
}

export function ProductTableToolbar({
  onSearchChange,
  onAddNewClick,
  initialSearchTerm = "",
  searchPlaceholder = "搜索表格数据...",
}: ProductTableToolbarProps) {
  const [name, setName] = useState<string>(initialSearchTerm);
  const inputRef = useRef<HTMLInputElement>(null);

  // 处理搜索输入框内容变化
  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    setName(newName);
    onSearchChange(newName);
  };

  // 处理 "新增" 按钮点击事件
  const handleAddNew = () => {
    onAddNewClick();
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2 py-4">
        <Input
          ref={inputRef}
          type="text"
          placeholder={searchPlaceholder}
          value={name}
          onChange={handleSearchInputChange}
          className="h-10 max-w-sm"
        />
        <Button size="sm"  className="h-10">
          查询
        </Button>
      </div>
      <Button className="w-full sm:w-auto h-10" onClick={handleAddNew}>
          <PlusCircleIcon className="mr-1.5 h-4 w-4" /> 新增员工
        </Button>
    </div>
  );
}
