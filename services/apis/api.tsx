const base_Url = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000/";
const api_key = import.meta.env.VITE_API_KEY;

function isTokenExpired(token: string): boolean {
  try {
    const [, payload] = token.split(".");
    const decoded = JSON.parse(atob(payload));
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  } catch (e) {
    return true; // if decoding fails, treat as expired
  }
}

async function getrefreshtoken(token: string): Promise<string | null> {
  const res = await fetch(`${base_Url}api/v1/admin/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": `${api_key}`,
    },
    body: JSON.stringify({ refresh_token: token }),
  });
  if (!res.ok) {
    console.log("expired or invalid refresh token");
    return null;
  }
  const { data } = await res.json();

  return data.access_token;
}

export default async function apifetch<T>(
  endpoints: string,
  options: RequestInit = {},
  auth: boolean = true,
  retry: boolean = true
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-api-key": `${api_key}`,
    ...(options.headers as Record<string, string>),
  };

  if (auth) {
    const token = localStorage.getItem("access_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  const res = await fetch(`${base_Url}${endpoints}`, {
    ...options,
    headers,
  });

  if ((res.status === 401 || res.status === 400) && auth && retry) {
    const refresh_token = localStorage.getItem("refresh_token");
    if (!refresh_token || isTokenExpired(refresh_token)) {
      localStorage.clear();
      window.location.href = "/admin/login";
    }
    const newToken = await getrefreshtoken(`${refresh_token}`);
    if (newToken) {
      localStorage.setItem("access_token", newToken);
      return apifetch<T>(endpoints, options, auth, false);
    } else {
      //  Refresh also failed → force logout
      localStorage.clear();
      window.location.replace("/admin/login");
    }
  }

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.msg || "network connectivity issues");
  }
  return res.json();
}
