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
import type { Employee, EmployeeFormValues, ModalMode } from '../types'; // Adjusted path for types
import { employeeSchema } from '../types'; // Adjusted path for schema

// Removed local type definitions as they are now imported

interface EmployeeFormDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  mode: ModalMode;
  onSubmit: (data: EmployeeFormValues) => void;
  employeeToEdit?: Employee | null;
}

export function EmployeeFormDialog({
  isOpen,
  onOpenChange,
  mode,
  onSubmit,
  employeeToEdit,
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

  React.useEffect(() => {
    if (isOpen) {
      if (mode === 'add') {
        form.reset({ name: '', email: '', department: '', title: '', status: 'active' });
      } else if (employeeToEdit) {
        form.reset(employeeToEdit);
      }
    } 
  }, [isOpen, mode, employeeToEdit, form]);

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