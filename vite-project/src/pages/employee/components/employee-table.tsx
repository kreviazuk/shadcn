import * as React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown, ChevronUp, ChevronDown, Edit2Icon, Trash2 } from 'lucide-react';
import type { Employee, SortKey, ColumnDefinition } from '../types'; // 调整了类型的路径

/**
 * 员工表格组件的属性接口。
 */
interface EmployeeTableProps {
  /** 要在表格中显示的员工数据数组。 */
  employees: Employee[];
  /** 包含选中行 ID 的集合。 */
  selectedRows: Set<string>;
  /** 当前的排序配置。 */
  sortConfig: { key: SortKey | null; direction: 'ascending' | 'descending' };
  /** 表格的列定义数组。 */
  columns: ColumnDefinition[];
  /** 全选复选框的选中状态 (true, false, 或 'indeterminate')。 */
  selectAllCheckedState: boolean | 'indeterminate';
  /** 当全选复选框状态改变时的回调函数。 */
  onSelectAllRows: (checked: boolean) => void;
  /** 当行选择复选框状态改变时的回调函数。 */
  onSelectRow: (id: string, checked: boolean) => void;
  /** 当列头被点击以进行排序时的回调函数。 */
  onSort: (key: SortKey) => void;
  /** 点击编辑员工按钮时的回调函数。 */
  onEditEmployee: (employee: Employee) => void;
  /** 点击删除员工按钮时的回调函数。 */
  onDeleteEmployee: (id: string) => void;
  /** 当前的搜索关键词。 */
  searchTerm: string;
}

/**
 * 排序指示器组件。
 * 根据当前的排序状态显示不同的图标。
 * @param columnKey - 当前列的键。
 * @param sortConfig - 当前的排序配置。
 * @returns 返回排序指示器图标的 React 元素。
 */
const SortIndicator = ({ columnKey, sortConfig }: { columnKey: SortKey | null, sortConfig: EmployeeTableProps['sortConfig'] }) => {
  if (sortConfig.key !== columnKey || !sortConfig.key) return <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-40 group-hover:opacity-100" />;
  return sortConfig.direction === 'ascending' ? <ChevronUp className="ml-1.5 h-4 w-4" /> : <ChevronDown className="ml-1.5 h-4 w-4" />;
};

/**
 * 员工表格组件。
 * 用于显示、排序、选择和操作员工数据。
 * @param props - 组件属性。
 * @returns 返回员工表格的 React 元素。
 */
export function EmployeeTable({
  employees,
  selectedRows,
  sortConfig,
  columns,
  selectAllCheckedState,
  onSelectAllRows,
  onSelectRow,
  onSort,
  onEditEmployee,
  onDeleteEmployee,
  searchTerm
}: EmployeeTableProps) {
  return (
    <div className="rounded-md border bg-card text-card-foreground shadow-sm">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            {columns.map(col => (
              <TableHead
                key={col.key}
                className={`py-3.5 ${col.className || ''} ${col.headClassName || ''} ${col.sortable ? 'cursor-pointer group hover:bg-muted/50' : ''}`}
                onClick={col.sortable ? () => onSort(col.key as SortKey) : undefined}
              >
                {col.key === 'select' ? (
                  <Checkbox
                    checked={selectAllCheckedState}
                    onCheckedChange={onSelectAllRows}
                    aria-label="全选/取消全选"
                    className="translate-y-[1px]"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full">
                    <div className="flex items-center">
                      {col.label}
                      {col.sortable && <SortIndicator columnKey={col.key as SortKey} sortConfig={sortConfig} />}
                    </div>
                  </div>
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.length > 0 ? (
            employees.map((employee) => (
              <TableRow key={employee.id} data-state={selectedRows.has(employee.id) ? "selected" : ""}>
                {columns.map(col => (
                  <TableCell key={`${col.key}-${employee.id}`} className={`py-3 ${col.className || ''} ${col.cellClassName || ''}`}>
                    {col.key === 'select' ? (
                      <Checkbox
                        checked={selectedRows.has(employee.id)}
                        onCheckedChange={(checked: boolean) => onSelectRow(employee.id, checked)}
                        aria-label={`选择 ${employee.name}`}
                        className="translate-y-[1px]"
                      />
                    ) : col.key === 'actions' ? (
                      <div className="flex items-center justify-center gap-1.5 w-full">
                        <Button variant="outline" size="sm" onClick={() => onEditEmployee(employee)} className="h-8 w-8 p-0">
                          <Edit2Icon className="h-4 w-4" />
                          <span className="sr-only">编辑</span>
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => onDeleteEmployee(employee.id)} className="h-8 w-8 p-0 hover:border-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">删除</span>
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-full">
                        {employee[col.key as keyof Employee]}
                      </div>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center py-3">
                {searchTerm ? `未找到与 "${searchTerm}" 相关的员工` : '暂无员工数据'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
} 