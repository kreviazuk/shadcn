import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const AccordionDemo = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl space-y-8">
        <h1 className="text-2xl font-bold">Accordion 组件示例</h1>

        {/* 基础用法 */}
        <div className="space-y-4">
          <h2 className="text-xl">基础用法</h2>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Accordion 是什么？</AccordionTrigger>
              <AccordionContent>
                Accordion 是一个可折叠的内容面板，用于在有限的空间内组织和展示大量内容。
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>如何使用？</AccordionTrigger>
              <AccordionContent>
                使用 Accordion 组件需要配合 AccordionItem、AccordionTrigger 和 AccordionContent 组件一起使用。
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>有哪些特性？</AccordionTrigger>
              <AccordionContent>
                - 支持单个或多个面板同时展开
                - 可以设置默认展开的面板
                - 支持键盘导航
                - 完全可定制的样式
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* 多选模式 */}
        <div className="space-y-4">
          <h2 className="text-xl">多选模式</h2>
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="multi-1">
              <AccordionTrigger>可以同时打开多个</AccordionTrigger>
              <AccordionContent>
                这是第一个面板的内容。
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="multi-2">
              <AccordionTrigger>互不影响</AccordionTrigger>
              <AccordionContent>
                这是第二个面板的内容。
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="multi-3">
              <AccordionTrigger>更灵活的展示</AccordionTrigger>
              <AccordionContent>
                这是第三个面板的内容。
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* 自定义样式 */}
        <div className="space-y-4">
          <h2 className="text-xl">自定义样式</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="custom-1" className="border-blue-200">
              <AccordionTrigger className="hover:text-blue-500">
                自定义触发器样式
              </AccordionTrigger>
              <AccordionContent className="text-blue-600">
                这是一个带有自定义样式的内容面板。
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="custom-2" className="border-green-200">
              <AccordionTrigger className="hover:text-green-500">
                另一个自定义样式
              </AccordionTrigger>
              <AccordionContent className="text-green-600">
                你可以为每个面板设置不同的样式。
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  )
}

export default AccordionDemo 