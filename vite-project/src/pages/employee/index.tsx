import * as React from 'react';
import { useState, useMemo, useCallback } from 'react';
import { EmployeeTableToolbar } from '@/pages/employee/components/employee-table-toolbar';
import { EmployeeTable } from '@/pages/employee/components/employee-table';
import { EmployeeFormDialog } from '@/pages/employee/components/employee-form-dialog';
import { DeleteConfirmationDialog } from '@/pages/employee/components/delete-confirmation-dialog';
import type { Employee, SortKey, ColumnDefinition, EmployeeFormValues, ModalMode } from './types';

/**
 * 初始的模拟员工数据。
 */
const initialMockEmployees: Employee[] = Array.from({ length: 15 }, (_, i) => ({
  id: (i + 1).toString(),
  name: `员工 ${i + 1}`,
  email: `email${i + 1}@example.com`,
  department: `部门 ${String.fromCharCode(88 + (i % 3))}`,
  title: `职位 ${String.fromCharCode(65 + (i % 4))}-${Math.floor(i / 4) + 1}`,
  status: i % 2 === 0 ? 'active' : 'inactive',
}));

/**
 * 员工管理页面组件。
 * 集成了员工表格、工具栏、表单对话框和删除确认对话框。
 * @returns 返回员工管理页面的 React 元素。
 */
export function EmployeePage() {
  // 员工数据状态
  const [employees, setEmployees] = useState<Employee[]>(initialMockEmployees);
  // 搜索关键词状态
  const [searchTerm, setSearchTerm] = useState('');
  // 排序配置状态
  const [sortConfig, setSortConfig] = useState<{ key: SortKey | null; direction: 'ascending' | 'descending' }>({ key: 'id', direction: 'ascending' });
  // 选中行 ID 集合状态
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  // 表单模态框打开状态
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  // 模态框模式状态 ('add' 或 'edit')
  const [modalMode, setModalMode] = useState<ModalMode>('add');
  // 当前正在编辑的员工信息状态
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  
  // 删除确认对话框打开状态
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  // 将要删除的员工 ID 状态 (用于单行删除)
  const [employeeIdToDelete, setEmployeeIdToDelete] = useState<string | null>(null);

  /**
   * 处理表格排序的回调函数。
   * @param key - 要排序的列的键。
   */
  const handleSort = useCallback((key: SortKey) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'ascending' ? 'descending' : 'ascending'
    }));
  }, []);

  // 经过排序和筛选的员工数据
  const sortedAndFilteredEmployees = useMemo(() => {
    const filtered = employees.filter(employee =>
      Object.values(employee).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    if (sortConfig.key) {
      const sk = sortConfig.key;
      const sorted = [...filtered].sort((a, b) => {
        const aValue = a[sk];
        const bValue = b[sk];
        if (aValue === bValue) return 0;
        let comparison = 0;
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          comparison = aValue - bValue;
        } else if (typeof aValue === 'string' && typeof bValue === 'string') {
          comparison = aValue.localeCompare(bValue);
        } else {
          comparison = String(aValue).localeCompare(String(bValue));
        }
        return sortConfig.direction === 'ascending' ? comparison : -comparison;
      });
      return sorted;
    }
    return filtered;
  }, [employees, searchTerm, sortConfig]);

  /**
   * 处理全选/取消全选行的回调函数。
   * @param checked - 是否选中。
   */
  const handleSelectAllRows = useCallback((checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(sortedAndFilteredEmployees.map(emp => emp.id)));
    } else {
      setSelectedRows(new Set());
    }
  }, [sortedAndFilteredEmployees]);

  /**
   * 处理选择/取消选择单行的回调函数。
   * @param id - 员工 ID。
   * @param checked - 是否选中。
   */
  const handleSelectRow = useCallback((id: string, checked: boolean) => {
    setSelectedRows(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (checked) newSelected.add(id); else newSelected.delete(id);
      return newSelected;
    });
  }, []);

  /**
   * 打开表单模态框。
   * @param mode - 模态框模式 ('add' 或 'edit')。
   * @param employee - (可选) 要编辑的员工数据，仅在 'edit' 模式下需要。
   */
  const openFormModal = (mode: ModalMode, employee?: Employee) => {
    setModalMode(mode);
    setEditingEmployee(employee || null);
    setIsFormModalOpen(true);
  };

  /**
   * 处理表单提交。
   * 根据模态框模式新增或更新员工数据。
   * @param data - 表单数据。
   */
  function handleFormSubmit(data: EmployeeFormValues) {
    if (modalMode === 'add') {
      const newId = `emp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const newEmployee: Employee = { 
        ...data, 
        id: newId, 
        status: data.status || 'active' 
      };
      setEmployees(prev => [...prev, newEmployee]);
    } else if (editingEmployee) {
      setEmployees(prev => 
        prev.map(emp => 
          emp.id === editingEmployee.id ? { ...editingEmployee, ...data, id: editingEmployee.id } : emp
        )
      );
    }
    setIsFormModalOpen(false);
    setEditingEmployee(null);
  }

  /**
   * 触发单行删除操作。
   * 设置要删除的员工 ID 并打开删除确认对话框。
   * @param id - 要删除的员工 ID。
   */
  const handleDeleteRowTrigger = (id: string) => {
    setEmployeeIdToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  /**
   * 触发删除选中行操作。
   * 如果有选中的行，则打开删除确认对话框。
   */
  const handleDeleteSelectedTrigger = () => {
    if (selectedRows.size > 0) {
      setEmployeeIdToDelete(null); // 清除单行删除的 ID，因为这是批量删除
      setIsDeleteConfirmOpen(true);
    }
  };

  /**
   * 确认删除操作。
   * 根据 `employeeIdToDelete` 的状态执行单行删除或批量删除。
   */
  const confirmDelete = () => {
    if (employeeIdToDelete) {
       // 单行删除
       setEmployees(prev => prev.filter(emp => emp.id !== employeeIdToDelete));
       setSelectedRows(prev => { const s = new Set(prev); s.delete(employeeIdToDelete); return s; });
       setEmployeeIdToDelete(null);
    } else {
      // 批量删除选中行
      setEmployees(prev => prev.filter(emp => !selectedRows.has(emp.id)));
      setSelectedRows(new Set());
    }
    setIsDeleteConfirmOpen(false);
  };
  
  const numSelected = selectedRows.size;
  const numVisibleRows = sortedAndFilteredEmployees.length;
  // 计算全选复选框的状态
  const selectAllCheckedState: boolean | 'indeterminate' = numVisibleRows > 0 && numSelected === numVisibleRows ? true : (numSelected > 0 ? 'indeterminate' : false);
  
  // 表格列定义
  const columns: ColumnDefinition[] = [
    { key: 'select', label: '', className: "w-[50px] px-3" },
    { key: 'id', label: 'ID', sortable: true, className: "w-[70px] px-3" },
    { key: 'name', label: '姓名', sortable: true, className: "min-w-[150px] px-3" },
    { key: 'email', label: '邮箱', sortable: true, className: "min-w-[150px] px-3" },
    { key: 'department', label: '部门', sortable: true, className: "min-w-[120px] px-3" },
    { key: 'title', label: '职位', sortable: true, className: "min-w-[150px] px-3" },
    { key: 'status', label: '状态', sortable: true, className: "min-w-[100px] px-3" },
    { key: 'actions', label: '操作', className: "w-[100px] px-3" },
  ];

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <EmployeeTableToolbar
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onAddNewEmployee={() => openFormModal('add')}
        onDeleteSelected={handleDeleteSelectedTrigger}
        selectedRowCount={numSelected}
      />

      <EmployeeTable
        employees={sortedAndFilteredEmployees}
        selectedRows={selectedRows}
        sortConfig={sortConfig}
        columns={columns}
        selectAllCheckedState={selectAllCheckedState}
        onSelectAllRows={handleSelectAllRows}
        onSelectRow={handleSelectRow}
        onSort={handleSort}
        onEditEmployee={(employee) => openFormModal('edit', employee)}
        onDeleteEmployee={handleDeleteRowTrigger}
        searchTerm={searchTerm}
      />

      <EmployeeFormDialog
        isOpen={isFormModalOpen}
        onOpenChange={setIsFormModalOpen}
        mode={modalMode}
        onSubmit={handleFormSubmit}
        employeeToEdit={editingEmployee}
      />

      <DeleteConfirmationDialog
        isOpen={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        onConfirm={confirmDelete}
        itemCount={employeeIdToDelete ? 1 : selectedRows.size} // 根据是单行删除还是批量删除来确定 itemCount
      />
    </div>
  );
}