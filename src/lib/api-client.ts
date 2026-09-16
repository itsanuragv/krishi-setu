export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";
}

function getUserIdHeader() {
  if (typeof document === "undefined") return {};
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith("ks_uid="));
  const uid = match?.split("=")[1];
  return uid ? { "X-User-Id": uid } : {};
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  if (!headers.has("Content-Type") && init?.body) {
    headers.set("Content-Type", "application/json");
  }
  const userHeaders = getUserIdHeader();
  Object.entries(userHeaders).forEach(([k, v]) => headers.set(k, v));

  const res = await fetch(`${getBaseUrl()}${path}`, {
    ...init,
    headers,
    credentials: "include",
  });

  if (!res.ok) {
    let details: unknown;
    try {
      details = await res.json();
    } catch {
      details = await res.text();
    }
    const message =
      typeof details === "object" && details && "message" in details
        ? String((details as { message: string }).message)
        : `Request failed (${res.status})`;
    throw new ApiError(res.status, message, details);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
