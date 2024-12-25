import React from 'react'
import { createRoot } from 'react-dom/client'
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Terminal, Info } from "lucide-react"

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
      return <Info className="h-4 w-4" />
    case 'error':
      return <AlertCircle className="h-4 w-4" />
    case 'terminal':
      return <Terminal className="h-4 w-4" />
    default:
      return null
  }
}

export const showAlert = (options: AlertOptions) => {
  const { title, description, variant = 'default', duration = 3000, icon } = options

  // 创建容器
  const container = document.createElement('div')
  container.style.position = 'fixed'
  container.style.top = '20px'
  container.style.right = '20px'
  container.style.zIndex = '9999'
  document.body.appendChild(container)

  // 创建 root
  const root = createRoot(container)

  // 渲染 Alert
  root.render(
    <div className="animate-in slide-in-from-right">
      <Alert variant={variant} className="min-w-[300px] shadow-lg">
        {icon && getIcon(icon)}
        {title && <AlertTitle>{title}</AlertTitle>}
        <AlertDescription>{description}</AlertDescription>
      </Alert>
    </div>
  )

  // 定时移除
  setTimeout(() => {
    root.unmount()
    document.body.removeChild(container)
  }, duration)
}

// 便捷方法
export const AlertService = {
  info: (description: string, title?: string, duration: number = 3000) => 
    showAlert({ description, title, icon: 'info', duration }),
    
  error: (description: string, title?: string, duration: number = 3000) => 
    showAlert({ description, title, variant: 'destructive', icon: 'error', duration }),
    
  terminal: (description: string, title?: string, duration: number = 3000) => 
    showAlert({ description, title, icon: 'terminal', duration })
} 