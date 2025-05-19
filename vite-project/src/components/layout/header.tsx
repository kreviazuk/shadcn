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
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  Moon,
  PanelLeft,
  Search,
  Sun,
  Languages,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';

export function Header({ className }: { className?: string }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      if (newMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return newMode;
    });
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className={cn("sticky top-0 z-30 bg-background space-y-4 pb-4 border-b", className)}>
      {/* 顶部导航栏 */}
      <header className="flex h-14 items-center gap-4 bg-background px-4 lg:h-[60px] lg:px-6">
        {/* 移动端菜单按钮 */}
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="sm:hidden">
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">{t('common.toggleMenu')}</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-xs">
            <nav className="grid gap-6 text-lg font-medium">
              <a
                href="#"
                className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
              >
                <LayoutDashboard className="h-5 w-5 transition-all group-hover:scale-110" />
                <span className="sr-only">{t('sidebar.dashboard')}</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                {t('sidebar.dashboard')}
              </a>
            </nav>
          </SheetContent>
        </Sheet>

        {/* 面包屑导航 */}
        <div className="hidden md:block">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">{t('sidebar.dashboard')}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{t('pageSpecific.overview')}</BreadcrumbPage>
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
              placeholder={t('header.searchPlaceholder')}
              className="w-full rounded-lg bg-background pl-8 md:w-[240px] lg:w-[280px]"
            />
          </div>
        </div>

        {/* 语言切换按钮 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full">
              <Languages className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">{t('common.toggleLanguage')}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t('common.selectLanguage')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={i18n.resolvedLanguage} onValueChange={changeLanguage}>
              <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="zh">中文</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 主题切换按钮 */}
        <Button variant="outline" size="icon" className="rounded-full" onClick={toggleTheme}>
          {isDarkMode ? (
            <Moon className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <Sun className="h-[1.2rem] w-[1.2rem]" />
          )}
          <span className="sr-only">{t('common.toggleTheme')}</span>
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
            <DropdownMenuLabel>{t('common.myAccount')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{t('common.settings')}</DropdownMenuItem>
            <DropdownMenuItem>{t('common.support')}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{t('common.logout')}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
    </div>
  );
}

 