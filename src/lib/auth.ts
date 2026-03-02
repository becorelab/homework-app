const AUTH_KEY = "app_authenticated";
const APP_PASSWORD = process.env.NEXT_PUBLIC_APP_PASSWORD || "";

export function isAuthEnabled(): boolean {
  return APP_PASSWORD.length > 0;
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  if (!isAuthEnabled()) return true;
  return sessionStorage.getItem(AUTH_KEY) === "true";
}

export function authenticate(password: string): boolean {
  if (password === APP_PASSWORD) {
    sessionStorage.setItem(AUTH_KEY, "true");
    return true;
  }
  return false;
}

export function getAppPassword(): string {
  return APP_PASSWORD;
}
