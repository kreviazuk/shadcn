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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
// import { z } from "zod";
import { productSchema, type ProductFormValues } from "../types"
import { Button } from "@/components/ui/button";
interface ProductFormDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (data: ProductFormValues) => void;
}
export function ProductFormDialog({
  isOpen,
  onOpenChange,
  onSubmit,
}: ProductFormDialogProps) {
    const form = useForm<ProductFormValues>({
      resolver: zodResolver(productSchema),
      defaultValues: {
        name: "",
        description: "",
        price: "",
        sku: "",
        stockQuantity: 0,
        category: "",
      },
    });
    const handleSubmit = (data: ProductFormValues) => {
        console.log(data);   
        onSubmit(data);     
    }
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新增商品</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>商品名称</FormLabel>
                        <FormControl>
                        <Input placeholder="输入商品名称" {...field} />
                        </FormControl>
                        <FormDescription>
                        商品的显示名称
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />

            </form>
          </Form>
        <DialogFooter> 
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
            <Button type="submit" onClick={form.handleSubmit(handleSubmit)}>保存</Button>
        </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
