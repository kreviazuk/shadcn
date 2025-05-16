import * as z from "zod";

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  title: string;
  status: 'active' | 'inactive';
  avatar?: string;
}

export type SortKey = keyof Employee;

export interface ColumnDefinition {
  key: keyof Employee | 'select' | 'actions';
  label: string;
  className?: string;
  headClassName?: string;
  cellClassName?: string;
  sortable?: boolean;
}

export const employeeSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: '姓名至少包含2个字符。' }),
  email: z.string().email({ message: '请输入有效的邮箱地址。' }),
  department: z.string().min(1, { message: '部门不能为空。' }),
  title: z.string().min(1, { message: '职位不能为空。' }),
  status: z.enum(['active', 'inactive']),
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;

export type ModalMode = 'add' | 'edit'; 