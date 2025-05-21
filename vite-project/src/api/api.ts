import { apiFetch } from "@/lib/request";

// 登录
export function loginApi(data: { email: string; password: string }) {
  return apiFetch<{ token?: string; message?: string }>("/api/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// 获取用户信息
export function getUserInfoApi() {
  return apiFetch<{ name: string; email: string }>("/user/info");
}

// 其他接口...