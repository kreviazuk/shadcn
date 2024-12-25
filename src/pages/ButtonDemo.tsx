import { Button } from "@/components/ui/button"

/**
 * ButtonDemo 组件展示了 shadcn 按钮组件的各种变体
 * 布局使用 flex 实现垂直居中和适当的间距
 */
const ButtonDemo = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8">
      <h1 className="text-2xl font-bold">Button Spacing Demo</h1>
      
      {/* 使用内置 size 属性控制 padding */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl">内置 Size 控制 Padding</h2>
        <div className="flex gap-4">
          <Button size="sm">Small Padding</Button>
          <Button size="default">Default Padding</Button>
          <Button size="lg">Large Padding</Button>
        </div>
      </div>

      {/* 使用 className 自定义 padding */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl">自定义 Padding</h2>
        <div className="flex gap-4">
          <Button className="px-20 py-20">大 Padding</Button>
          <Button className="px-2 py-1">小 Padding</Button>
        </div>
      </div>

      {/* 使用 className 添加 margin */}
      <div className="flex flex-col gap-4 bg-red-500">
        <h2 className="text-xl">Margin 示例</h2>
        <div className="flex">
          <Button className="m-4">四周 Margin</Button>
          <Button className="mx-4">左右 Margin</Button>
          <Button className="my-4">上下 Margin</Button>
        </div>
      </div>

      {/* 混合使用 size 和自定义间距 */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl">混合使用</h2>
        <div className="flex gap-4">
          <Button 
            size="lg" 
            className="px-10 mb-4"
            variant="default"
          >
            混合样式
          </Button>
          <Button 
            className="mt-4 px-6"
            variant="outline"
            size='icon'
          >
            .
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ButtonDemo 