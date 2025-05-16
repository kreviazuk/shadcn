import * as React from 'react';
import { useState, useMemo, useCallback } from 'react';
import { EmployeeTableToolbar } from '@/pages/employee/components/employee-table-toolbar';
import { EmployeeTable } from '@/pages/employee/components/employee-table';
import { EmployeeFormDialog } from '@/pages/employee/components/employee-form-dialog';
import { DeleteConfirmationDialog } from '@/pages/employee/components/delete-confirmation-dialog';
import type { Employee, SortKey, ColumnDefinition, EmployeeFormValues, ModalMode } from './types';

const initialMockEmployees: Employee[] = Array.from({ length: 15 }, (_, i) => ({
  id: (i + 1).toString(),
  name: `员工 ${i + 1}`,
  email: `email${i + 1}@example.com`,
  department: `部门 ${String.fromCharCode(88 + (i % 3))}`,
  title: `职位 ${String.fromCharCode(65 + (i % 4))}-${Math.floor(i / 4) + 1}`,
  status: i % 2 === 0 ? 'active' : 'inactive',
}));

export function EmployeePage() {
  const [employees, setEmployees] = useState<Employee[]>(initialMockEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey | null; direction: 'ascending' | 'descending' }>({ key: 'id', direction: 'ascending' });
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('add');
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [employeeIdToDelete, setEmployeeIdToDelete] = useState<string | null>(null);

  const handleSort = useCallback((key: SortKey) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'ascending' ? 'descending' : 'ascending'
    }));
  }, []);

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

  const handleSelectAllRows = useCallback((checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(sortedAndFilteredEmployees.map(emp => emp.id)));
    } else {
      setSelectedRows(new Set());
    }
  }, [sortedAndFilteredEmployees]);

  const handleSelectRow = useCallback((id: string, checked: boolean) => {
    setSelectedRows(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (checked) newSelected.add(id); else newSelected.delete(id);
      return newSelected;
    });
  }, []);

  const openFormModal = (mode: ModalMode, employee?: Employee) => {
    setModalMode(mode);
    setEditingEmployee(employee || null);
    setIsFormModalOpen(true);
  };

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

  const handleDeleteRowTrigger = (id: string) => {
    setEmployeeIdToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteSelectedTrigger = () => {
    if (selectedRows.size > 0) {
      setEmployeeIdToDelete(null);
      setIsDeleteConfirmOpen(true);
    }
  };

  const confirmDelete = () => {
    if (employeeIdToDelete) {
       setEmployees(prev => prev.filter(emp => emp.id !== employeeIdToDelete));
       setSelectedRows(prev => { const s = new Set(prev); s.delete(employeeIdToDelete); return s; });
       setEmployeeIdToDelete(null);
    } else {
      setEmployees(prev => prev.filter(emp => !selectedRows.has(emp.id)));
      setSelectedRows(new Set());
    }
    setIsDeleteConfirmOpen(false);
  };
  
  const numSelected = selectedRows.size;
  const numVisibleRows = sortedAndFilteredEmployees.length;
  const selectAllCheckedState: boolean | 'indeterminate' = numVisibleRows > 0 && numSelected === numVisibleRows ? true : (numSelected > 0 ? 'indeterminate' : false);
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
        itemCount={employeeIdToDelete ? 1 : selectedRows.size}
      />
    </div>
  );
}