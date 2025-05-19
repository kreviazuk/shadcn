import * as React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, PlusCircleIcon } from 'lucide-react';

/**
 * 员工表格工具栏组件的属性接口。
 */
interface EmployeeTableToolbarProps {
  /** 当前的搜索关键词。 */
  searchTerm: string;
  /** 当搜索关键词变化时的回调函数。 */
  onSearchTermChange: (term: string) => void;
  /** 点击新增员工按钮时的回调函数。 */
  onAddNewEmployee: () => void;
  /** 点击删除选中员工按钮时的回调函数。 */
  onDeleteSelected: () => void;
  /** 当前选中的行数。 */
  selectedRowCount: number;
}

/**
 * 员工表格工具栏组件。
 * 包含搜索框、新增员工按钮和删除选中员工按钮。
 * @param props - 组件属性。
 * @returns 返回员工表格工具栏的 React 元素。
 */
export function EmployeeTableToolbar({
  searchTerm,
  onSearchTermChange,
  onAddNewEmployee,
  onDeleteSelected,
  selectedRowCount,
}: EmployeeTableToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-3">
      <Input
        placeholder="搜索员工..."
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
        className="max-w-full sm:max-w-xs h-9"
      />
      <div className="flex items-center gap-2 w-full sm:w-auto">
        {selectedRowCount > 0 && (
          <Button variant="destructive" onClick={onDeleteSelected} size="sm" className="w-full sm:w-auto">
            <Trash2 className="mr-1.5 h-4 w-4 " /> 删除选中 ({selectedRowCount})
          </Button>
        )}
        <Button onClick={onAddNewEmployee} size="sm" className="w-full sm:w-auto">
          <PlusCircleIcon className="mr-1.5 h-4 w-4" /> 新增员工
        </Button>
      </div>
    </div>
  );
} 