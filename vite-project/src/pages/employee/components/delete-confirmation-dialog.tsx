import * as React from 'react';
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

/**
 * 删除确认对话框组件的属性接口。
 */
interface DeleteConfirmationDialogProps {
  /** 控制对话框是否打开的状态。 */
  isOpen: boolean;
  /** 当对话框打开或关闭状态改变时的回调函数。 */
  onOpenChange: (isOpen: boolean) => void;
  /** 点击确认删除按钮时的回调函数。 */
  onConfirm: () => void;
  /** 要删除的条目数量，默认为0。 */
  itemCount?: number;
}

/**
 * 删除确认对话框组件。
 * @param props - 组件属性。
 * @returns 返回删除确认对话框的 React 元素。
 */
export function DeleteConfirmationDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  itemCount = 0, 
}: DeleteConfirmationDialogProps) {
  const description = itemCount > 1 
    ? `您确定要删除选中的 ${itemCount} 位员工吗？此操作无法撤销。`
    : `确定要删除这位员工吗？此操作无法撤销。`;

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确定要删除吗？</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>取消</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            删除
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 