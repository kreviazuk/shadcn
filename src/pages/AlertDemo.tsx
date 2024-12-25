import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal, AlertCircle, Info } from "lucide-react"
import { AlertService, showAlert } from "@/services/alert-service"
import { Button } from "@/components/ui/button"

const AlertDemo = () => {
  // 处理函数
  const handleShowInfo = () => {
    // 显示 2 秒
    AlertService.info("这是一条信息提示", "信息", 2000)
  }

  const handleShowError = () => {
    // 显示 4 秒
    AlertService.error("操作失败，请重试", "错误", 4000)
  }

  const handleShowTerminal = () => {
    // 显示 3 秒（默认）
    AlertService.terminal("命令执行完成", "终端")
  }

  const handleCustomAlert = () => {
    // 显示 5 秒
    showAlert({
      title: "自定义提示",
      description: "这是一个自定义的提示框",
      duration: 5000,
      icon: "info",
      variant: "default"
    })
  }

  const handleLongDurationAlert = () => {
    // 显示 10 秒
    AlertService.info(
      "这是一个长时间显示的提示", 
      "长时间提示",
      10000
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8">
      <div className="w-full max-w-2xl space-y-8">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">通过函数调用 Alert</h1>
          <div className="flex flex-wrap gap-4">
            <Button onClick={handleShowInfo}>
              显示信息提示 (2秒)
            </Button>
            <Button onClick={handleShowError} variant="destructive">
              显示错误提示 (4秒)
            </Button>
            <Button onClick={handleShowTerminal} variant="outline">
              显示终端提示 (3秒)
            </Button>
            <Button onClick={handleCustomAlert} variant="secondary">
              显示自定义提示 (5秒)
            </Button>
            <Button onClick={handleLongDurationAlert} variant="default">
              显示长时间提示 (10秒)
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-2xl font-bold">通过组件使用 Alert</h1>
          
          {/* 默认 Alert */}
          <Alert>
            <Terminal className="w-4 h-4" />
            <AlertTitle>默认提示</AlertTitle>
            <AlertDescription>
              这是一个默认样式的提示信息。
            </AlertDescription>
          </Alert>

          {/* 错误 Alert */}
          <Alert variant="destructive">
            <AlertCircle className="w-4 h-4" />
            <AlertTitle>错误</AlertTitle>
            <AlertDescription>
              操作失败，请检查后重试。
            </AlertDescription>
          </Alert>

          {/* 自定义样式的 Alert */}
          <Alert className="border-blue-500 bg-blue-50">
            <Info className="w-4 h-4 text-blue-500" />
            <AlertTitle className="text-blue-700">自定义样式</AlertTitle>
            <AlertDescription className="text-blue-600">
              这是一个使用自定义样式的提示框。
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  )
}

export default AlertDemo 