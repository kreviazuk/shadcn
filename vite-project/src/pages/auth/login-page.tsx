import { useState } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";

/**
 * LoginPage 组件
 * - 支持登录/注册表单切换
 */
export function LoginPage() {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      {showRegister ? <RegisterForm /> : <LoginForm />}
      <button
        className="mt-4 text-blue-500 hover:underline"
        onClick={() => setShowRegister((v) => !v)}
      >
        {showRegister ? "已有账号？去登录" : "没有账号？去注册"}
      </button>
    </div>
  );
}