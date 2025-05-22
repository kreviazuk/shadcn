import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription,DialogFooter} from "@/components/ui/dialog"
import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
interface ProductFormDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}
export function ProductFormDialog({isOpen,onOpenChange}:ProductFormDialogProps) {

  return <div>
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新增商品</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  </div>;
}