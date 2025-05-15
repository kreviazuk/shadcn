import { LoginForm } from "@/components/auth/login-form";

/**
 * LoginPage 组件
 *
 * 职责:
 * - 作为登录页面的容器，负责整体布局。
 * - 引入并展示 `LoginForm` 组件。
 * - 设置页面的背景和居中对齐方式。
 */
export function LoginPage() {
  return (
    // 使用 Flexbox 实现垂直和水平居中
    // min-h-screen 确保容器至少占据整个屏幕的高度
    // bg-gradient-to-br 设置了一个从 slate-900 到 slate-700 的渐变背景
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <LoginForm />
    </div>
  );
} 