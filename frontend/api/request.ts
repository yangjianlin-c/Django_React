// ... existing code ...
const BASE_URL = "http://localhost:8000"; // 这里请根据你的 Django 后端实际地址调整

export async function apiRequest<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const token = localStorage.getItem('token');
  const response = await fetch(BASE_URL + url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
    ...options,
  });
  if (!response.ok) {
    // 统一错误处理
    throw new Error(await response.text());
  }
  return response.json();
}
// ... existing code ...