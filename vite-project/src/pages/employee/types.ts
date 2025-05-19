import * as z from "zod";

/**
 * 表示员工信息的接口。
 */
export interface Employee {
  /** 员工的唯一标识符。 */
  id: string;
  /** 员工姓名。 */
  name: string;
  /** 员工邮箱地址。 */
  email: string;
  /** 员工所在部门。 */
  department: string;
  /** 员工职位。 */
  title: string;
  /** 员工状态，可以是 'active' 或 'inactive'。 */
  status: 'active' | 'inactive';
  /** 员工头像的 URL (可选)。 */
  avatar?: string;
}

/**
 * 定义员工对象中可用于排序的键。
 */
export type SortKey = keyof Employee;

/**
 * 定义表格列的结构。
 */
export interface ColumnDefinition {
  /** 列的唯一键，可以是员工属性名，或者是 'select' 或 'actions'。 */
  key: keyof Employee | 'select' | 'actions';
  /** 列头部显示的标签文本。 */
  label: string;
  /** 应用于列的 CSS 类名 (可选)。 */
  className?: string;
  /** 应用于列头部的特定 CSS 类名 (可选)。 */
  headClassName?: string;
  /** 应用于单元格的特定 CSS 类名 (可选)。 */
  cellClassName?: string;
  /** 指示列是否可排序 (可选)。 */
  sortable?: boolean;
}

/**
 * 定义员工表单校验的 schema。
 */
export const employeeSchema = z.object({
  /** 员工 ID (可选，编辑时存在)。 */
  id: z.string().optional(),
  /** 员工姓名，至少包含2个字符。 */
  name: z.string().min(2, { message: '姓名至少包含2个字符。' }),
  /** 员工邮箱，必须是有效的邮箱地址。 */
  email: z.string().email({ message: '请输入有效的邮箱地址。' }),
  /** 员工部门，不能为空。 */
  department: z.string().min(1, { message: '部门不能为空。' }),
  /** 员工职位，不能为空。 */
  title: z.string().min(1, { message: '职位不能为空。' }),
  /** 员工状态，必须是 'active' 或 'inactive'。 */
  status: z.enum(['active', 'inactive']),
});

/**
 * 根据 employeeSchema 推断出的员工表单值的类型。
 */
export type EmployeeFormValues = z.infer<typeof employeeSchema>;

/**
 * 定义模态框的模式，可以是 'add' (新增) 或 'edit' (编辑)。
 */
export type ModalMode = 'add' | 'edit'; 