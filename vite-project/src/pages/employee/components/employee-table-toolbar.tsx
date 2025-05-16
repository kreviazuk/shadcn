import * as React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, PlusCircleIcon } from 'lucide-react';

interface EmployeeTableToolbarProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onAddNewEmployee: () => void;
  onDeleteSelected: () => void;
  selectedRowCount: number;
}

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