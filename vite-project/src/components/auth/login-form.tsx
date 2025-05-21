"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Toaster,toast } from "sonner";
import { useNavigate } from "react-router-dom";

import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { loginApi } from "@/api/api";

/**
 * 定义登录表单的校验规则。
 * - email: 必须是有效的邮箱格式。
 * - password: 最小长度为6个字符。
 */
const formSchema = z.object({
  email: z.string().email({ message: "请输入有效的邮箱地址" }),
  password: z.string().min(6, { message: "密码长度至少为6位" }),
});

/**
 * 从 Zod schema 推断出表单值的类型。
 */
type LoginFormValues = z.infer<typeof formSchema>;

/**
 * LoginForm 组件
 *
 * 职责:
 * - 展示登录表单界面 (邮箱、密码输入框, 登录按钮)。
 * - 使用 react-hook-form 处理表单状态和校验。
 * - 使用 Zod 定义和执行表单校验规则。
 * - 处理表单提交逻辑 (目前为模拟 API 调用)。
 * - 管理加载状态 (isLoading) 以在提交期间禁用表单元素并显示加载提示。
 */
export function LoginForm() {
  /**
   * 初始化 react-hook-form。
   * - resolver: 使用 Zod schema进行校验。
   * - defaultValues: 设置表单字段的初始值。
   */
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 使用 form.watch() 来获取所有字段的实时值
  const watchedValues = form.watch();
  // 或者只监听特定字段:
  // const watchedEmail = form.watch("email");
  // const watchedPassword = form.watch("password");

  React.useEffect(() => {
    // 当 watchedValues 发生变化时，将其打印到控制台
    console.log("表单实时值:", watchedValues);

    // 如果你只想监听特定字段的变化并打印：
    // console.log("实时 Email:", watchedEmail);
    // console.log("实时 Password:", watchedPassword);
  }, [watchedValues]); // 依赖数组中放入 watchedValues，确保仅在它变化时执行 effect

  // 如果你分别监听了 email 和 password，依赖数组应该是这样：
  // }, [watchedEmail, watchedPassword]);

  /**
   * 管理表单提交时的加载状态。
   * true 表示正在提交，false 表示空闲。
   */
  const [isLoading, setIsLoading] = React.useState(false);

  const navigate = useNavigate();

  /**
   * 表单提交处理函数。
   * @param values - 经过 Zod 校验的表单数据。
   */
  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);
    try {
      const data = await loginApi(values);
      console.log(data);
      const token = data?.token;
      if (token) {
        localStorage.setItem("token", token); // 保存 token
        navigate("/dashboard");
        toast.success("登录成功！");
        form.reset();
      } else {
        throw new Error(data?.message || "未获取到 token");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">登录</CardTitle>
        <CardDescription>
          请输入您的凭据以登录您的帐户。
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Shadcn UI Form 组件，集成了 react-hook-form */}
        <Form {...form}>
          {/* HTML form 元素，onSubmit 事件由 react-hook-form 的 handleSubmit 处理 */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* 邮箱字段 */}
            <FormField
              control={form.control} // react-hook-form 的 control 对象
              name="email" // 字段名称，与 formSchema 中的 key 对应
              render={({ field }) => ( // render prop，用于渲染字段的 UI
                <FormItem>
                  <FormLabel>邮箱</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="m@example.com"
                      {...field} // 将 react-hook-form 提供的 props 传递给 Input 组件
                      disabled={isLoading} // 根据加载状态禁用输入框
                    />
                  </FormControl>
                  <FormMessage /> {/* 用于显示该字段的校验错误信息 */}
                </FormItem>
              )}
            />
            {/* 密码字段 */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>密码</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="******"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* 提交按钮 */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "登录中..." : "登录"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <Toaster position="top-center" />
    </Card>
  );
} 