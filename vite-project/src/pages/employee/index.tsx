import * as React from 'react';
import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { EmployeeTableToolbar } from '@/pages/employee/components/employee-table-toolbar';
import { EmployeeTable } from '@/pages/employee/components/employee-table';
import { EmployeeFormDialog } from '@/pages/employee/components/employee-form-dialog';
import { DeleteConfirmationDialog } from '@/pages/employee/components/delete-confirmation-dialog';
import type { Employee, SortKey, ColumnDefinition, EmployeeFormValues, ModalMode } from './types';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '@/api/employee';
import type { GetEmployeesParams } from '@/api/employee';

// 员工管理页面组件。
// 集成了员工表格、工具栏、表单对话框和删除确认对话框。
// @returns 返回员工管理页面的 React 元素。
export function EmployeePage() {
  // 员工数据状态
  const [employees, setEmployees] = useState<Employee[]>([]);
  // API 加载状态
  const [isLoading, setIsLoading] = useState(false);
  // API 错误状态
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // 可以后续提供UI让用户修改, 暂时移除 setItemsPerPage
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // 搜索关键词状态
  const [searchTerm, setSearchTerm] = useState('');
  const searchTermRef = useRef(searchTerm);
  
  // 强制获取令牌状态
  const [forceFetchToken, setForceFetchToken] = useState(0);
  
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

  // 同步 searchTermRef 和 searchTerm
  useEffect(() => {
    searchTermRef.current = searchTerm;
  }, [searchTerm]);

  // 获取员工数据的函数
  const fetchEmployees = useCallback(async () => {
    setIsLoading(true);
    // setFetchError(null); // 由 toast 处理，不再需要本地错误状态
    try {
      const params: GetEmployeesParams = {
        page: currentPage,
        limit: itemsPerPage,
        searchTerm: searchTermRef.current || undefined, // 使用 ref 的当前值
        sortBy: sortConfig.key || undefined,
        sortOrder: sortConfig.direction === 'ascending' ? 'asc' : 'desc',
      };
      const response = await getEmployees(params);
      setEmployees(response.data);
      setTotalItems(response.totalItems);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('获取员工列表失败:', error);
      // setFetchError(error instanceof Error ? error.message : '获取员工列表失败'); // 由 toast 处理
      setEmployees([]); // 清空数据以防显示旧数据
      setTotalItems(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, itemsPerPage, sortConfig]); // 不包含 searchTerm，避免搜索词变化时自动触发搜索

  // 组件加载及依赖项变化时获取数据
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees, forceFetchToken]); // 依赖 forceFetchToken，允许通过按钮触发搜索

  // 当搜索词变化时，重置到第一页
  useEffect(() => {
    if (searchTerm !== '') { // 避免初始加载时重置
        setCurrentPage(1);
    }
  }, [searchTerm]);

  /**
   * 处理搜索按钮点击
   */
  const handleSearch = useCallback(() => {
    setCurrentPage(1); // 搜索时回到第一页
    setForceFetchToken(prevToken => prevToken + 1); // 触发搜索
  }, []);

  /**
   * 处理重置按钮点击
   */
  const handleReset = useCallback(() => {
    setSearchTerm(''); // 清空搜索词
    setCurrentPage(1); // 回到第一页
    setSortConfig({ key: 'id', direction: 'ascending' }); // 重置排序
    setForceFetchToken(prevToken => prevToken + 1); // 触发搜索
  }, []);

  /**
   * 处理表格排序的回调函数。
   * @param key - 要排序的列的键。
   */
  const handleSort = useCallback((key: SortKey) => {
    setCurrentPage(1); // 排序时回到第一页
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'ascending' ? 'descending' : 'ascending'
    }));
    // 由于 sortConfig 变化，fetchEmployees 的引用会变化，主 useEffect 会自动调用
  }, []);

  // 由于数据由API获取并已排序/筛选，此处的 useMemo 简化
  const sortedAndFilteredEmployees = useMemo(() => {
    return employees; // 直接使用从 API 获取的数据
  }, [employees]);

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
  async function handleFormSubmit(data: EmployeeFormValues) {
    // setFetchError(null); // 由 toast 处理
    try {
      if (modalMode === 'add') {
        await createEmployee(data);
      } else if (editingEmployee) {
        await updateEmployee(editingEmployee.id, data);
      }
      setIsFormModalOpen(false);
      setEditingEmployee(null);
      setForceFetchToken(prevToken => prevToken + 1); // 提交后强制刷新数据
    } catch (error) {
      console.error('表单提交失败:', error);
    }
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
  const confirmDelete = async () => {
    setIsLoading(true);
    // setFetchError(null); // 由 toast 处理
    try {
      if (employeeIdToDelete) {
         await deleteEmployee(employeeIdToDelete);
         setEmployeeIdToDelete(null);
      } else if (selectedRows.size > 0) {
        // 批量删除选中行 - 后端目前是单个删除，所以需要循环调用
        for (const id of selectedRows) {
          await deleteEmployee(id);
        }
        setSelectedRows(new Set());
      }
      setIsDeleteConfirmOpen(false);
      // 如果删除的是当前页的最后一条数据，可能需要调整 currentPage
      if (employees.length === (employeeIdToDelete ? 1 : selectedRows.size) && currentPage > 1) {
        setCurrentPage(prevPage => Math.max(1, prevPage -1));
      }
      setForceFetchToken(prevToken => prevToken + 1); // 删除后强制刷新数据
    } catch (error) {
      console.error('删除失败:', error);
      // setFetchError(error instanceof Error ? error.message : '删除失败'); // 由 toast 处理
    } finally {
       // setIsLoading(false); // fetchEmployees 会处理
    }
  };
  
  const numSelected = selectedRows.size;
  const numVisibleRows = sortedAndFilteredEmployees.length; // 现在是当前页的行数
  // 计算全选复选框的状态
  const selectAllCheckedState: boolean | 'indeterminate' = numVisibleRows > 0 && numSelected === numVisibleRows ? true : (numSelected > 0 ? 'indeterminate' : false);
  
  // 表格列定义
  const columns: ColumnDefinition[] = [
    { key: 'select', label: '', className: "w-[50px] px-3" },
    { key: 'name', label: '姓名', sortable: true, className: "min-w-[150px] px-3" },
    { key: 'email', label: '邮箱', sortable: true, className: "min-w-[150px] px-3" },
    { key: 'department', label: '部门', sortable: true, className: "min-w-[120px] px-3" },
    { key: 'title', label: '职位', sortable: true, className: "min-w-[150px] px-3" },
    { key: 'status', label: '状态', sortable: true, className: "min-w-[100px] px-3" },
    { key: 'actions', label: '操作', className: "w-[100px] px-3" },
  ];

  // TODO: 添加分页控件到 EmployeeTable 或 EmployeeTableToolbar，并传入 currentPage, totalPages, setCurrentPage
  // TODO: 在 EmployeeTable 中显示 isLoading 和 fetchError 状态

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <EmployeeTableToolbar
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onSearch={handleSearch} // 新增搜索按钮处理函数
        onReset={handleReset} // 新增重置按钮处理函数
        onAddNewEmployee={() => openFormModal('add')}
        onDeleteSelected={handleDeleteSelectedTrigger}
        selectedRowCount={numSelected}
      />

      {/* 可以在这里或Table内部处理isLoading */}
      {isLoading && <div className="text-center p-4">正在加载数据...</div>}
      {!isLoading && !fetchError && sortedAndFilteredEmployees.length === 0 && searchTerm && (
         <div className="text-center p-4 text-gray-500">未找到符合搜索条件的员工。</div>
      )}
      {!isLoading && !fetchError && sortedAndFilteredEmployees.length === 0 && !searchTerm && (
         <div className="text-center p-4 text-gray-500">暂无员工数据。</div>
      )}

      <EmployeeTable
        employees={sortedAndFilteredEmployees}
        selectedRows={selectedRows}
        sortConfig={sortConfig}
        columns={columns}
        selectAllCheckedState={selectAllCheckedState}
        onSelectAllRows={handleSelectAllRows}
        onSelectRow={handleSelectRow}
        onSort={handleSort} // handleSort 会触发 useEffect -> fetchEmployees
        onEditEmployee={(employee) => openFormModal('edit', employee)}
        onDeleteEmployee={handleDeleteRowTrigger}
        searchTerm={searchTerm} // 这个 prop 可能不再需要，因为搜索在父组件处理并通过API
        // 分页相关 props (如果表格组件支持)
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage} // 假设表格有一个 onPageChange 回调
        isLoading={isLoading} // 将加载状态传递给表格
        totalItems={totalItems} // <--- 新增传递 totalItems
      />

      <EmployeeFormDialog
        isOpen={isFormModalOpen}
        onOpenChange={(isOpen) => {
          setIsFormModalOpen(isOpen);
          if (!isOpen) setFetchError(null); // 关闭对话框时清除表单相关的错误
        }}
        mode={modalMode}
        onSubmit={handleFormSubmit}
        employeeToEdit={editingEmployee}
        // 可以传递提交时的错误给对话框显示
        submissionError={fetchError}
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
