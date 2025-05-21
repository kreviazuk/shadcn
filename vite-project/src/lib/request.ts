import { toast } from "sonner";

function normalizeHeaders(headers?: HeadersInit): Record<string, string> {
  if (!headers) return {};
  if (headers instanceof Headers) {
    const result: Record<string, string> = {};
    headers.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }
  if (Array.isArray(headers)) {
    return Object.fromEntries(headers);
  }
  return headers as Record<string, string>;
}

export async function apiFetch<T = unknown>(
  url: string,
  options: RequestInit & { body?: any } = {}
): Promise<T> {
  const { method = "GET", body, headers, ...rest } = options;

  // 统一 headers 类型
  const finalHeaders = normalizeHeaders(headers);

  let finalBody = body;
  if (["POST", "PUT", "PATCH"].includes(method.toUpperCase())) {
    finalHeaders["Content-Type"] = "application/json";
    if (body && typeof body !== "string") {
      finalBody = JSON.stringify(body);
    }
  }

  const response = await fetch(url, {
    method,
    headers: finalHeaders,
    body: finalBody,
    ...rest,
  });

  const data = await response.json().catch(() => ({}));

  if (response.status !== 200) {
    toast.error(data.message || "请求失败");
    throw new Error(data.message || "请求失败");
  }
  return data;
}

// GET 辅助方法
export function apiGet<T = unknown>(url: string) {
  return apiFetch<T>(url, { method: "GET" });
}

// POST 辅助方法
export function apiPost<T = unknown>(url: string, body?: unknown) {
  return apiFetch<T>(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
}