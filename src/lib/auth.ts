const AUTH_KEY = "app_authenticated";

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(AUTH_KEY) === "true";
}

export async function authenticate(password: string): Promise<boolean> {
  try {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (data.ok) {
      sessionStorage.setItem(AUTH_KEY, "true");
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
