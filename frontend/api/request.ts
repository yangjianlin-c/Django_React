const BASE_URL = "http://127.0.0.1:8000"; // 根据你的 Django 后端实际地址调整

export async function apiRequest<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(BASE_URL + url, {
    credentials: "include",
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken'),
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();


}

  
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
