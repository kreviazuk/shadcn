import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { createRoot } from 'react-dom/client'
import { AlertCircle, Terminal, Info } from "lucide-react"

// Alert 组件样式定义
const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

// Alert 组件定义
const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

// Alert Service 相关定义
interface AlertOptions {
  title?: string
  description: string
  variant?: 'default' | 'destructive'
  duration?: number
  icon?: 'info' | 'error' | 'terminal'
}

const getIcon = (type: string) => {
  switch (type) {
    case 'info':
      return <Info className="w-4 h-4" />
    case 'error':
      return <AlertCircle className="w-4 h-4" />
    case 'terminal':
      return <Terminal className="w-4 h-4" />
    default:
      return null
  }
}

// Alert Service 方法
const showAlert = (options: AlertOptions) => {
  const { title, description, variant = 'default', duration = 3000, icon } = options

  const container = document.createElement('div')
  container.style.position = 'fixed'
  container.style.top = '20px'
  container.style.right = '20px'
  container.style.zIndex = '9999'
  document.body.appendChild(container)

  const root = createRoot(container)

  root.render(
    <div className="animate-in slide-in-from-right">
      <Alert variant={variant} className="min-w-[300px] shadow-lg">
        {icon && getIcon(icon)}
        {title && <AlertTitle>{title}</AlertTitle>}
        <AlertDescription>{description}</AlertDescription>
      </Alert>
    </div>
  )

  setTimeout(() => {
    root.unmount()
    document.body.removeChild(container)
  }, duration)
}

// 便捷方法
const AlertService = {
  info: (description: string, title?: string, duration: number = 3000) => 
    showAlert({ description, title, icon: 'info', duration }),
    
  error: (description: string, title?: string, duration: number = 3000) => 
    showAlert({ description, title, variant: 'destructive', icon: 'error', duration }),
    
  terminal: (description: string, title?: string, duration: number = 3000) => 
    showAlert({ description, title, icon: 'terminal', duration })
}

export { 
  Alert, 
  AlertTitle, 
  AlertDescription, 
  showAlert, 
  AlertService,
  type AlertOptions  // 导出类型定义
} 