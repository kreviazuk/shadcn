import { toast } from "sonner";

export async function apiFetch<T = any>(
  url: string,
  options?: RequestInit
): Promise<T | undefined> {
  try {
    const res = await fetch(`/api${url}`, options);
    const data = await res.json().catch(() => ({}));
    if (res.status === 200) {
      return data;
    } else {
      toast.error(data.error || data.message || "请求失败");
      return undefined;
    }
  } catch (e) {
    toast.error((e as Error).message || "网络错误");
    return undefined;
  }
}