import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  CalendarIcon, 
  DownloadIcon, 
  LayoutDashboard, 
  PanelLeft, 
  Search, 
  Sun
} from "lucide-react";

export function Header({ className }: { className?: string }) {
  return (
    <div className={cn("sticky top-0 z-30 bg-background space-y-4 pb-4 border-b", className)}>
      {/* 顶部导航栏 */}
      <header className="flex h-14 items-center gap-4 bg-background px-4 lg:h-[60px] lg:px-6">
        {/* 移动端菜单按钮 */}
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="sm:hidden">
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">切换菜单</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-xs">
            <nav className="grid gap-6 text-lg font-medium">
              <a
                href="#"
                className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
              >
                <LayoutDashboard className="h-5 w-5 transition-all group-hover:scale-110" />
                <span className="sr-only">管理后台</span>
              </a>
              <a
                href="/dashboard"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                概览
              </a>
            </nav>
          </SheetContent>
        </Sheet>

        {/* 面包屑导航 */}
        <div className="hidden md:block">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Overview</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* 搜索框 */}
        <div className="ml-auto flex-1 md:grow-0">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-background pl-8 md:w-[240px] lg:w-[280px]"
            />
          </div>
        </div>

        {/* 主题切换按钮 */}
        <Button variant="outline" size="icon" className="rounded-full">
          <Sun className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">切换主题</span>
        </Button>

        {/* 用户头像/菜单 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="overflow-hidden rounded-full h-8 w-8 bg-purple-500 text-white"
            >
              <span>KK</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>我的账户</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>设置</DropdownMenuItem>
            <DropdownMenuItem>支持</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>登出</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* 欢迎内容区域 */}
      <div className="flex flex-col gap-4 px-4 md:flex-row md:items-center md:justify-between lg:px-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Hi, Welcome back 👋</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm">
            <CalendarIcon className="h-4 w-4" />
            <span>Jan 20, 2023 - Feb 09, 2023</span>
          </div>
          <Button variant="secondary" className="h-9">
            <DownloadIcon className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>
    </div>
  );
}

 