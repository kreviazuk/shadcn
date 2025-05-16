import * as React from 'react';
import { useState, useMemo, useCallback } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { ArrowUpDown, Trash2, ChevronUp, ChevronDown, Edit2Icon, PlusCircleIcon } from 'lucide-react';

interface Employee {
  id: number;
  name: string;
  role: string;
  department: string;
}

const initialMockEmployees: Employee[] = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  name: `员工 ${i + 1}`,
  role: `职位 ${String.fromCharCode(65 + (i % 4))}-${Math.floor(i / 4) + 1}`,
  department: `部门 ${String.fromCharCode(88 + (i % 3))}`,
}));

type SortKey = keyof Employee;
type ModalMode = 'add' | 'edit';

interface ColumnDefinition {
  key: keyof Employee | 'select' | 'actions';
  label: string;
  className?: string;
  headClassName?: string;
  cellClassName?: string;
  sortable?: boolean;
}

export function EmployeePage() {
  const [employees, setEmployees] = useState<Employee[]>(initialMockEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey | null; direction: 'ascending' | 'descending' }>({ key: 'id', direction: 'ascending' });
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('add');
  const [currentEmployee, setCurrentEmployee] = useState<Partial<Employee>>({});
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

  const handleSelectRow = useCallback((id: number, checked: boolean) => {
    setSelectedRows(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (checked) newSelected.add(id); else newSelected.delete(id);
      return newSelected;
    });
  }, []);

  const openModal = (mode: ModalMode, employee?: Employee) => {
    setModalMode(mode);
    if (mode === 'add') {
      setCurrentEmployee({ name: '', role: '', department: '' });
    } else if (employee) {
      setCurrentEmployee({ ...employee });
    }
    setIsModalOpen(true);
  };

  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentEmployee(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = () => {
    if (!currentEmployee.name || !currentEmployee.role || !currentEmployee.department) {
      alert('请填写所有必填字段！');
      return;
    }
    if (modalMode === 'add') {
      const newId = Math.max(0, ...employees.map(e => e.id).concat(0)) + 1;
      setEmployees(prev => [...prev, { ...currentEmployee, id: newId } as Employee]);
    } else if (currentEmployee.id) {
      setEmployees(prev => prev.map(emp => emp.id === currentEmployee.id ? { ...emp, ...currentEmployee } as Employee : emp));
    }
    setIsModalOpen(false);
  };

  const handleDeleteRow = (id: number) => {
    if (window.confirm('确定要删除这位员工吗？')) {
       setEmployees(prev => prev.filter(emp => emp.id !== id));
       setSelectedRows(prev => { const s = new Set(prev); s.delete(id); return s; });
    }
  };

  const handleDeleteSelectedTrigger = () => {
    if (selectedRows.size > 0) {
      setIsDeleteDialogOpen(true);
    }
  };

  const confirmDeleteSelected = () => {
    setEmployees(prev => prev.filter(emp => !selectedRows.has(emp.id)));
    setSelectedRows(new Set());
    setIsDeleteDialogOpen(false);
  };
  
  const numSelected = selectedRows.size;
  const numVisibleRows = sortedAndFilteredEmployees.length;
  const selectAllCheckedState: boolean | 'indeterminate' = numVisibleRows > 0 && numSelected === numVisibleRows ? true : (numSelected > 0 ? 'indeterminate' : false);

  const SortIndicator = ({ columnKey }: { columnKey: SortKey | null }) => {
    if (sortConfig.key !== columnKey || !sortConfig.key) return <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-40 group-hover:opacity-100" />;
    return sortConfig.direction === 'ascending' ? <ChevronUp className="ml-1.5 h-4 w-4" /> : <ChevronDown className="ml-1.5 h-4 w-4" />;
  };

  const columns: ColumnDefinition[] = [
    { key: 'select', label: '', className: "w-[50px] px-3" },
    { key: 'id', label: 'ID', sortable: true, className: "w-[70px] px-3" },
    { key: 'name', label: '姓名', sortable: true, className: "min-w-[150px] px-3" },
    { key: 'role', label: '职位', sortable: true, className: "min-w-[150px] px-3" },
    { key: 'department', label: '部门', sortable: true, className: "min-w-[120px] px-3" },
    { key: 'actions', label: '操作', className: "w-[100px] px-3 text-right" },
  ];

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-3">
        <Input
          placeholder="搜索员工..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-full sm:max-w-xs h-9"
        />
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {numSelected > 0 && (
            <Button variant="destructive" onClick={handleDeleteSelectedTrigger} size="sm" className="w-full sm:w-auto">
              <Trash2 className="mr-1.5 h-4 w-4 " /> 删除选中 ({numSelected})
            </Button>
          )}
          <Button onClick={() => openModal('add')} size="sm" className="w-full sm:w-auto">
            <PlusCircleIcon className="mr-1.5 h-4 w-4" /> 新增员工
          </Button>
        </div>
      </div>

      <div className="rounded-md border bg-card text-card-foreground shadow-sm">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              {columns.map(col => (
                <TableHead 
                  key={col.key}
                  className={`py-3.5 ${col.className || ''} ${col.headClassName || ''} ${col.sortable ? 'cursor-pointer group hover:bg-muted/50' : ''}`}
                  onClick={col.sortable ? () => handleSort(col.key as SortKey) : undefined}
                >
                  {col.key === 'select' ? (
                    <Checkbox
                      checked={selectAllCheckedState}
                      onCheckedChange={handleSelectAllRows}
                      aria-label="全选/取消全选"
                      className="translate-y-[1px]"
                    />
                  ) : (
                    <div className="flex items-center">
                      {col.label}
                      {col.sortable && <SortIndicator columnKey={col.key as SortKey} />}
                    </div>
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAndFilteredEmployees.length > 0 ? (
              sortedAndFilteredEmployees.map((employee) => (
                <TableRow key={employee.id} data-state={selectedRows.has(employee.id) ? "selected" : ""}>
                  {columns.map(col => (
                    <TableCell key={`${col.key}-${employee.id}`} className={`py-3 ${col.className || ''} ${col.cellClassName || ''}`}>
                      {col.key === 'select' ? (
                        <Checkbox
                          checked={selectedRows.has(employee.id)}
                          onCheckedChange={(checked: boolean) => handleSelectRow(employee.id, checked)}
                          aria-label={`选择 ${employee.name}`}
                          className="translate-y-[1px]"
                        />
                      ) : col.key === 'actions' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <Button variant="outline" size="sm" onClick={() => openModal('edit', employee)} className="h-8 w-8 p-0">
                            <Edit2Icon className="h-4 w-4" />
                            <span className="sr-only">编辑</span>
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteRow(employee.id)} className="h-8 w-8 p-0 hover:border-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">删除</span>
                          </Button>
                        </div>
                      ) : (
                        employee[col.key as keyof Employee]
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{modalMode === 'add' ? '新增员工' : '编辑员工'}</DialogTitle>
            <DialogDescription>
              {modalMode === 'add' ? '填写以下信息以添加新员工。' : '修改员工信息。'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">姓名</Label>
              <Input id="name" name="name" value={currentEmployee.name || ''} onChange={handleFormInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">职位</Label>
              <Input id="role" name="role" value={currentEmployee.role || ''} onChange={handleFormInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">部门</Label>
              <Input id="department" name="department" value={currentEmployee.department || ''} onChange={handleFormInputChange} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>取消</Button>
            <Button onClick={handleFormSubmit}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确定要删除吗？</AlertDialogTitle>
            <AlertDialogDescription>
              {`您确定要删除选中的 ${selectedRows.size} 位员工吗？此操作无法撤销。`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteSelected} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}