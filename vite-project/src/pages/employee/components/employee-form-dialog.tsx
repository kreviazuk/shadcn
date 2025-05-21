import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { Employee, EmployeeFormValues, ModalMode } from '../types'; // 调整了类型的路径
import { employeeSchema } from '../types'; // 调整了 schema 的路径

/**
 * 员工表单对话框组件的属性接口。
 */
interface EmployeeFormDialogProps {
  /** 控制对话框是否打开的状态。 */
  isOpen: boolean;
  /** 当对话框打开或关闭状态改变时的回调函数。 */
  onOpenChange: (isOpen: boolean) => void;
  /** 模态框的模式，可以是 'add' (新增) 或 'edit' (编辑)。 */
  mode: ModalMode;
  /** 表单提交时的回调函数。 */
  onSubmit: (data: EmployeeFormValues) => void;
  /** 需要编辑的员工信息 (可选，仅在编辑模式下使用)。 */
  employeeToEdit?: Employee | null;
  /** 表单提交相关的错误信息 (可选)。*/
  submissionError?: string | null;
}

/**
 * 员工表单对话框组件。
 * 用于新增或编辑员工信息。
 * @param props - 组件属性。
 * @returns 返回员工表单对话框的 React 元素。
 */
export function EmployeeFormDialog({
  isOpen,
  onOpenChange,
  mode,
  onSubmit,
  employeeToEdit,
  submissionError,
}: EmployeeFormDialogProps) {
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: "",
      email: "",
      department: "",
      title: "",
      status: "active",
    },
  });

  // 当对话框打开状态、模式或待编辑员工信息变化时，重置表单
  React.useEffect(() => {
    if (isOpen) {
      if (mode === 'add') {
        form.reset({ name: '', email: '', department: '', title: '', status: 'active' });
      } else if (employeeToEdit) {
        form.reset(employeeToEdit);
      }
    } 
  }, [isOpen, mode, employeeToEdit, form]);

  /**
   * 处理表单提交事件。
   * @param data - 表单数据。
   */
  const handleSubmit = (data: EmployeeFormValues) => {
    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <DialogHeader>
              <DialogTitle>{mode === 'add' ? '新增员工' : '编辑员工'}</DialogTitle>
              <DialogDescription>
                {mode === 'add' ? '填写以下信息以添加新员工。' : '修改员工信息。'}
              </DialogDescription>
            </DialogHeader>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">姓名</FormLabel>
                  <FormControl className="col-span-3">
                    <Input placeholder="请输入员工姓名" {...field} />
                  </FormControl>
                  <FormMessage className="col-span-4 text-right" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">邮箱</FormLabel>
                  <FormControl className="col-span-3">
                    <Input placeholder="请输入员工邮箱" {...field} />
                  </FormControl>
                  <FormMessage className="col-span-4 text-right" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">部门</FormLabel>
                  <FormControl className="col-span-3">
                    <Input placeholder="请输入员工部门" {...field} />
                  </FormControl>
                  <FormMessage className="col-span-4 text-right" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">职位</FormLabel>
                  <FormControl className="col-span-3">
                    <Input placeholder="请输入员工职位" {...field} />
                  </FormControl>
                  <FormMessage className="col-span-4 text-right" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">状态</FormLabel>
                  <FormControl className="col-span-3">
                    <Input placeholder="请输入员工状态 (active/inactive)" {...field} />
                  </FormControl>
                  <FormMessage className="col-span-4 text-right" />
                </FormItem>
              )}
            />

            {submissionError && (
              <div className="text-sm text-red-500 text-center">
                {submissionError}
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
              <Button type="submit">保存</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 