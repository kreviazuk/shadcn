import { toast } from "sonner";

interface ErrorResponse {
  message?: string;
  error?: string;
}

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
  options: Omit<RequestInit, 'body'> & { body?: unknown } = {}
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
    body: finalBody as BodyInit | null | undefined,
    ...rest,
  });

  let data: T | ErrorResponse;
  try {
    data = await response.json();
  } catch {
    // 如果 JSON 解析失败，我们假设没有有意义的 body，
    // 或者 body 不是 JSON 格式，这本身可能是一个错误情况，
    // 但为了toast能显示，我们构造一个ErrorResponse
    data = { error: "响应格式错误或网络问题" }; 
  }

  if (response.status !== 200 && response.status !== 201) { // 201 通常也表示成功
    const errorResponse = data as ErrorResponse; // 断言为错误响应类型
    const errorMessage = errorResponse.message || errorResponse.error || "请求失败";
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
  return data as T; // 断言为成功响应类型 T
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