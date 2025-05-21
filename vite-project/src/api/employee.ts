import { apiFetch } from '@/lib/request';
import type { Employee, EmployeeFormValues } from '@/pages/employee/types';

export interface GetEmployeesParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sortBy?: keyof Employee;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedEmployeesResponse {
  data: Employee[];
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
}

/**
 * 获取员工列表
 */
export function getEmployees(params: GetEmployeesParams = {}) {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm);
  if (params.sortBy) queryParams.append('sortBy', params.sortBy as string); // 后端期望 string
  if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

  return apiFetch<PaginatedEmployeesResponse>(`/api/employees?${queryParams.toString()}`);
}

/**
 * 根据 ID 获取单个员工信息
 */
export function getEmployeeById(id: string) {
  return apiFetch<Employee>(`/api/employees/${id}`);
}

/**
 * 创建新员工
 */
export function createEmployee(employeeData: EmployeeFormValues) {
  return apiFetch<Employee>('/api/employees', {
    method: 'POST',
    body: JSON.stringify(employeeData),
  });
}

/**
 * 更新员工信息
 */
export function updateEmployee(id: string, employeeData: Partial<EmployeeFormValues>) {
  return apiFetch<Employee>(`/api/employees/${id}`, {
    method: 'PUT',
    body: JSON.stringify(employeeData),
  });
}

/**
 * 删除员工
 */
export function deleteEmployee(id: string) {
  return apiFetch<{ message: string }>(`/api/employees/${id}`, {
    method: 'DELETE',
  });
} 