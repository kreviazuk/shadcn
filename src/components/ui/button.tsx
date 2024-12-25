import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * 按钮样式变体定义
 * 使用 class-variance-authority (cva) 来管理按钮的样式变体
 * 
 * 基础样式:
 * - inline-flex: 行内弹性布局
 * - items-center: 垂直居中
 * - justify-center: 水平居中
 * - gap-2: 内部元素间距
 * - whitespace-nowrap: 文本不换行
 * - rounded-md: 中等圆角
 * - text-sm: 小号文本
 * - font-medium: 中等字重
 * - transition-colors: 颜色过渡动画
 * - focus-visible: 焦点状态样式
 * - disabled: 禁用状态样式
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      /**
       * 变体类型:
       * @variant default - 默认主题色按钮
       * @variant destructive - 危险操作按钮（红色）
       * @variant outline - 轮廓按钮（带边框）
       * @variant secondary - 次要按钮（灰色）
       * @variant ghost - 幽灵按钮（透明背景）
       * @variant link - 链接按钮（带下划线）
       */
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      /**
       * 尺寸变体:
       * @size default - 默认尺寸 (h-9 px-4 py-2)
       * @size sm - 小尺寸 (h-8 px-3)
       * @size lg - 大尺寸 (h-10 px-8)
       * @size icon - 图标按钮 (正方形 h-9 w-9)
       */
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    // 默认变体设置
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * 按钮组件的属性接口
 * 继承原生按钮属性和变体属性
 * @interface ButtonProps
 * @extends React.ButtonHTMLAttributes<HTMLButtonElement>
 * @extends VariantProps<typeof buttonVariants>
 * @property {boolean} asChild - 是否将子元素作为按钮的根元素
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

/**
 * Button 组件
 * 一个可定制的按钮组件，支持多种变体和尺寸
 * 
 * @component
 * @example
 * // 默认按钮
 * <Button>Click me</Button>
 * 
 * // 危险按钮
 * <Button variant="destructive">Delete</Button>
 * 
 * // 小尺寸轮廓按钮
 * <Button variant="outline" size="sm">Small</Button>
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // 如果 asChild 为 true，使用 Slot 组件，否则使用原生 button
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
